# CLAUDE.md

Guidance for Claude Code (and other agents) working in this repository.

## Project

Marketing site for **Ascend Professional Institute**, founded by Dr. Christel
Mbonteh, Ph.D., PMP. The institute delivers three online certificate
programs — **Business Analysis**, **Project Management**, and **Leadership &
Strategic Management** — plus separate leadership/management consulting
services. The site is informational: it presents the company, the programs,
the founder, and a way to get in touch. There is **no backend** except the
Contact Us form, which posts to a third-party form endpoint (see below) —
everything else is static content rendered at build time.

Content is sourced from the client's `Website Requirements` document. Where
that document left a value TBC (phone number, logo, founder photo, cohort
start/end dates, certificate template, business payment account), this
codebase uses an explicit placeholder rather than inventing one — see
**Outstanding placeholders** below before treating any of those as final.

## Stack

- **Astro** (static output, no SSR adapter) — see `AGENTS.md` for dev server
  and documentation links.
- **Tailwind CSS v4** via the official `@tailwindcss/vite` plugin (installed
  with `astro add tailwind`). There is no `tailwind.config.js` — theme tokens
  (brand/accent colors) are defined with `@theme` in `src/styles/global.css`.
- **TypeScript**, `astro/tsconfigs/strict`.
- Content is modeled with **Astro Content Collections**
  (`src/content.config.ts`), not hardcoded in pages.
- No UI framework (React/Vue/etc.) is installed. Any interactivity (mobile
  nav toggle, the contact form's fetch submission, accordion-style course
  lists) is done with native HTML (`<details>`) or small inline `<script>`
  tags in `.astro` files. Don't reach for a framework integration unless a
  feature genuinely needs client-side state that this can't express.

## Structure

```
src/
  components/
    layout/       Header.astro, Footer.astro
    ui/           Button.astro, SectionHeading.astro — small, reusable, no page knowledge
    *.astro       Page-level building blocks (Hero, CourseCard, ModuleAccordion, ContactForm, Seo)
  content/
    courses/      One markdown file per CERTIFICATE PROGRAM (frontmatter only, optional body)
  content.config.ts  Zod schema for the `courses` collection
  consts.ts       Site title/description, nav links, contact details, fee/payment/semester constants
  layouts/
    Layout.astro  Base HTML shell: <head>/SEO, Header, <main><slot /></main>, Footer
  pages/
    index.astro             Home (mission, who-we-serve, why-ascend, programs, consulting, CTA)
    about.astro             About Trainer — Dr. Christel Mbonteh bio
    contact.astro           Contact Us
    courses/index.astro     Program catalog
    courses/[slug].astro    Program detail — one page per collection entry, via getStaticPaths()
  styles/global.css  Tailwind import + @theme tokens
```

## Working with programs/courses

**Terminology**: each content collection entry is a *Certificate Program*
(e.g. "Certificate in Business Analysis"), routed at `/courses/<slug>/` for
URL stability. Each program is always made up of exactly **3 courses**
(`modules` in the schema, `.length(3)` enforced) — e.g. ABA601/602/603 for
Business Analysis. Don't add a 4th course or collapse to fewer; restructure
content to fit 3 if asked for something different.

