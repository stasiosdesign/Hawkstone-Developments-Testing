# Hawkstone — site workspace

Internal testing site for Hawkstone's landing pages. The root URL is a simple
folder-style index, not a public marketing homepage — it exists to organise
service pages as they're built and to make each one easy to open, review and
iterate on independently.

## Structure

```
index.html                                 Root index — a single "Services" folder
services/index.html                        Services index — six service folders

services/rural-conversions/index.html      Barn & Rural Conversions — live, finished page
services/heritage-projects/index.html      Heritage Projects — live, held pending Part C
services/luxury-architecture/index.html    Luxury Architecture — live, held pending Part C
services/planning-applications/index.html  Holding page
services/project-management/index.html     Holding page
services/3d-visualisations/index.html      Holding page

assets/css/main.css          Barn & Rural Conversions' own stylesheet — do not edit
assets/css/service-page.css  Shared design system for Heritage Projects and Luxury
                              Architecture (and future full service pages)
assets/css/workspace.css     Styles for the root/services index and holding pages
assets/js/smooth-scroll.js   Shared Lenis init, loaded on every page except
                              Barn & Rural Conversions
```

Every page is plain HTML and CSS — no build step, no bundler, no framework.
The only JavaScript in the site is Lenis (see below) and, on the three full
service pages, the FAQ accordion's markup (native `<details>`/`<summary>`,
no JS) and a JSON-LD `<script>` block.

## Why there are two nearly-identical stylesheets

`main.css` is the Barn & Rural Conversions page's own file. That page is
finished, client-approved work and **must never be edited** — not even as a
side effect of styling something else. `service-page.css` is a fork of it
(same tokens, layout primitives, typography and component vocabulary, plus a
handful of new section variants — see the comment at its head) used by
Heritage Projects and Luxury Architecture, and available for any future
service page. The two files can drift from each other over time; that's the
point. If you need a new component for a future page, add it to
`service-page.css`, not `main.css`.

`workspace.css` is smaller and separate again, for the root index, services
index and the still-holding pages — internal-tool chrome, not landing-page
design.

## Smooth scroll (Lenis)

