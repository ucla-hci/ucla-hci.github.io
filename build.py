#!/usr/bin/env python3
"""
Static site generator for UCLA HCI Research.

Reads `data.yml` (the single source of truth the lab edits) and renders plain,
server-side HTML pages: index.html (projects), team.html, about.html.

Run:  python3 build.py
No third-party build tools required beyond PyYAML.
"""

import html
import json
import re
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent
SITE_URL = "https://hci.ucla.edu"
SITE_TITLE = "UCLA HCI Research"
SITE_DESC = ("UCLA HCI Research innovates interactive systems that catalyze "
             "advances in AI to align with human values, assimilate human "
             "thoughts, and augment human abilities.")
OG_IMAGE = f"{SITE_URL}/assets/mission.jpeg"


# --------------------------------------------------------------------------- #
# helpers
# --------------------------------------------------------------------------- #
def slugify(title):
    """Mirror the legacy JS strip(): drop punctuation, spaces -> '-', lowercase.
    Kept identical so old deep links (#projects-<slug>) map to the new #<slug>."""
    if not title:
        return ""
    title = re.sub(r"""[&/\\#,+()$~%.'":*;?<>{}]""", "", title)
    return title.replace(" ", "-").lower()


def attr(s):
    """Escape a string for use inside an HTML attribute / <meta> content."""
    return html.escape(str(s or ""), quote=True)


def strip_tags(s):
    return re.sub(r"<[^>]+>", " ", str(s or "")).replace("&nbsp;", " ").strip()


def asset(name):
    return f"assets/{name}"


# --------------------------------------------------------------------------- #
# shared chrome
# --------------------------------------------------------------------------- #
NAV = [("About", "about.html", "about"),
       ("Projects", "index.html", "projects"),
       ("Team", "team.html", "team")]


def head(title, description, canonical):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{attr(title)}</title>
  <meta name="description" content="{attr(description)}">
  <link rel="canonical" href="{SITE_URL}/{canonical}">
  <link rel="icon" href="favicon.ico">

  <!-- Open Graph / Twitter -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="{attr(SITE_TITLE)}">
  <meta property="og:title" content="{attr(title)}">
  <meta property="og:description" content="{attr(description)}">
  <meta property="og:url" content="{SITE_URL}/{canonical}">
  <meta property="og:image" content="{OG_IMAGE}">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;700&family=Overpass+Mono&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/main.css">
</head>
<body>
"""


def header(active):
    links = "".join(
        '<a href="{}"{}>{}</a>'.format(
            href, ' class="active"' if key == active else "", label)
        for label, href, key in NAV)
    return f"""  <header class="site-header">
    <div class="container">
      <a class="brand" href="index.html"><img src="{asset('ucla-hci-log-dark.png')}" alt="{attr(SITE_TITLE)}"></a>
      <nav class="nav">{links}</nav>
    </div>
  </header>
  <main class="container">
"""


def footer():
    return """  </main>
  <footer class="site-footer">
    &copy;2018&ndash;<span id="year"></span> UCLA HCI Research. All rights reserved.
    <script>document.getElementById('year').textContent = new Date().getFullYear();</script>
  </footer>
</body>
</html>
"""


# --------------------------------------------------------------------------- #
# team
# --------------------------------------------------------------------------- #
def member_card(m, compact=False):
    primary = f'<img class="primary" src="{asset(m["img"])}" alt="{attr(m["name"])}" loading="lazy">'
    alt = (f'<img class="alt" src="{asset(m["imgalt"])}" alt="" aria-hidden="true" loading="lazy">'
           if m.get("imgalt") else "")
    portrait = f'<div class="portrait">{primary}{alt}</div>'
    expertise = ("" if compact else
                 f'<div class="expertise">{m["expertise"]}</div>' if m.get("expertise") else "")
    role = f'<div class="role">{m["role"]}</div>' if m.get("role") else ""
    now = f'<div class="now">Now: {m["now"]}</div>' if m.get("now") else ""
    inner = f"""{portrait}
      <div class="name">{m['name']}</div>
      {role}{now}{expertise}"""
    if m.get("url"):
        return f'<a class="member" href="{attr(m["url"])}" target="_blank" rel="noopener">{inner}</a>'
    return f'<div class="member">{inner}</div>'


def render_team(data):
    people = "".join(member_card(m) for m in data["team"])
    alumni = "".join(member_card(m, compact=True) for m in data["alumni"])
    body = f"""    <h1 class="page-title">Team</h1>
    <div class="grid team">
{people}
    </div>

    <h2 class="section-title">Alumni</h2>
    <div class="grid team alumni">
{alumni}
    </div>
