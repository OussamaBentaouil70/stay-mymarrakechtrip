# AGENTS.md — STAY by My Marrakech Trip (Hospitality Commercial Management)

Briefing for AI coding agents and developers. Read fully before editing.

---

## 0. Routing

Two routes in the single-file build (`src/router.ts`, History API + `#/thank-you` fallback):
- `/` — the landing page.
- `/thank-you` — confirmation page (`ThankYou.tsx`): hero imagery, personalised thank-you
  (name, property, reference `STAY-XXXXXX` from history state), "Back to homepage" + WhatsApp
  CTAs, "what happens next" steps, `noindex`. Both enquiry forms navigate here after a
  successful submission; when delivery used the visitor's email app, the page adds a
  "press send" reminder. Direct visits show a generic thank-you. The floating WhatsApp
  button is hidden on this route (the page has its own CTA). Production hosting must
  rewrite unknown paths to `index.html` (standard SPA fallback); the hash route works
  without it. `App.tsx` swaps titles/robots per route and restores home scroll on return.

## 1. What this project is

A **single-page, B2B landing page** for **STAY by My Marrakech Trip**
(`stay.mymarrakechtrip.com`), a hospitality **commercial management** company. STAY acts
as an outsourced commercial partner for **hotel and riad owners** in Marrakech: revenue
management, OTA management, B2B sales & distribution, commercial strategy, and digital
marketing.

Audience = property owners/managers, **not travellers**. It must read like an established
hospitality consultancy, never a travel agency or booking site. Goal: generate enquiries.
Initial market is Marrakech; copy and structure should allow expansion across Morocco.

