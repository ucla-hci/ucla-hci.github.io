---
name: add-project
description: Add a new project to data.yml from zandbox/submitted-data.csv. Downloads thumbnail, video, and images to appropriate locations; converts bibtex to HTML; generates a paper snapshot from the PDF first page; inserts the new entry at the top of the projects list. Usage: /add-project <ProjectName>
---

# Add New Project

The project name is in `args`. It must match the `Name` column in `zandbox/submitted-data.csv` exactly. Work from the repo root `/Users/prof.biu/dev/ucla-hci.github.io`.

## Step 0 — Install gdown if missing

```bash
pip3 show gdown &>/dev/null || pip3 install --break-system-packages -q gdown
```

## Step 1 — Parse the CSV entry

Run this Python snippet to locate the row and print all its fields:

```python
import csv, json, sys

name = "<arg>"  # exact value from args
with open('zandbox/submitted-data.csv') as f:
    rows = {r['Name']: r for r in csv.DictReader(f)}

if name not in rows:
    print(f"Not found. Available names:\n" + "\n".join(rows))
    sys.exit(1)

print(json.dumps(rows[name], indent=2))
```

Review the output with the user before proceeding.

## Step 2 — Derive slugs and filenames

From the row data, compute:

- **`name_slug`**: lowercase Name, strip/replace non-alphanumeric with underscores  
  e.g. `OverrelianceBehaviors` → `overreliancebehaviors`
- **`pub_slug`**: lowercase Publication, remove spaces  
  e.g. `CHI 2026` → `chi2026`, `EACL 2026` → `eacl2026`
- **`img_filename`**: `t_<name_slug>.<ext>` — ext from the Drive file's MIME or URL; default to `jpg`
- **`thumbnail_filename`**: `<pub_slug>_<name_slug>_thumbnail.jpg`

Extract Google Drive file IDs with this helper:

```python
import re

def gdrive_id(url):
    # handles open?id=, /file/d/<id>/, and /folders/<id>/
    m = re.search(r'(?:id=|/d/|/folders/)([a-zA-Z0-9_-]{20,})', url)
    return m.group(1) if m else None
```

## Step 3 — Download thumbnail image → assets/

```bash
gdown "https://drive.google.com/uc?id=<THUMBNAIL_ID>" \
  -O "assets/<img_filename>"```

If gdown fails with an auth error, fall back to:
```bash
curl -L "https://drive.google.com/uc?export=download&id=<THUMBNAIL_ID>" \
  -o "assets/<img_filename>"
```

## Step 4 — Download paper PDF and generate first-page snapshot

Download PDF to the scratchpad:
```bash
SCRATCH="/private/tmp/claude-502/-Users-prof-biu-dev-ucla-hci-github-io/4aaee75b-aadb-4741-8d52-5c00fefebf94/scratchpad"
gdown "https://drive.google.com/uc?id=<PAPER_ID>" \
  -O "${SCRATCH}/<name_slug>_paper.pdf"```

Convert the first page to JPEG using PyMuPDF (available as `fitz`):

```python
import fitz

SCRATCH = "/private/tmp/claude-502/-Users-prof-biu-dev-ucla-hci-github-io/4aaee75b-aadb-4741-8d52-5c00fefebf94/scratchpad"
doc = fitz.open(f"{SCRATCH}/<name_slug>_paper.pdf")
page = doc[0]
pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))  # 2x scale ≈ 150 dpi
pix.save(f"assets/<thumbnail_filename>")
print("Saved assets/<thumbnail_filename>")
```

## Step 5 — Download video to scratchpad

```bash
SCRATCH="/private/tmp/claude-502/-Users-prof-biu-dev-ucla-hci-github-io/4aaee75b-aadb-4741-8d52-5c00fefebf94/scratchpad"
gdown "https://drive.google.com/uc?id=<VIDEO_ID>" \
  -O "${SCRATCH}/<name_slug>_video"```

