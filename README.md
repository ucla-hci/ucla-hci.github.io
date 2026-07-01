# UCLA HCI Research — website

Static site for [hci.ucla.edu](https://hci.ucla.edu), served by GitHub Pages.

## How it works

All content lives in **`data.yml`** (team, alumni, projects, about, redirects) —
the single source of truth. A small generator, **`build.py`**, renders that data
into plain static HTML pages that are committed to the repo:

- `index.html` — projects grid + per-project detail overlays
- `team.html` — current members and alumni
- `about.html` — mission, contact, sponsors, map

Styling is in `assets/css/main.css`. There is no runtime framework: pages are
server-rendered HTML (good for SEO and load speed), with a small amount of
vanilla JS only for opening project overlays and legacy-link redirects.

## Editing content

1. Edit `data.yml`.
2. Regenerate the pages:

   ```bash
   python3 build.py        # needs PyYAML: pip install pyyaml
   ```

3. Commit `data.yml` **and** the regenerated `index.html` / `team.html` / `about.html`.

The GitHub Action in `.github/workflows/build.yml` also rebuilds automatically on
push if you forget step 2.

### data.yml notes

- It is real YAML — if a value contains a colon followed by a space (e.g.
  `Now: PhD @ Waterloo`), **wrap it in quotes**: `role: "Now: PhD @ Waterloo"`.
  Otherwise the build (and any YAML parser) will fail.
- Fields containing HTML (`abstract`, `bibtex`, `citation`, `mission`, …) are
  inserted as-is, so you can use `<br>`, `<ul>`, entities, etc.

## Legacy

The previous version was a jQuery single-page app that fetched and parsed
`data.yml` in the browser. The old files (`js/`, `style.css`, `config.yml`) are no
longer referenced and can be removed.
