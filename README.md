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
shorten, expand or paraphrase it when editing this page. Headings in
particular are exact: the H1/H2/H3 hierarchy carries the keyword targets, and
the page has exactly one H1, ten H2s and three H3s (the three planning
routes). Do not add heading levels — project card titles and the bold
lead-ins in the feasibility, process and qualification sections are
deliberately styled paragraphs, not headings.

Sections carry no label copy above their headings, so the anchor above each H2
is a short rule (`.kicker`) rather than a word.

**No square-bracket placeholders may be published.** Where content was not
supplied, the element is omitted rather than shipped with placeholder text.
Currently omitted, pending content:

- **Hero image** — the panel renders as a flat tonal block. Replace the
  `div.hero__media` with an `img` once the photograph is supplied.
- **Project card description and planning route/status lines** — omitted
  entirely until the planning lead confirms them.
- **Testimonial block** — deleted. Only a real, attributable rural conversion
  quote may be added; existing site testimonials must not be reused.
- **Green Belt guide link** — the brief left the destination URL unfilled, so
  the link is not rendered.

Two FAQ answers contain facts flagged for confirmation before publication (the
planning determination periods, and the current Class Q extension allowance).
Both are marked with `UNCONFIRMED` comments in `index.html`.

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

The three `/locations/...` URLs and the three `/projects/...` URLs are assumed
from this repository's own convention — the copy brief names the links but does
not give their destinations. Confirm them before launch.

The copy brief specifies this page's slug as `/services/rural-conversions`. It
is currently served at `/` as the site's primary page, with `<link rel="canonical">`
pointing at `/` to match, and `/services/rural-conversions` redirecting to `/`
(see `vercel.json`). If the site later grows a full page tree, move the page to
`/services/rural-conversions`, drop that redirect, and update the canonical and
the nav link.

## Redirects

`vercel.json` carries redirects only — it does not set a framework or build
command, so zero-config static detection still applies.

- `/blog-posts/class-q-barn-conversion-planning-guide` → `/news/class-q-barn-conversion-planning-guide` (301)
- `/services/rural-conversions` → `/` (307, while the page is served at the root)

Note the 301 destination does not exist yet — the guide page still needs to be
built.