> History: this repo previously hosted several event/venue sites (Riad Azahar, Nelia,
> O'Atlas, Jnane Tamsna, Weddings Planner Morocco, Beldi Country Club). All replaced.
> Do not reintroduce wedding/event content.

---

## 2. Tech stack

| Concern | Choice |
|---|---|
| Framework | React 19 + TypeScript 5.9 (strict; unused imports fail `tsc`) |
| Bundler | Vite 7 + `vite-plugin-singlefile` → one inlined `dist/index.html` |
| Styling | Tailwind CSS v4, CSS-first `@theme` in `src/index.css` |
| Motion | **No animation library.** `Reveal.tsx` = IntersectionObserver + CSS (`.reveal`), respects reduced motion |
| Icons | `lucide-react`; WhatsApp glyph in `WhatsAppIcon.tsx` (lucide has no brand icons) |
| Fonts | Google Fonts: **Cormorant Garamond** (headings), **Manrope** (body/UI), **Cinzel** (logo wordmark only) |
| Email | **Nodemailer** over SMTP inside a Cloudflare Pages Function (`functions/api/send-inquiry.ts`); requires `nodejs_compat` |

```bash
npm run dev
npm run build      # -> dist/index.html (~300 kB, ~91 kB gzip)
npx tsc --noEmit
```

Cloudflare Pages (config in `wrangler.toml`; Functions live in `functions/`):

```bash
npx wrangler pages dev      # local preview incl. /api/send-inquiry (port 8788, reads .dev.vars)
npx wrangler pages deploy   # deploy dist/ + functions/ to https://stay-mymarrakechtrip.pages.dev
```

Pages serves the SPA root for unknown paths automatically (no `_redirects` needed, as long
as there is no top-level `404.html`). Secrets for the Function are Pages env vars in
production and `.dev.vars` locally.

Rules: don't hand-edit `package.json` / `vite.config.ts`. Entry `src/App.tsx`.

CSS gotchas: keep custom classes inside `@layer components` (unlayered CSS overrides
utilities like `hidden`); don't add `@theme` spacing tokens named `sm/md/lg/xl…`.

---

## 3. File map

```
index.html                 SEO: title, description, canonical, Open Graph, JSON-LD (ProfessionalService), favicon, fonts
src/
  data/site.ts             ★ ALL editable content + settings (contact email, WhatsApp, form endpoint, copy, photos)
  index.css                Tokens, type scale, buttons, fields, .reveal
  App.tsx                  Skip link, page order, floating WhatsApp button
  components/
    Logo.tsx               StayLogo (variant "full" | "mark", tone "dark" | "light") — SVG recreation of the brand logo; ArchMark icon
    Navbar.tsx             Transparent over hero → ivory on scroll; active-section underline; mobile menu (Esc closes)
    Hero.tsx               1 — h1, intro, services CTA + WhatsApp number (left), EnquiryForm "hero" (right, #hero-form), service strip
    About.tsx              2 — company intro, 3-step approach, outcomes list
    Services.tsx           3 — five services in alternating image/text rows (anchors per service)
    Clients.tsx            4 — Who we work with (5 property types)
    WhyStay.tsx            5 — Why STAY (5 reasons, dark band)
    Contact.tsx            6 — contact cards (WhatsApp, email, location) + EnquiryForm "contact"
    EnquiryForm.tsx        ★ Shared form (variant "hero" | "contact"): validation, honeypot, delivery (endpoint or mailto); independent state per instance
    Footer.tsx             Full light logo, links, services, contact
    Picture.tsx            Responsive <img> with srcset, lazy loading
    Reveal.tsx             Scroll reveal
    SectionHeading.tsx     Eyebrow + h2 + intro
    WhatsAppIcon.tsx
functions/
  api/send-inquiry.ts      ★ Cloudflare Pages Function — POST /api/send-inquiry → SMTP via Nodemailer (admin + client emails)
server/
  php/api/                 Optional PHP + PHPMailer backend for non-Pages hosts (NOT part of the Pages deploy)
wrangler.toml              Cloudflare Pages project config (project name, dist output)
```

Section anchors: `#top`, `#about`, `#services` (+ `#revenue-management`, `#ota-management`,
`#b2b-distribution`, `#commercial-strategy`, `#digital-marketing`), `#clients`, `#why`, `#contact`.

---

## 4. Contact form & integrations (`src/data/site.ts` → `contact`)

Fields: Name*, Property name*, Email*, Phone (optional), Message*. Validation focuses the
first invalid field; errors linked via `aria-describedby`. Hidden honeypot (`botcheck`).

Two instances: hero (compact, button "Let's work together") and contact (button "Send enquiry"). Ids are prefixed `hero-enquiry-*` / `contact-enquiry-*`. Each submission includes `source` ("Hero form" / "Contact form").

Delivery (`deliver()` in `EnquiryForm.tsx`), primary path:
1. **Cloudflare Pages** — `formEndpoint: "/api/send-inquiry"` posts JSON to
   `functions/api/send-inquiry.ts`, which validates server-side (including the honeypot)
   and sends **two emails over SMTP with Nodemailer**: admin notification (reply-to =
   visitor) first, then the client thank-you. Admin failure → `500`; client failure is
   logged and still returns `200`. Success → thank-you page; failure → inline error,
   inputs kept. Nodemailer needs `nodejs_compat` (set in `wrangler.toml`) for `node:net` /
   `node:tls`. Requirements: `MAIL_HOST`, `MAIL_USERNAME`, `MAIL_PASSWORD`,
   `MAIL_FROM_ADDRESS`, `ADMIN_EMAIL` (plus optional `MAIL_PORT`, `MAIL_ENCRYPTION`,
   `MAIL_FROM_NAME`, `ADMIN_NAME`, `SITE_URL`, `WHATSAPP_NUMBER`) as Pages env vars, or in
   `.dev.vars` for `wrangler pages dev`. Port 465 + `ssl`, or 587 + `tls`.

Fallbacks:
2. **PHP host** — `server/php/api/send-inquiry.php` (PHPMailer) is available for non-Pages
   hosting: upload `server/php/api/` to the web root, set `formEndpoint` to
   `/api/send-inquiry.php` and configure `.env` (SMTP).
3. **No endpoint** — opens a pre-filled `mailto:` to `contact.email`.

⚠️ Placeholders to replace: `contact.email` (`contact@mymarrakechtrip.com`), the SMTP
credentials / sender address, and `ADMIN_EMAIL`.

---

## 5. Design system

Palette (from the logo): `ivory #F8F5F0` (page), `white`, `sand #EFE7DC` (beige band),
`stone #DDD2C3` (hairlines), `muted #6B625A` (secondary text, AA), `charcoal #24201D`
(text, dark band), `espresso #4A2E1A` (primary buttons), `bronze #8A5A32` (accents/small
text on light, AA), `bronze-light #C39466` (accents on dark).

Type: `.type-display` (hero), `.type-h2`, `.type-h3`, `.type-h4` in Cormorant Garamond;
`.type-eyebrow` uppercase Manrope 600 with a bronze hairline; body Manrope 16px / 1.7.

Buttons: sharp rectangles, uppercase 13px tracking — `.btn-primary` (espresso),
`.btn-light`, `.btn-outline`, `.btn-outline-light`.

Principles: minimal, generous spacing (`.section-pad`), max width 1280px, thin borders
instead of heavy shadows, one subtle reveal animation. Section rhythm:
hero (photo) → about (white) → services (ivory) → clients (sand) → why (charcoal) → contact (ivory) → footer.

---

## 6. Photos

All photos are **temporary Pexels stock** (Marrakech riads/courtyards, Moroccan resort,
hotel interiors, business imagery), referenced by Pexels id in `site.ts`. `imageUrl()`
builds sized URLs; `Picture` adds a `srcset`. To use your own photos, put them in
`public/images/` and set `src: "/images/name.jpg"` (string paths are used as-is).

---

## 7. SEO & performance
- One `h1` (hero); each section has an `h2` with `aria-labelledby`.
- `index.html`: descriptive title/description, canonical, OG/Twitter tags, JSON-LD
  `ProfessionalService` (areaServed Marrakech + Morocco, parent My Marrakech Trip).
- Hero image eager + `fetchpriority=high`; all others lazy with responsive `srcset`.
- No animation library; preconnect to fonts and image CDN.

## 8. Known gaps / TODO
1. Real contact email and form service key (see §4). WhatsApp is set to `212771444668` (shown as +212 771 444 668 via `whatsappDisplay`).
2. Replace stock photos with the client's property imagery.
3. Logo is an SVG recreation of the supplied artwork — swap in the official vector file if available.
4. Domain, hosting and SSL for `stay.mymarrakechtrip.com` are configured at the host/DNS level, outside this codebase.
5. Optional later: French/Arabic versions, analytics, privacy notice, client logos/testimonials once available.
