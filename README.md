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
services/listed-buildings/index.html       Listed Buildings — live, built to the 7 Sep heritage brief
                                              (supersedes and replaces the former Heritage Projects page)
services/luxury-architecture/index.html    Luxury Architecture — live, held pending Part C
services/planning-applications/index.html  Planning Applications — live, built to the 7 Sep brief
services/project-management/index.html     Holding page
services/3d-visualisations/index.html      Holding page

assets/css/main.css          Barn & Rural Conversions' own stylesheet — do not edit
assets/css/service-page.css  Shared design system for Listed Buildings and Luxury
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
Listed Buildings and Luxury Architecture, and available for any future
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
| `/services/listed-buildings/` | Listed Buildings — live |
| `/services/luxury-architecture/` | Luxury Architecture — live, held pending Part C |
| `/services/planning-applications/` | Planning Applications — live |
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

### Listed Buildings (`services/listed-buildings/index.html`)

Built from a later, more detailed heritage brief that superseded an earlier
Heritage Projects page (different H1, different section structure, different
link set). Heritage Projects has since been removed from the repository —
every link that pointed to it (in Barn Conversions, Luxury Architecture and
the services index) now points here instead.

One H1, twelve H2s, matching the brief's thirteen numbered sections one for
one (the hero carries no H2). Every section uses a different layout
component deliberately, per the brief's requirement that sections doing
different jobs not look the same: a text-led four-card classification grid
(`.classgrid`), two mirrored text/image splits (`.textmedia`, one reversed),
a deliverables split with a bordered panel (`.workscope`), a compact
single-column band (`.section--compact` + `.proseblock`), a dark editorial
section carrying its own image (`.approach--media`), a light six-item
horizontal stepper (`.stepper`, deliberately unlike the dark connected-circle
`.steps` used elsewhere so the process reads as its own layout), the existing
photographic project grid and paired qualification panels, and the FAQ
accordion. All four new components are additions to `service-page.css` (see
the comment block near the end of that file) — `main.css` is untouched.

The FAQ questions are real `<h3>` elements inside `<summary>` (this brief
requires the heading tag, unlike Luxury Architecture, which styles the
`<summary>` text directly) — a small CSS rule
(`.faq summary h3`) makes the heading inherit the summary's own type so nothing
looks different. All nine answers are open by default and present in the
served HTML.

**"Architect" appears only where the brief places it** — the FAQ question "Do
I need a listed building architect?", the searcher-facing phrase inside its
answer, "architectural details" (Section 8), "architectural design" (title,
H1, JSON-LD), and "luxury architecture" / "rural conversions" as other
services' names. Nothing else was added; no ARB claim, credential or "our
architects" phrasing appears anywhere.

Omitted, pending content:
- hero image (brief specifies a case-study property, Barrow House or Castle
  Street) — no `og:image` is rendered either, rather than pointing at a
  placeholder
- five further photographs the brief calls for (the extension, the
  renovation, the approach section, and the three project cards)
- the telephone number in the final CTA's secondary line — the brief says to
  confirm it against the live `/contact` page, which does not exist in this
  repository, so the required copy ("Or call us to talk it through.") renders
  without a `tel:` link rather than publish an unconfirmed number

