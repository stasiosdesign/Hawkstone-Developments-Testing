# Hawkstone — site workspace

Internal testing site for Hawkstone's landing pages. The root URL is a simple
folder-style index, not a public marketing homepage — it exists to organise
service pages as they're built and to make each one easy to open, review and
iterate on independently.

## Structure

```
index.html                              Root index — a single "Services" folder
services/index.html                     Services index — six service folders
services/rural-conversions/index.html   Barn & Rural Conversions — the completed page
services/luxury-architecture/index.html Holding page
services/heritage-projects/index.html   Holding page
services/planning-applications/index.html  Holding page
services/project-management/index.html  Holding page
services/3d-visualisations/index.html   Holding page

assets/css/main.css        Styles for the Barn & Rural Conversions page only
assets/css/workspace.css   Styles for the root/services index and holding pages
```

Every page is plain HTML and CSS — no build step, no bundler, no framework.
The only runtime JavaScript anywhere in the site is the FAQ accordion on the
Rural Conversions page, which uses native `<details>`/`<summary>` (no
JavaScript at all), plus that same page's JSON-LD `<script>` block.

`main.css` and `workspace.css` are deliberately separate stylesheets. The
Rural Conversions page is finished, client-supplied copy — it must not be
touched by changes made to the workspace chrome, so the workspace pages carry
their own small stylesheet rather than extending or importing `main.css`.

## Routes

All folder pages are `index.html` files served at their directory path with a
trailing slash (`/services/`, `/services/rural-conversions/`, etc.) — the
standard static-hosting convention, and how Vercel resolves directories with
no configuration required.

| Route | Page |
|---|---|
| `/` | Root index (one folder: Services) |
| `/services/` | Services index (six folders) |
| `/services/rural-conversions/` | Barn & Rural Conversions — completed page |
| `/services/luxury-architecture/` | Holding page |
| `/services/heritage-projects/` | Holding page |
| `/services/planning-applications/` | Holding page |
| `/services/project-management/` | Holding page |
| `/services/3d-visualisations/` | Holding page |

`heritage-projects` and `luxury-architecture` reuse the exact slugs the Rural
Conversions page already links to internally, so those two links now resolve
instead of 404ing — no edits were needed on that page for that to happen.

To add another service, create `services/<slug>/index.html` and add one
folder tile linking to it from `services/index.html`.

## Local development

Serve the repository root with any static file server, e.g.:

```bash
npx serve .
```

Opening `index.html` directly as a `file://` URL will not resolve the
absolute-path stylesheet and page links correctly — use a local server.

## Deployment (Vercel)

This is a zero-config static site. Vercel serves each directory's `index.html`
at that directory's path with no install or build step required.

In the Vercel project settings the **Framework Preset** must be **Other**, with
**Build Command**, **Output Directory** and **Install Command** left empty.

`vercel.json` carries one redirect only (see below) — it sets no framework or
build command, so zero-config static detection is unaffected.

## Redirects

- `/blog-posts/class-q-barn-conversion-planning-guide` → `/news/class-q-barn-conversion-planning-guide` (301)

Note the destination does not exist yet — the guide page still needs to be
built. The `/services/rural-conversions` → `/` redirect that previously stood
in for this page (while it was served at the root) has been removed now that
the page lives at its real slug.

## The Barn & Rural Conversions page

`services/rural-conversions/index.html` is complete, client-approved copy —
do not rewrite, shorten, expand or paraphrase it, and do not change its
design or layout. Moving it into `services/rural-conversions/` from the
repository root required exactly four mechanical edits, and nothing else in
the file was touched:

- `<link rel="canonical">` updated to the page's real URL
- its stylesheet `<link>` changed from a relative to an absolute path
  (`/assets/css/main.css`), since the page no longer lives at the root
- the two self-referencing "Rural Conversions" nav links (header and footer)
  updated to point at the page's own new URL instead of `/`

Content notes carried over from that page's own brief:

Page copy is authoritative and supplied by the client. Headings are exact:
the H1/H2/H3 hierarchy carries keyword targets — one H1, ten H2s, exactly
three H3s (the three planning routes). Project card titles and the bold
lead-ins in the feasibility, process and qualification sections are styled
paragraphs, not headings, and should stay that way.

**No square-bracket placeholders may be published.** Currently omitted,
pending content:

- **Hero image** — renders as a flat tonal block. Replace `div.hero__media`
  with an `img` once the photograph is supplied.
- **Project card description and planning route/status lines** — omitted
  until the planning lead confirms them.
- **Testimonial block** — deleted. Only a real, attributable rural
  conversion quote may be added; existing site testimonials must not be
  reused.
- **Green Belt guide link** — the brief left the destination URL unfilled,
  so the link is not rendered.

Two FAQ answers contain facts flagged for confirmation before publication
(the planning determination periods, and the current Class Q extension
allowance). Both are marked with `UNCONFIRMED` comments in the file.

The page links out to routes that don't exist yet, so these still 404:

- `/services/consultation`
- `/services/luxury-architecture` and `/services/heritage-projects` now
  resolve (to their holding pages); the rest below do not
- `/projects` and the three individual project pages
- `/news/class-q-barn-conversion-planning-guide` and `/news/green-belt-guide-2026`
- the three `/locations/...` county pages

The three `/locations/...` URLs and the three `/projects/...` URLs are
assumed from this repository's own convention — the copy brief names the
links but does not give their destinations. Confirm them before launch.