Each course within a program has its own `code`, `duration` (always "12
weeks | 3 hours per week | 36 instructional hours" in the current content),
`description`, and a list of `outcomes` (8–10 bullet points). Program-level
fields (`totalHours`, `audience`, `outcomes`) describe the program as a
whole, not any one course.

Pricing/enrollment facts baked into `src/consts.ts` (from the requirements
doc, not invented):
- `FEE_PER_COURSE_USD = 750` — per course, so $2,250 for a full 3-course
  program. Rendered per-course on program cards/detail pages.
- `PAYMENT_METHODS` — E-transfer, Bank draft, EFT (informational only; no
  payment processing is implemented).
- `SEMESTERS` — Spring/Summer/Fall/Winter, shown as "offered" generically
  since real cohort start/end dates aren't available yet (see placeholders).
- Certificate of completion requires finishing all 3 courses in a program —
  stated on the program detail page; no actual certificate artifact exists
  yet (also a placeholder, see below).

Adding a new program: add a markdown file with the required frontmatter to
`src/content/courses/`; `/courses/` and `[slug].astro` pick it up
automatically via `getCollection('courses')`.

## Contact form

`src/components/ContactForm.astro` renders a plain HTML form with exactly
the fields the client's Google Sheet tracking needs: **name, email, phone,
reason for contacting**. It posts to `PUBLIC_FORM_ENDPOINT` (a public env
var, read via `import.meta.env`) — works as a native form submission with no
JavaScript, and progressively enhances to a `fetch` submission with inline
status text when JS is available.

The client's stated intent is to track submissions in a **Google Sheet**.
Since this project does not run its own server, that means
`PUBLIC_FORM_ENDPOINT` should point at either:
- a simple form backend (Formspree, Web3Forms) for fastest setup, or
- a Google Apps Script Web App bound to the target Sheet (a `doPost(e)`
  function that appends a row from `e.parameter`), deployed with "Anyone"
  access, if the Sheet itself is the system of record.

See `.env.example` for both options. Don't add an Astro API route or server
adapter for this; it would require switching the whole site off static
output.

## Outstanding placeholders

These come directly from the requirements doc as "TBC" / "to be inserted" /
"to do" — don't treat the current placeholder as final content:

- **Company logo** — supplied. `src/assets/logo-original.jpg` is the
  as-supplied file (opaque white background, plus a thin dark artifact line
  across the top). `src/assets/logo.png` is a processed version — top line
  cropped, background chroma-keyed to transparent, then cropped to its
  content bounding box — used via Astro's `<Image>` in both `Header.astro`
  and `Footer.astro`. It's a navy/gold lockup designed for a light
  background, which is why it isn't used in the dark hero section. If the
  client later supplies a proper vector/transparent source file or a
  separate icon-only mark, prefer that over the processed JPEG-derived PNG.
- **Founder photo** — supplied (`src/assets/christel-mbonteh.png`), used via
  `<Image>` in `about.astro`.
- **Phone number** — `CONTACT_PHONE` in `consts.ts` is intentionally left
  empty (renders "Coming soon"); do not fill it with a fabricated number.
- **Cohort start/end dates per semester** — not yet finalized; program pages
  say "To be announced — contact us for the next start date" rather than
  showing specific dates.
- **Certificate of completion template** — not yet designed; no certificate
  artifact/preview exists in the site yet. When a template is supplied, it
  likely belongs as a static asset plus a small "sample certificate" section
  on the program detail page or a dedicated certificate page.
- **Business payment account** (for E-transfer/Bank draft/EFT) — not yet
  set up; the site lists accepted payment methods as information only, with
  no payment collection flow.

## Conventions

- Prefer editing/extending existing components (`Button`, `SectionHeading`,
  `CourseCard`, `ModuleAccordion`) over writing new ad hoc markup for the
  same kind of content.
- Internal links use trailing slashes (`/courses/`, `/contact/`) to match
  Astro's default trailing-slash behavior.
- Keep brand colors in the `@theme` block in `src/styles/global.css` rather
  than hardcoding hex values in components.
- This is a content site: most changes are either (a) editing copy/content
  in `src/content/` and the `pages/*.astro` files, or (b) adjusting shared
  layout/components. Reach for the content collection before hardcoding
  program data into a page.
- Don't fabricate facts not present in client-supplied content (stats,
  testimonials, dates, phone numbers). Use an explicit placeholder instead
  and list it under **Outstanding placeholders**.

## Development

See `AGENTS.md` for how to run the dev server (background mode) and for
links to the Astro documentation guides relevant to routing, components,
framework components, content collections, styling, and i18n.
