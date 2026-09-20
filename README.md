# The Solar Co. — website

Marketing site for The Solar Co., a 100% New Zealand owned solar company. Built with React 19, Vite and
Tailwind CSS v4.

## Two design versions

Both build and deploy together, and a floating switch in the bottom centre moves between them.

| Route      | Version | Concept                                                                              |
| ---------- | ------- | ------------------------------------------------------------------------------------ |
| `/`        | **v2**  | Light throughout, real client content, lead capture first. The current proposal.       |
| `/v1.html` | **v1**  | The original concept: full-bleed film hero, pinned scroll sequence, darker treatment.  |

v1 is kept verbatim apart from two changes: it loads the same local photographs as v2, and it renders the
version switch. It compiles its own Tailwind theme from `src/v1/index.css`, so the two palettes never collide.

## Develop

```bash
npm install
npm run dev     # v2 at /, v1 at /v1.html
```

## Build

```bash
npm run build
npm run preview
```

## Brand

The palette is taken from the logo: navy wordmark `#273750` and the orange → gold dot arc
(`#EC5A2C` → `#F4863A` → `#F9B637`). v2 is light on every section — white, warm off-white `#FFF6EA`, pale
blue `#EAF2F8` and grey `#F5F6F8` grounds with navy type and orange actions. There are no dark sections.

## Structure

- `src/App.jsx` — v2: header, light hero with a three-field lead card, trust bar, power-price chart,
  benefits, how solar works, services, about, testimonials, savings estimator, installer checklist, FAQ,
  full consultation form, footer.
- `src/index.css` — v2 Tailwind entry: design tokens in `@theme`, keyframes, scroll-reveal utilities.
- `src/v1/` — v1 page, its own Tailwind theme and its own `ImageSlot`.
- `src/components/ImageSlot.jsx` — cover-fit photo that offers a `.webp` before the `.jpg`, or a labelled
  placeholder when no photo is set.
- `src/components/Logo.jsx` — brand mark as inline SVG (orange dot arc and navy wordmark).
- `src/components/VersionSwitch.jsx` — the v1 / v2 switch. Inline styles, because it renders inside both
  Tailwind themes.

## Images

Every photograph is stored in `public/img/` and served from this origin — nothing is hot-linked. Each one is
a 1400px `.jpg` with a matching `.webp` alongside it; `ImageSlot` offers the `.webp` first. Licence credits
stay visible in the corner of each frame.

`public/hero.webm`, `public/hero.mp4` and `public/hero-poster.jpg` are the v1 hero film. v2 does not load
them. They can be deleted if v1 is dropped, which takes about 12 MB off the build.

## Client content

Phone, address, and the 6,000+ systems, 7 hubs, 70% coverage, 30-year warranty, ~5-year payback, up to 80%
bill reduction and 17c → 34c power price figures all come from the client's own material.

Two things still need confirming before launch:

- **Email address.** `hello@thesolarco.co.nz` in `COMPANY` is a placeholder.
- **Testimonials.** The section on `/#testimonials` is built but its quotes, names and rating are left as
  marked slots. Real Google and Facebook reviews drop straight in. Nothing is invented.
