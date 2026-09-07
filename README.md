# Hawkstone — Rural Conversions

Marketing site for Hawkstone's rural conversions service. The Rural Conversions
page is the primary page and is served from the root URL `/`.

## Structure

```
index.html            The Rural Conversions page (served at /)
assets/css/main.css   All page styles, organised section by section
```

The page is plain HTML and CSS. There is no build step, no bundler and no
runtime JavaScript — the FAQ accordion uses native `<details>`/`<summary>` and
the only `<script>` in the page is the JSON-LD block.

`assets/css/main.css` is ordered to mirror the page: design tokens, layout
primitives, typography, shared components (links, buttons, content slots),
then one clearly commented block per numbered page section.

## Local development

Open `index.html` in a browser, or serve the folder with any static server:

```bash
npx serve .
```

## Deployment (Vercel)

This is a zero-config static site. Vercel serves `index.html` from the
repository root at `/`, with no install or build step required.

In the Vercel project settings the **Framework Preset** must be **Other**, with
**Build Command**, **Output Directory** and **Install Command** left empty. No
`vercel.json` is needed.

## Content

Page copy is authoritative and supplied by the client — do not rewrite,
shorten, expand or paraphrase it when editing this page.

Placeholders still in the markup are unfilled content slots, marked visually so
they cannot ship unnoticed. Fill or remove each one before launch:

- the hero image
- one description line and one planning route/status line per project card
- the barn conversion cost guide link
- the two editorial notes in the projects section (project card title format,
  and the optional testimonial block)

## Known gaps

The page links out to pages that do not exist in this repository yet, so those
routes currently 404:

- `/services/consultation`
- `/services/heritage-projects`
- `/services/luxury-architecture`
- `/projects` and the three individual project pages
- `/news/class-q-barn-conversion-planning-guide`
- `/news/green-belt-guide-2026`
- the three `/locations/...` county pages

These are the target URLs specified in the copy document and have been left as
written. They will resolve once those pages are added.

The copy document specifies this page's path as `/services/rural-conversions`.
It is currently served at `/` as the site's primary page, and `<link rel="canonical">`
points at `/` to match. If the site later grows a full page tree, move the page
to `/services/rural-conversions` and update the canonical and the nav link.