**Link destinations used exactly as the brief specifies**, several of which
are still 404 in this repository (consistent with how the other live pages
already handle unresolved destinations): `/contact`, `/projects` and
the three project pages, both `/news/...` guides, and all nine
`/locations/architectural-services-...` pages (a different slug pattern than
the three live pages' existing `/locations/architectural-design-...` links —
not reconciled, because the brief's link list is given as final copy).
`/services/rural-conversions` is used as given and resolves via the existing
`vercel.json` redirect to `/services/barn-conversions`, so it is not a 404.

**The brief's own numbers disagree.** Part 1.9 and the final checklist call
for "14 internal links," but the per-section "Internal links" and "CTA"
lists in Part 2 itemise more than that once every anchor-text link and
button destination is counted individually. Every link named anywhere in
Part 2 is implemented, with the exact anchor text and destination given; none
were dropped to force a match with the summary count.

Not resolved, blocking publication:
1. ARB status — decides the H1/title swap given at the end of the brief. Not
   confirmed, so the primary (non-ARB) versions are published.
2. All six photographs named above.
3. The `/contact` phone number.
4. The nine `/locations/...` destinations, both `/news/...` guides and the
   Green Belt guide, and `/projects` and its three project pages — none exist
   in this repository yet.
5. GA4 key events — not configured.

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

### Planning Applications (`services/planning-applications/index.html`)

Built from a self-contained 12-section brief (a single standalone prototype
page spec — hero, qualification, scope, application types, site appraisal,
refusals, projects, process, territory, FAQ, related services, closing CTA).
One H1, eleven H2s, ten H3s — and, per the brief's own final checklist, the
ten H3s are used *only* for the FAQ questions. Every other section title
that reuses an existing card component (`.route`, `.classcard`) needed a
non-heading equivalent instead of that component's default `<h3>`, so two
new modifier classes were added to `service-page.css`: `.route__title` and
`.classcard__title`, both styled identically to the `<h3>` they replace.

The brief's own copy is written as a standalone `index.html` + `styles.css`
prototype with its own header (a wordmark and a six-item nav) and footer
copy, and asks for nothing else in `<head>`. This page instead follows the
established convention every other page in this repository already uses —
`service-page.css`, the fixed `.backdir`/`.skip` pair in place of a header,
the shared `.site-footer` (brand + nav of the other live pages, Projects,
Contact), a canonical link, meta description and Service+FAQPage JSON-LD —
because it is being built directly into that existing, multi-page site
rather than hosted in isolation, and diverging from the other three live
pages' chrome would break the one thing they're all consistent about. The
title tag is likewise built from the brief's own target-keyword note
("planning permission architects (primary, H1)") plus the sibling pages'
"Service | Counties" convention, rather than the brief's literal default
("Planning Permission Architects | Hawkstone Developments").

Two link destinations were substituted for the same reason the rest of the
site already treats them this way:
- **"heritage projects service"** points to `/services/listed-buildings/`,
  not the brief's literal `/services/heritage-projects` — that page no
  longer exists in this repository (see the Listed Buildings entry above),
  and every other link on every other page that used to point to it now
  points here instead.
- **"rural conversions"** uses `/services/rural-conversions` exactly as the
  brief gives it — this one needed no change, since `vercel.json` already
  redirects it to `/services/barn-conversions`, the same handling Listed
  Buildings and Luxury Architecture rely on.

New `service-page.css` components, all appended after the existing Listed
Buildings variants: `.criteria--grid` (the eight-item scope-of-service list
as a two-column reference grid rather than a single sticky-rail column),
`.appraisal` + `.appraisal__links` (a wide prose column beside a narrower
stacked rail of three guide links, for the site-appraisal section), and
`.classgrid--three` (a three-card row for Related Services, lighter than
both `.route` and the four-column `.classgrid`). The existing `.deflist`,
`.routes--three`, `.steps`, `.places`/`.countylinks`, `.pgrid`, `.faq`,
`.cta-band`, `.sectionfoot` and `.closing` components account for every
other section, so Sections 3, 4, 6, 7 and 8 each read as a visibly
different layout, per the brief's own requirement.

Omitted, pending content: the hero image and each of the three project
cards' photographs — no assets are supplied in this repository, so no
placeholder text is rendered in their place, only an HTML comment noting
what each image should show.

**Link destinations used exactly as the brief specifies, several of which
are still 404 in this repository** (consistent with how the other live
pages already handle unresolved destinations): `/contact`, `/projects` and
its three project pages, all four `/news/...` guides, `/services/technical-
design` (no such folder exists here), and the three `/locations/...` county
pages. `/services/3d-visualisations` and `/services/project-management`
resolve to this repository's existing holding pages rather than a bare 404.

**The telephone number is published**, unlike Listed Buildings' final CTA —
this brief supplies `01332 498 052` as page copy rather than leaving it to
be confirmed, so it renders as a `tel:` link in both the closing section and
(per Part 1) nowhere else, since this page carries no separate footer of its
own beyond the shared `.site-footer`.

Not resolved, blocking publication:
1. The hero photograph and all three project-card photographs.
2. `/contact`, `/projects` and its three project pages, all four
   `/news/...` guides, `/services/technical-design`, and the three
   `/locations/...` pages — none exist in this repository yet.
3. The three project cards' stated planning routes are inferred by the
   brief itself from other pages' existing copy, flagged there for the
   client to confirm before production; published here as written, per the
   brief's own instruction to use the copy as given regardless.
4. GA4 key events — not configured.

---

## Schema

Luxury Architecture, Listed Buildings and Planning Applications all carry
Service + FAQPage JSON-LD, structurally validated (required properties
present, FAQ questions match the rendered heading text exactly, no bracket
placeholders in any schema string) — the same pattern Rural Conversions
already uses. None has been run through Google's Rich Results Test, which
needs a public URL.

## Publication status

Everything lives on `main`. This repository uses a single branch by
instruction — no staging, development or feature branches — so a page being
on `main` means it is in the testing site, not that it is signed off for the
public site.

What still blocks public launch is listed per page above: each brief's Part C
items, the unconfirmed facts held out of the copy, and the destination URLs
for links the briefs name but do not supply.
