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

Rebuilt against a new client brief that replaces the page's copy wholesale and
restructures it. One H1 and eleven H2s, no H3s — the three project types are
now full H2 sections of their own rather than three H3 cards inside one
section, which is what the new brief's heading hierarchy specifies.

Structural changes the new brief required:

- The old **Positioning** block ("What 'luxury' means in our work") is replaced
  by **Design standard** ("Luxury residential architecture, as we practise it")
  and moves from third to fifth, after the three project types.
- The old **Planning** block (the four countryside planning routes) is gone.
  Its Green Belt and Paragraph 84 material is now inside project type one,
  where the new brief puts it.
- **Certainty** ("Budget and planning certainty before you commit") is new, and
  separates the budget/planning argument from the process steps, which the old
  page combined in one dark section.
- **Where we work** and **Related services** were two sections with the FAQ
  between them. The new brief folds territory and the two service boundaries
  into a single block, so Related Services is gone and its two lines sit under
  Where We Work.
- Section order is now hero → statement → three project types → design standard
  → certainty → projects → who-for → process → FAQ → territory + boundaries →
  closing CTA.

No new layout was invented: every block reuses a component service-page.css
already carries (`.prose-split`, `.approach`, `.criteria`, `.cta-band`,
`.pair`, `.steps`, `.faq`, `.places`, `.boundaries`, `.closing`). The one CSS
addition is `.pcard__desc`, because this is the first project card on any page
whose brief supplies a description.

The title tag uses the brief's given 62-character default; both alternatives
(ARB-confirmed, and the "bespoke-leads" variant if Semrush comes back at 2x or
more) are in an HTML comment above it.

Omitted, pending content:
- hero image (Sandboro House Farm, exterior)
- the "Building a new house", "Paragraph 84 homes explained", "Knock down and
  rebuild", "Green Belt" and "cost of building a bespoke home" links — the
  brief names all five but supplies no destination URLs
- Sandboro's award name and year ("confirm before publishing")
- every project card's planning route and status ("do not state unless
  confirmed")
- the testimonial block, which the brief makes conditional on a real,
  attributable bespoke-home client quote existing

**The project value range is the one judgement call.** The brief's qualifying
bullet reads "Your project value is in the region of £500,000 to £3 million and
you want one practice to design it, gain planning and see it through", followed
by "[Confirm the range with the client before publishing]". The figure is
therefore an unconfirmed business claim and is not published; the rest of the
bullet, which asserts nothing unconfirmed, renders as "You want one practice to
design it, gain planning and see it through." Publishing the range is a
one-line change once it is confirmed.

**Sandboro's £1.65m construction value is published**, because this brief
supplies it as page copy rather than as a bracketed placeholder. That reverses
the previous brief's instruction to withhold project values.

**Project cards.** Still two, not three, for the same reason as before:
- **Sandboro House Farm**: name, "Derbyshire", and the supplied description.
- **Furs House**: name only — the brief gives `[place]` and a bracketed
  description placeholder.
- **Third card**: not rendered. "Private Dwelling, [place]" has no confirmed
  name, description or status.

**Not resolved, blocking publication per the brief's own build notes:**
1. ARB status — decides "architects" in the title tag and the intro.
2. The Semrush volume for "bespoke house/home architects" — decides which
   title tag variant is used.
3. The Sandboro award name and year.
4. The Furs House place and description, and the third project's identity.
5. The £500k–£3m project range — see above.
6. The planning determination period. The eight-to-thirteen week figure in FAQ
   4 is published as written pending sign-off from the client's planning lead,
   flagged `UNCONFIRMED` in the file — the same handling Rural Conversions uses.
7. A real, attributable testimonial, or confirmation to leave it out.
8. The launch redirect the brief specifies —
   `/news/luxury-architecture-in-derbyshire` and its `/blog-posts/` duplicate →
   this page. Not configured here; `vercel.json` carries no redirects yet.
9. The inbound links the brief lists (three county pages, town pages, the five
   guides, services overview) — none of those pages exist in this repository.
10. GA4 key events — not configured.

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

Everything lives on `main`. This repository uses a single branch by
instruction — no staging, development or feature branches — so a page being
on `main` means it is in the testing site, not that it is signed off for the
public site.

What still blocks public launch is listed per page above: each brief's Part C
items, the unconfirmed facts held out of the copy, and the destination URLs
for links the briefs name but do not supply.