If the video URL is a folder, skip and note it. Tell the user the file path so they can upload to Vimeo.

## Step 6 — Download images to scratchpad

The Images URL is typically a Google Drive folder:

```bash
SCRATCH="/private/tmp/claude-502/-Users-prof-biu-dev-ucla-hci-github-io/4aaee75b-aadb-4741-8d52-5c00fefebf94/scratchpad"
gdown --folder "https://drive.google.com/drive/folders/<IMAGES_ID>" \
  -O "${SCRATCH}/<name_slug>_images/"```

If it's a single file (non-folder), use the same `gdown uc?id=` form. Tell the user the folder path so they can upload to Flickr.

## Step 7 — Convert BibTeX to HTML

Apply the same transforms as `fixbibtex.py`:

```python
def bibtex_to_html(raw):
    return (raw
        .replace('\n', '<br>')
        .replace('\t', '&nbsp; &nbsp; &nbsp; &nbsp;')
        .replace('  ', '&nbsp; &nbsp; &nbsp; &nbsp;')
        .replace('\&', '&amp;'))
```

## Step 8 — Build the authors list

Split the `Authors` field on newlines; each non-empty line is one author entry.

## Step 9 — Build a plain-text citation

Construct a readable citation from available fields (authors, title, publication, year from timestamp). Match the style of nearby entries in data.yml (e.g., "Author1, Author2, and Author3. Year. Title. In Proceedings of ...").

## Step 10 — Insert entry into data.yml

Read `data.yml` with PyYAML, prepend the new entry to `data['projects']`, then write back. Use `ruamel.yaml` if available for round-trip fidelity, otherwise use `yaml.dump` with these options:

```python
import yaml

with open('data.yml') as f:
    data = yaml.safe_load(f)

new_entry = {
    'name': row['Name'],
    'title': row['Title'],
    'authors': [a.strip() for a in row['Authors'].splitlines() if a.strip()],
    'pubs': row['Publication'],
    'img': img_filename,
    'abstract': row['Abstract'],
    'thumbnail': thumbnail_filename,
    'paperUrl': row.get('arXiv link') or 'TODO_ADD_PAPER_URL',
    'bibtex': bibtex_html,
    'citation': citation_text,
    # Leave these for manual entry after uploading:
    'video': 'TODO_ADD_VIMEO_ID',
    'videoSite': 'vimeo',
    'albumEmbedCode': 'TODO_ADD_FLICKR_EMBED',
}

data['projects'].insert(0, new_entry)

with open('data.yml', 'w') as f:
    yaml.dump(data, f, allow_unicode=True, default_flow_style=False, sort_keys=False)
```

**Important**: After writing, visually verify the new entry at the top of `projects:` in data.yml looks correct and matches the style of adjacent entries (quoting, indentation). Fix any formatting issues with Edit.

## Step 11 — Report

After completing all steps, tell the user:

1. Which files were saved to `assets/`: thumbnail image, paper snapshot
2. Where the video was downloaded (scratchpad path) → **upload to Vimeo, then set `video:` field**
3. Where the images were downloaded (scratchpad path) → **upload to Flickr, then set `albumEmbedCode:` field**
4. Which fields in the new data.yml entry still need manual completion:
   - `video` (Vimeo ID)
   - `albumEmbedCode` (Flickr embed code)
   - `citation` (if auto-generated, confirm it's correct)
   - `paperUrl` (if no arXiv/DOI link was in the CSV)

## Notes

- If any Download step fails (auth wall, large file), note it and continue with the rest — don't abort.
- If `video` or `images` fields are empty in the CSV, omit the corresponding fields from the data.yml entry rather than adding TODO placeholders.
- The `img` field is the project card icon shown on the homepage; `thumbnail` is a screenshot of the paper's first page shown in the project detail view.
- Keep the data.yml entry order consistent with existing entries (all string values quoted if they contain colons or special chars).