"""
    return (head("Team — " + SITE_TITLE, "Meet the members and alumni of " + SITE_TITLE + ".", "team.html")
            + header("team") + body + footer())


# --------------------------------------------------------------------------- #
# projects
# --------------------------------------------------------------------------- #
def video_embed(project):
    vid = project.get("video")
    if not vid:
        return ""
    site = project.get("videoSite", "youtube")
    if site == "vimeo":
        src = f"https://player.vimeo.com/video/{vid}"
    else:
        src = f"https://www.youtube.com/embed/{vid}?rel=0"
    return (f'<div class="media"><div style="position:relative;aspect-ratio:16/9">'
            f'<iframe src="{attr(src)}" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%" '
            f'allow="fullscreen; picture-in-picture" allowfullscreen></iframe></div></div>')


def album_embed(project):
    if project.get("albumEmbedCode"):
        # keep the Flickr thumbnail link; drop the auto-embed <script> (no 3rd-party JS)
        code = re.sub(r"<script.*?</script>", "", project["albumEmbedCode"], flags=re.S)
        return f'<div class="media">{code}</div>'
    if project.get("album"):
        src = ("https://flickrembed.com/cms_embed.php?source=flickr&layout=responsive&input="
               f"{project['album']}&sort=0&by=album&theme=default_notextpanel&scale=fit&limit=100&skin=alexis")
        return (f'<div class="media"><iframe src="{attr(src)}" loading="lazy" '
                f'style="width:100%;height:60vh;border:0" allowfullscreen></iframe></div>')
    return ""


def pub_block(project):
    if not (project.get("citation") and project.get("bibtex")):
        return ""
    thumb = ""
    if project.get("thumbnail"):
        img = f'<img class="paper-thumb" src="{asset(project["thumbnail"])}" alt="Paper thumbnail" loading="lazy">'
        thumb = f'<a href="{attr(project.get("paperUrl", "#"))}" target="_blank" rel="noopener">{img}</a>'
    return f"""<div class="pub">
        {thumb}
        <div class="citation">{project['citation']}</div>
        <div class="bibtex">{project['bibtex']}</div>
      </div>"""


def project_card(project):
    slug = slugify(project["name"])
    meta = f'<div class="meta">{project["pubs"]}</div>' if project.get("pubs") else ""
    return f"""      <a class="card" href="#{slug}">
        <img class="thumb" src="{asset(project['img'])}" alt="{attr(project['name'])}" loading="lazy">
        <div class="name">{project['name']}</div>
        {meta}
      </a>"""


def project_overlay(project):
    slug = slugify(project["name"])
    title = project.get("title") or project["name"]
    authors = ""
    if project.get("authors"):
        authors = '<div class="authors">' + "<br>".join(project["authors"]) + "</div>"
    abstract = f'<p>{project["abstract"]}</p>' if project.get("abstract") else ""
    # Heavy embeds go in a <template>; injected by JS only when the overlay opens.
    media = video_embed(project) + album_embed(project)
    media_tpl = f'<template class="media-tpl">{media}</template>' if media else ""
    return f"""  <div class="overlay" id="{slug}" role="dialog" aria-modal="true" aria-label="{attr(title)}">
    <div class="panel">
      <a class="close" href="#" aria-label="Close">&times;</a>
      <h2>{title}</h2>
      {authors}
      {abstract}
      <div class="media-slot"></div>
      {media_tpl}
      {pub_block(project)}
    </div>
  </div>"""


OVERLAY_JS = """
  <script>
  (function () {
    var overlays = document.querySelectorAll('.overlay');
    function sync() {
      var id = decodeURIComponent(location.hash.slice(1));
      var anyOpen = false;
      overlays.forEach(function (o) {
        var open = o.id === id;
        if (open) anyOpen = true;
        var slot = o.querySelector('.media-slot');
        var tpl = o.querySelector('template.media-tpl');
        if (open && tpl && slot && !slot.dataset.loaded) {
          slot.appendChild(tpl.content.cloneNode(true));
          slot.dataset.loaded = '1';
          // If this project has a Flickr album embed, (re)run Flickr's embedr
          // script so the just-injected <a data-flickr-embed> becomes the
          // interactive album slideshow (a fresh <script> element re-executes it).
          if (slot.querySelector('[data-flickr-embed]')) {
            var fs = document.createElement('script');
            fs.async = true;
            fs.charset = 'utf-8';
            fs.src = 'https://embedr.flickr.com/assets/client-code.js';
            document.body.appendChild(fs);
          }
        }
      });
      document.body.style.overflow = anyOpen ? 'hidden' : '';
    }
    function close() {
      if (!location.hash) return;
      var y = window.pageYOffset || document.documentElement.scrollTop;
      document.body.style.overflow = '';
      // Clearing the fragment is what actually drops :target and hides the overlay;
      // history.replaceState alone does NOT update :target.
      location.hash = '';
      history.replaceState(null, '', location.pathname + location.search);
      window.scrollTo(0, y);
    }
    overlays.forEach(function (o) {
      o.addEventListener('click', function (e) {
        if (e.target === o || e.target.classList.contains('close')) { e.preventDefault(); close(); }
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && location.hash) close();
    });
    window.addEventListener('hashchange', sync);
    sync();
  })();
  </script>
"""


def redirect_shim(redirects):
    mapping = {r["name"]: r["url"] for r in redirects}
    return f"""  <script>
  (function () {{
    var redirects = {json.dumps(mapping)};
    var h = location.hash.replace(/^#/, '');
    if (!h) return;
    if (redirects[h]) {{ location.replace(redirects[h]); return; }}          // legacy shortlinks
    if (h === 'team') {{ location.replace('team.html'); return; }}
    if (h === 'aboutus') {{ location.replace('about.html'); return; }}
    if (h === 'projects') {{ history.replaceState(null, '', location.pathname); return; }}
    if (h.indexOf('projects-') === 0) {{ location.replace('#' + h.slice(9)); }}  // #projects-foo -> #foo
  }})();
  </script>
"""


def render_projects(data):
    cards = "\n".join(project_card(p) for p in data["projects"])
    overlays = "\n".join(project_overlay(p) for p in data["projects"])
    body = f"""    <h1 class="page-title">Projects</h1>
    <div class="grid projects">
{cards}
    </div>
"""
    # redirect shim runs first (in head order it's fine here, before content is interacted with)
    return (head(SITE_TITLE, SITE_DESC, "")  # canonical = site root
            + redirect_shim(data.get("redirects", []))
            + header("projects") + body + footer().replace("</main>", "</main>\n" + overlays)
            + "")  # overlays live outside <main>; footer() places them right after </main>


# --------------------------------------------------------------------------- #
# about
# --------------------------------------------------------------------------- #
def render_about(data):
    about = data["aboutus"][0]
    photos = "".join(
        f'<img src="{asset(p)}" alt="UCLA HCI Research group photo" loading="lazy">'
        for p in (about.get("photos") or []) if p)
    contact = about.get("contact", {})
    contact_html = "".join(
        f"<p>{contact[k]}</p>" for k in ("description", "address", "email") if contact.get(k))
    sponsors = "".join(
        f'<a href="{attr(s["url"])}" target="_blank" rel="noopener">'
        f'<img src="{asset(s["img"])}" alt="Sponsor" loading="lazy"></a>'
        for s in (about.get("sponsors") or []))
    body = f"""    <h1 class="page-title">About</h1>
    <div class="about-grid">
      <div class="intro">
        <h2>Mission</h2>
        <div class="mission">{about['mission']}</div>
        <div class="contact">{contact_html}</div>
      </div>
      <div class="photos">{photos}</div>
    </div>

    <h2 class="section-title">Sponsors</h2>
    <p class="lede">We are generously supported by:</p>
    <div class="sponsors">{sponsors}</div>

    <h2 class="section-title">Find us</h2>
    <div class="map">{about.get('map', '')}</div>
"""
    return (head("About — " + SITE_TITLE, strip_tags(about["mission"])[:200], "about.html")
            + header("about") + body + footer())


# --------------------------------------------------------------------------- #
# main
# --------------------------------------------------------------------------- #
def main():
    with open(ROOT / "data.yml", encoding="utf-8") as f:
        data = yaml.safe_load(f)

    # inject the overlay JS just before </body> on the projects page
    projects_html = render_projects(data).replace("</body>", OVERLAY_JS + "</body>")

    outputs = {
        "index.html": projects_html,
        "team.html": render_team(data),
        "about.html": render_about(data),
    }
    for name, content in outputs.items():
        (ROOT / name).write_text(content, encoding="utf-8")
        print(f"wrote {name} ({len(content):,} bytes)")


if __name__ == "__main__":
    main()