Every page loads [Lenis](https://github.com/darkroomengineering/lenis) 1.2.3
from jsDelivr (`lenis.css` in `<head>`, `lenis.min.js` before `</body>`) plus
the shared init at `assets/js/smooth-scroll.js`, **except**
`services/rural-conversions/index.html`, which carries no Lenis references at
all — consistent with that page never being touched by work done elsewhere.
The init respects `prefers-reduced-motion` and no-ops if Lenis fails to load.

## Routes

All folder pages are `index.html` files served at their directory path with a
trailing slash — the standard static-hosting convention, and how Vercel
resolves directories with no configuration required.

| Route | Page |
|---|---|
| `/` | Root index (one folder: Services) |
| `/services/` | Services index (six folders) |
| `/services/rural-conversions/` | Barn & Rural Conversions — live |
| `/services/heritage-projects/` | Heritage Projects — live, held pending Part C |
| `/services/luxury-architecture/` | Luxury Architecture — live, held pending Part C |
| `/services/planning-applications/` | Holding page |
| `/services/project-management/` | Holding page |
| `/services/3d-visualisations/` | Holding page |

To add another service, create `services/<slug>/index.html` and add one
folder tile linking to it from `services/index.html`.

## Local development

Serve the repository root with any static file server, e.g.:

```bash
npx serve .
```

Opening `index.html` directly as a `file://` URL will not resolve the
absolute-path stylesheets and page links correctly — use a local server.

## Deployment (Vercel)

This is a zero-config static site. Vercel serves each directory's `index.html`
at that directory's path with no install or build step required.

In the Vercel project settings the **Framework Preset** must be **Other**, with
**Build Command**, **Output Directory** and **Install Command** left empty.

`vercel.json` carries one redirect only — it sets no framework or build
command, so zero-config static detection is unaffected.

## Redirects

- `/blog-posts/class-q-barn-conversion-planning-guide` → `/news/class-q-barn-conversion-planning-guide` (301)

Note the destination does not exist yet — the guide page still needs to be
built.

---

## The three live service pages

Each page's copy is client-authoritative and supplied wholesale — do not
rewrite, shorten, expand or paraphrase it, and do not change a finished
page's design or layout independently of new copy. Headings are exact on all
three: the H1/H2/H3 hierarchy carries keyword targets, and none of the three
promote body copy (bold lead-ins, project card titles) to heading levels
beyond what each brief specifies.

**No square-bracket placeholder may be published on any page.** Where
content wasn't supplied or a fact is unconfirmed, the element is omitted
(never rendered with visible placeholder text), and flagged with an HTML
comment in the file plus a line below.

### Barn & Rural Conversions (`services/rural-conversions/index.html`)

One H1, ten H2s, three H3s (the three planning routes). Moving it here from
the repository root required exactly four mechanical edits — its
`<link rel="canonical">`, its stylesheet `<link>` (relative → absolute path,
since it no longer lives at the root), and its two self-referencing "Rural
Conversions" nav links (header and footer) — and nothing else in the file has
ever been touched since.

Omitted, pending content: the hero image; each project card's description and
planning route/status line; the testimonial block; the Green Belt guide link.
Two FAQ answers (the planning determination periods, and the current Class Q
extension allowance) are marked `UNCONFIRMED` and published as written,
pending sign-off.

Still 404: `/services/consultation`, `/projects` and the three individual
project pages, both `/news/...` guides, the three `/locations/...` county
pages.

### Heritage Projects (`services/heritage-projects/index.html`)

One H1, ten H2s, three H3s (the three consent stages in B4 — Listed Building
Consent & planning permission, heritage statements, conservation officer
engagement). These are sequential stages of one process rather than
alternative routes, so they render as a stacked full-width sequence
(`.routes--stack`) instead of Rural's 2-up peer grid.

Omitted, pending content:
- hero image (Barrow House or Castle Street)
- the "Our guide to Listed Building Consent" and "Planning permission in a
  conservation area" links — both destination URLs unconfirmed
- all three project cards' description and consent-status lines, and any
  listing grade (never state one unless confirmed — none was)
- the testimonial block
- the Green Belt guide link in FAQ Q8

**Not resolved, blocking publication per the brief's own Part C:**
1. ARB status — decides "architects" vs "architecture" in the title/H1. The
   alternative title is in an HTML comment at the top of the file.
2. Project details and consent statuses for the three cards.
3. A real, attributable heritage testimonial, or confirmation to leave it out.
4. Nav label — the brief flags "Heritage Projects" vs "Heritage Design" as
   unresolved. This build uses "Heritage Projects" throughout, because that's
   the label the *unmodified* Rural Conversions page already links with in
   two places — using anything else would make an existing, untouched link
   inconsistent with the page it points to.
5. **Legal accuracy sign-off on every FAQ answer**, particularly the
   unauthorised-works question (Q9) — flagged explicitly by the brief as the
   one most needing a planning expert's review. Nothing in this FAQ has had
   that review; all ten answers are published as drafted.
6. GA4 key events — not configured.

Project page slugs (`/projects/barrow-house-barrow-upon-trent`,
`/projects/castle-street-melbourne`, `/projects/55-derby-road-melbourne`) are
assumed from this repository's convention, not confirmed.

### Luxury Architecture (`services/luxury-architecture/index.html`)

One H1, ten H2s, three H3s (the three project types in B4 — bespoke new
homes, replacement dwellings, complete redesigns). Section order follows the
brief exactly: Where We Work (B9) and Related Services (B11) are two separate
sections with the FAQ between them, not merged into one block the way Rural
and Heritage do it.

Omitted, pending content:
- hero image (Sandboro House Farm or Furs House)
- the "Knock down and rebuild, or renovate?", "What you can build in the
  Green Belt" and "cost of building a bespoke home" links — all destination
  URLs unconfirmed
- any award claim for Sandboro ("award-winning" is not stated anywhere,
  because the brief is explicit that it must not appear without the award
  being named, and none was supplied)
- project values and client names — not published, per the brief

**Project cards — the biggest content gap on this page.** Of the brief's
three cards, only fragments are confirmed:
- **Sandboro House Farm**: renders with "Derbyshire" only — the specific town
  (`[place]`) was left blank in the brief.
- **Furs House**: renders with no place line at all — neither town nor county
  was supplied.
- **Third card**: not rendered. The brief offers two unconfirmed alternative
  names ("Private Dwelling" / "Primrose Bank") rather than a settled title,
  so nothing was guessed. The projects grid currently shows two cards, not
  three (`.pgrid--loose`, sized so two cards sit balanced rather than
  stretching to fill a phantom third column).

**"Typical project values" (B8) is not on the page at all.** The brief calls
this "the single most useful qualifying statement on the page" and instructs
that if no figure is confirmed, a qualitative fallback statement should be
used instead of deleting the block — but supplies no such statement, only
instructions for what should eventually go there. Inventing one would mean
publishing an unconfirmed business claim, so nothing was added. This is the
single highest-priority gap to close on this page.

**Not resolved, blocking publication per the brief's own Part C:**
1. The Semrush export decision (does "bespoke" or "luxury" lead the title
   tag) — the brief's own given default title tag is used as-is in the
   meantime; this only affects a possible future refinement.
2. ARB status — same handling as Heritage Projects; alternative title in an
   HTML comment.
3. Naming the Sandboro award, or confirming there isn't one to name.
4. Permission to publish project values and client names, and what they are.
5. **The typical project value range or qualitative statement** — see above.
6. A real, attributable testimonial, or confirmation to leave it out.
7. The fate of `/services/design-build`, which the brief says overlaps this
   page's territory. Nothing in the supplied copy links to that URL, so
   there's no code change pending on this — it's a site-level decision only.
8. GA4 key events — not configured.

Project page slugs (`/projects/sandboro-house-farm`, `/projects/furs-house`)
are assumed from this repository's convention, not confirmed.

---

## Schema

Both Heritage Projects and Luxury Architecture carry Service + FAQPage
JSON-LD, structurally validated (required properties present, FAQ questions
match the rendered `<summary>` text exactly, no bracket placeholders in any
schema string) — the same pattern Rural Conversions already uses. None has
been run through Google's Rich Results Test, which needs a public URL.

## Publication status

Heritage Projects and Luxury Architecture are held on a branch, not merged to
`main`, per each brief's own instruction to leave the page unpublished until
its Part C is resolved.
