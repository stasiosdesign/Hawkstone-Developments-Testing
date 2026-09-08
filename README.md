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
services/project-management/index.html     Project Management — live, built to the 8 Sep brief
services/3d-visualisations/index.html      3D Visualisations — live, built to the 8 Sep brief

assets/css/main.css          Barn & Rural Conversions' own stylesheet — do not edit
assets/css/service-page.css  Shared design system for Listed Buildings and Luxury
                              Architecture (and future full service pages)
assets/css/workspace.css     Styles for the root and services index pages
assets/js/smooth-scroll.js   Shared Lenis init, loaded on every page except
                              Barn & Rural Conversions
```

Every page is plain HTML and CSS — no build step, no bundler, no framework.
The only JavaScript in the site is Lenis (see below) and, on the three full
service pages, the FAQ accordion's markup (native `<details>`/`<summary>`,
no JS) and a JSON-LD `<script>` block.

## Why there are two nearly-identical stylesheets

`main.css` is the Barn & Rural Conversions page's own file. It was previously
held as untouchable — the page is finished, client-approved work, and nothing
done elsewhere was allowed to reach it. That rule was lifted for the site-wide
design refinement below, which was explicitly asked to cover every page; the
separation is otherwise unchanged, and work on any *other* page still has no
business in this file. `service-page.css` is a fork of it
(same tokens, layout primitives, typography and component vocabulary, plus a
handful of new section variants — see the comment at its head) used by
Listed Buildings and Luxury Architecture, and available for any future
service page. The two files can drift from each other over time; that's the
point. If you need a new component for a future page, add it to
`service-page.css`, not `main.css`.

`workspace.css` is smaller and separate again, for the root index and the
services index — internal-tool chrome, not landing-page design. It also
carries the holding-page styles, though no holding pages are left: all six
service folders now hold a live page.

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
| `/services/project-management/` | Project Management — live |
| `/services/3d-visualisations/` | 3D Visualisations — live |

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

## The live service pages

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
resolve to this repository's own pages (both were holding pages when this
page was built; both are live now) rather than a bare 404.

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

### 3D Visualisations (`services/3d-visualisations/index.html`)

Built to the 8 Sep brief, which frames the page as an isolated visual
prototype: the copy, chronology, section selection, CTAs and internal links
are final and were reproduced verbatim, and the only work asked for was
visual design. One H1, thirteen H2s and eleven H3s, matching the brief's
thirteen numbered sections (section 13 carries two H2s — "Where we work" and
the closing CTA — and the hero carries the H1).

**Heading levels are only where the brief assigns them.** Sections 3, 7 and
11 name H3 explicitly and use it; sections 6, 8, 10 and 12 do not, so their
item titles, step labels, project names and FAQ questions are styled
paragraphs and `<summary>` text rather than promoted headings — the same
rule Planning Applications already follows with `.route__title`.

**Thirteen distinct section treatments**, per the brief's requirement that
sections doing different jobs must not look the same: a split hero with a
full-height image, a ruled enumerated specification split (`.specsplit` /
`.speclist`), three image-led audience columns closed by a dark inset panel
(`.audiences` / `.notpanel`), a quiet stone-ground editorial argument with a
21:9 image (`.argument`), the page's one dark band with an off-centre
picture-first composition (`.cgiplan`), a seven-item thumbnail grid
(`.capgrid`), four alternating full-width editorial rows (`.ptypes`), a
seven-stage timeline on a continuous spine (`.timeline`), a compact
checklist with a rule-and-margin CTA aside (`.needs` / `.aside-cta`), an
asymmetric portfolio with one dominant lead project (`.work`), three ruled
comparison columns (`.commission`), a two-column FAQ accordion
(`.faqsplit`), and a full-bleed closing band with the picture behind the
copy (`.closing--media`). All are additions to `service-page.css` — see the
comment block near the end of that file. `main.css` is untouched.

**Image placeholders carry a label on this page, and only on this page.**
Every other page renders an unfilled `.well` as a flat block with no visible
text; this brief explicitly permits, and asks for, a short label naming the
photograph intended for each block, on the grounds that the subject of the
page is imagery. Nineteen labelled wells are rendered inside the page,
plus the closing band's own full-bleed background slot — twenty image
placeholders in all. The rule is scoped by `.well__label`, so no existing
page changes. **Every one is a placeholder: no genuine Hawkstone
visualisation is published here yet.**

**Technical SEO is deliberately absent.** The brief scopes it out, so unlike
the other four live pages this one carries a `<title>` and nothing else — no
meta description, canonical, Open Graph tags or JSON-LD. Anything built on
top of this prototype will need them added.

**Link destinations used exactly as the brief specifies.** All eighteen
links use the brief's given anchor text and URL. Two of them do not resolve
in this repository and were left as given rather than substituted, because
the brief states the link set is final:

- `/services/heritage-projects` — that page was removed from this
  repository and every other page now points at `/services/listed-buildings/`
  instead. This page does not follow that substitution.
- `/services/rural-conversions` — resolves via the existing `vercel.json`
  redirect to `/services/barn-conversions`, so not a 404.

Still 404 as elsewhere: `/contact`, `/projects` and its three project pages,
the `/news/...` Green Belt guide, and the three `/locations/...` county
pages.

Not resolved, blocking publication:
1. All twenty photographs. The three in "Recent work" must be genuine
   Hawkstone visualisation work from those projects — the brief says to
   verify this before launch.
2. The Sandboro House Farm award name, which the brief asks to be confirmed
   so it can be stated rather than implied. Nothing about an award appears
   on the page, stated or implied.
3. The turnaround figure in FAQ 3 and the pricing shape in FAQ 2, both
   flagged `UNCONFIRMED` in the file and published as written pending client
   sign-off — the same handling the other pages use.
4. `/services/heritage-projects`, and the other 404 destinations above.

### Project Management (`services/project-management/index.html`)

Built to the 8 Sep brief, which frames the page the same way the 3D
Visualisations brief did: an isolated visual prototype whose strategy, section
chronology, heading hierarchy, copy, CTAs and internal links are already final,
with the visual implementation layer the only work asked for. Every string is
reproduced verbatim; nothing was reordered, shortened or added. Replaces the
folder's holding page.

One H1, eight H2s and ten H3s, matching the brief's nine sections one for one
(the hero carries the H1, and no H2). **Heading levels are only where the brief
assigns them**, the same rule the other prototype pages follow: the two scope
columns, the three phase headings, the three project types and the two
qualification headings are all named as H3 in the brief and are real `<h3>`
elements; the eight appointment item names, the project name and the nine FAQ
questions are not, so they are styled paragraphs and `<summary>` text.

**Nine distinct section treatments**, per the brief's requirement that sections
doing different jobs must not look the same:

1. a split hero with a full-height image, the three body paragraphs at three
   weights — scene (`.lede`), offer (body), and the institutional line demoted
   under a rule (`.hero__inst`) — and a primary button beside a secondary text
   link, never two buttons
2. a quiet prose split on a tint ground, heading left and body right, with no
   cards, icons or image (`.prose-split--only`)
3. the scope contrast (`.scopesplit`): two opposed columns separated by ground
   and border rather than colour-coded ticks and crosses, identical in padding,
   heading size and list treatment so the limits are not visually diminished,
   closed by a full-width bordered statement (`.scopenote`)
4. the appointment as a sequence (`.phases`): three phase headings held left,
   the eight items running down a spine on the right with the numerals
   subordinate to the item names
5. the single project as an image-led editorial callout on the page's one dark
   ground (`.evidence`), the photograph given real width and the type held
   beside it — deliberately not a card grid, which with one project would read
   as a row missing two items
6. two movements in one section: the three project types reuse the existing
   `.audiences` component and each carries a visible route to another service
   page (`.audience__link`), then a divider (`.qualify`) and the suits /
   does-not-suit pair run flat and smaller (`.pair--flat`) so it reads as the
   scanning device it is
7. a five-stage wayfinding rail (`.stagerail`), horizontal on desktop and
   stacked on mobile, with the fifth stage marked by rule and colour rather
   than by any added label, and the Planning applications link quiet beneath it
8. the existing FAQ accordion held to a reading measure (`.faq--measure`) and
   left-aligned under its own heading, rather than a fourth heading-left /
   body-right split
9. a full-bleed dark closing band (`.closing--tall`) with one primary button
   and the secondary route as a single line of text carrying an inline link
   (`.closing__alt`)

All new classes are additions to `service-page.css` — see the comment block at
the end of that file. `main.css` is untouched.

**The FAQ answers are collapsed but present.** The brief requires every answer
to be in the served HTML and explicitly permits an accordion; the nine
`<details>` are closed by default because the section's stated job is letting a
visitor scan the questions in sequence. This differs from Listed Buildings,
where the answers are open by default.

**Image placeholders carry no visible label on this page.** The 3D
Visualisations brief asked for labelled wells because its subject was imagery;
this brief does not, so the five wells render as flat blocks in line with every
other page, each with a plain `role="img"` label describing the slot
("Residential construction in progress") and an HTML comment naming the
photograph intended for it. Sections 2, 3, 4, 7 and 8 carry no image at all,
which is what the brief's per-section direction specifies.

**Technical SEO is deliberately absent**, as on 3D Visualisations: the brief
scopes it out, so the page carries the suggested `<title>` and nothing else —
no meta description, canonical, Open Graph tags or JSON-LD. Anything built on
top of this prototype will need them added.

**Link destinations used exactly as the brief specifies.** All nine links use
the brief's given anchor text and URL, including two that do not resolve here
and were left as given rather than substituted:

- `/services/heritage-projects` — that page was removed from this repository
  and every non-prototype page now points at `/services/listed-buildings/`
  instead. This page follows the 3D Visualisations precedent and uses the
  brief's URL.
- `/services/consultation` — still 404, as on every other page.

`/services/rural-conversions` resolves via the existing `vercel.json` redirect
to `/services/barn-conversions`, so it is not a 404. Also still 404:
`/contact` and `/projects/55-derby-road`.

Two judgement calls, neither of which touched the copy or the order:

1. **The closing CTA carries no photograph.** The brief calls it the most
   visually dominant block on the page and asks for full bleed and strong
   contrast, but not for an image. It is a dark band with the type at scale, so
   the hero and the project evidence stay the page's two most striking
   photographic moments, as Section 5's direction asks.
2. **The hero stays left-aligned at every width.** The shared hero component
   centres its type below 861px; the brief says the body copy is never centred,
   so this page overrides that.

Not resolved, blocking publication:
1. All five photographs — the hero, the 55 Derby Road project, and one each for
   the three project types.
2. `/contact`, `/services/consultation`, `/projects/55-derby-road` and
   `/services/heritage-projects` — none resolve in this repository.
3. GA4 key events — not configured.

---

## Site-wide design refinement

A pass over all eight pages to improve spacing, hierarchy, alignment and
composition. **No copy was changed anywhere** — the visible text of every page
is byte-identical before and after, as are all headings, every `href` and all
Service/FAQPage JSON-LD. The work is CSS, plus the smallest structural changes
needed to let the CSS do its job. No JavaScript was added.

### Defects fixed

- **An H2 with no space beneath it.** `h2` carries no bottom margin by design,
  and the components that pair a heading with a rail, a panel or a grid supply
  the space themselves. Sections that set an intro paragraph directly under the
  H2 had nothing at all, so heading and copy ran together as one block —
  Planning Applications sections 3 and 5, and Project Management sections 3, 4
  and 6. Handled once, in `service-page.css`.
- **Section-closing rules that stopped part-way across.** `.sectionfoot` (and
  `.splitprose__close` / `.cost__close`) capped `max-width` for measure, which
  also truncated the rule above the text — a hairline ending at 45% under a
  four-column grid read as a rendering fault. The rule now runs the container's
  full width; the measure is held with padding.
- **A three-track project grid holding two cards.** Luxury Architecture's
  `.pgrid--loose` capped cards at 320px, leaving half the row empty and reading
  as a missing third card. It is now a full-width pair of landscape cards.
  Listed Buildings, which has three confirmed cards, used the same modifier and
  now uses plain `.pgrid`.
- **A margin note anchored to nothing.** `.approach__note` was auto-placed into
  whichever grid row came next, so its rule floated mid-band. Pinned to the
  first row it reads as a note beside the argument it qualifies.
- **A heading dropped below its own copy.** `.places` bottom-aligned the title
  against a five- or six-line body. Both columns now start together.
- **Two `<script>` tags for `smooth-scroll.js`** on both index pages, the first
  a no-op before Lenis had loaded. The redundant one is gone.

### Composition

- **Luxury Architecture's three project types** (sections B2–B4) were three
  consecutive runs of the same heading-left / prose-right split and read as
  three unrelated essays rather than three parallel answers to "which of these
  is your project?". A running index and a ruled top edge (`.prose-split--type`)
  make the set legible. The numerals are generated content; the page's own copy
  is untouched.
- **Planning Applications' post-refusal routes** are a choice, not a sequence.
  Run flat in one column they read as three more paragraphs of the argument
  above them; they now run as three peers under one rule (`.criteria--three`).
- **Planning Applications' hero.** Its eleven-word H1 set as seven lines of
  display type in the shared split hero. `.hero--plan` gives it a wider column
  and a lower top to the type scale — the same treatment `.hero--viz` and
  `.hero--pm` already carry.
- **Listed Buildings' process stepper** ran six stages across the full
  container, leaving each a ~22-character measure and breaking half the titles
  over two lines. It now runs three-up in two rows.
- **The 3D Visualisations capability grid** held seven thumbnails in three
  tracks (3/3/1). Four tracks above 1180px gives 4/3.
- **Prose bands** now open on a serif lead statement rather than three equal
  paragraphs, and Listed Buildings' guide link is set apart as the signpost it
  is rather than a fourth paragraph of argument.
- **The CTA band's prompt** is the reason the button is there; at caption size
  and muted it left the button stranded at the far end of the band. It is now
  set as a statement.
- **Centred hero headlines** were capped at 20ch, which broke both the Luxury
  Architecture and Barn Conversions H1s into four lines with a stranded short
  line. 23ch lets `text-wrap:balance` settle them into three.
- **Barn Conversions' `.splitprose` heading** now tracks its copy, the same
  sticky rail the cost section on that page already used, instead of sitting at
  the top of a column empty for the rest of the section. Its project cards carry
  no link text — the card is the link — so the lone arrow is set against a rule
  at the end of the card rather than left loose under the description.
- **The workspace indexes** are sized so the six service folders land as one
  even row rather than five and a stray sixth, and a rule closes the page head.

### Left alone

3D Visualisations and Project Management needed no markup changes at all — both
were built to briefs that already demanded a distinct treatment per section, and
they were the two strongest pages going in. Listed Buildings' text/image splits,
deliverables panel and dark editorial band, Luxury Architecture's qualification
pair and process steps, and every FAQ accordion were already doing their job and
were not touched beyond the shared fixes above.

Checked at 390, 768, 1024, 1440 and 1920px: no horizontal overflow on any page
at any of those widths.

---

## Photography

The client's supplied photography now fills every image slot on all six service
pages. **No placeholder well remains anywhere**: 45 slots, all filled.

```
assets/img/3d-visualisations/     01–09
assets/img/barn-conversions/      01–09   (from "Rural Conversions")
assets/img/listed-buildings/      01–08   (from "Heritage Design")
assets/img/luxury-architecture/   01–09
assets/img/planning-applications/ 01–09   (from "Planning Application")
assets/img/project-management/    01–02, plus three cross-referenced below
```

Filenames are the supplied files in sorted order, renumbered — the originals
carry spaces, commas and duplicate-suffix names (`… 08_13_00 PM 3.jpg`) that do
not belong in a URL. The full supplied set is kept per service, including frames
not currently placed, so swapping one is a one-line change.

Two supplied duplicates were dropped: Heritage Design's two `Sanbo Details A-14`
files are byte-identical, and the Luxury Architecture and Planning Application
folders are the same nine images. Luxury and Planning therefore draw different
frames from that shared set, except Sandboro House Farm, which is deliberately
the same photograph on both pages because it is the same project.

### How the slots are filled

- **Luxury Architecture** (3) — hero, then Sandboro House Farm and Furs House.
- **Planning Applications** (4) — an aerial of a courtyard scheme in the hero,
  then Barrow upon Trent, Sandboro House Farm and Tean.
- **Listed Buildings** (7) — a listed building with a contemporary glazed link in
  the hero; a Georgian house with a modern extension against "Extending a listed
  building"; a renovated interior against "renovation and repair"; a brick-and-
  timber detail in the dark "Significance first" band; three project cards.
- **Barn Conversions** (6) — a stone barn conversion in the hero; an unconverted
  agricultural building and a converted one paired in the dark design band, which
  is the section's own before/after argument; three project cards, with the
  consented-scheme massing model on the planning-led glamping project.
- **Project Management** (5) — the two supplied site photographs in the hero and
  the 55 Derby Road callout. The three project-type cards each link to another
  service page, so each one carries an image from *that* service's folder rather
  than repeating a site photograph three times across one row. Those three files
  are copied into this page's own folder, so no page reaches across into
  another's directory.
- **3D Visualisations** (20 slots, 9 images) — every slot is filled, so seven or
  eight images appear more than once. Repeats are placed at least a section
  apart, in different crops and at different sizes, and no image repeats within
  a section. The seven-item capability grid carries seven distinct images, one
  per capability.

### What changed to accommodate them

- `.well > img` fills the slot with `object-fit:cover`, so every existing aspect
  ratio, responsive rule and breakpoint still applies unchanged. A well holding a
  picture drops the tonal ground and the inset placeholder rule.
- The closing band on 3D Visualisations carries its picture behind the copy, so
  it gained a gradient scrim — white display type over an unmodified photograph
  is not legible.
- `.cgiplan__media` moves from 3:4 to 4:3. Every visualisation supplied for that
  page is landscape, and a portrait slot cropped them to a narrow vertical band
  that lost the context the section is about.
- The twenty `.well__label` spans on 3D Visualisations are gone. They named the
  photograph intended for each slot; the slots now hold photographs. This is the
  only text removed from any page, and no page copy changed.
- Project Management's five wells carried `role="img"` with an `aria-label`. The
  two accurate descriptions became the image's `alt`; the three on the project-
  type cards described construction shots that are not what those cards now show,
  so they take `alt=""` and the card headings name the subject. Every other
  image is decorative supporting photography beside copy that already describes
  it, and takes `alt=""`.
- Heroes load eagerly; all forty other images are `loading="lazy"`.

### Worth knowing before launch

**Every supplied image is 600px wide.** That is below what the heroes and the
full-bleed closing band want — they render up to roughly 900 CSS px on a
1440px screen and more on a wide monitor, so those slots are upscaling. The
file sizes (200–740KB for 600px) say these are near-lossless exports of
larger originals; higher-resolution masters, or the same files recompressed,
would improve both sharpness and page weight considerably. Per-page payload is
currently 1.1–2.8MB across the whole scroll.
