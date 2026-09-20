# The Solar Co. — website

Marketing site for The Solar Co., a 100% New Zealand owned solar company. Built with React 19, Vite and
Tailwind CSS v4.

## Two design directions

Both build and deploy together, and a floating switch in the bottom centre moves between them. They are
labelled A and B rather than v1 and v2 on purpose: neither supersedes the other, and a version number would
imply one is an older draft.

| Route     | Direction           | What it is                                                                 |
| --------- | ------------------- | -------------------------------------------------------------------------- |
| `/`       | **A — Light**       | Conversion-focused layout, free-quote form in the hero. Light throughout.    |
| `/b.html` | **B — Video hero**  | The same content behind a full-width video header.                           |

B is kept verbatim apart from three changes: it loads the same local photographs as A, it renders the design
switch, and its hero film carries a brightness correction. It compiles its own Tailwind theme from
`src/design-b/index.css`, so the two palettes never collide.

## Develop

```bash
npm install
npm run dev     # A at /, B at /b.html
```

## Build

```bash
npm run build
npm run preview
```

## Brand

The palette is taken from the logo: navy wordmark `#273750` and the orange → gold dot arc
(`#EC5A2C` → `#F4863A` → `#F9B637`). A is light on every section — white, warm off-white `#FFF6EA`, pale
blue `#EAF2F8` and grey `#F5F6F8` grounds with navy type and orange actions. There are no dark sections.

## Structure

- `src/App.jsx` — Design A: header, light hero with a three-field lead card, trust bar, power-price chart,
  benefits, how solar works, services, about, testimonials, savings estimator, installer checklist, FAQ,
  full consultation form, footer.
- `src/index.css` — Design A Tailwind entry: design tokens in `@theme`, keyframes, scroll-reveal utilities.
- `src/design-b/` — Design B page, its own Tailwind theme and its own `ImageSlot`.
- `src/components/ImageSlot.jsx` — cover-fit photo that offers a `.webp` before the `.jpg`, or a labelled
  placeholder when no photo is set.
- `src/components/Logo.jsx` — brand mark as inline SVG (orange dot arc and navy wordmark).
- `src/components/DesignSwitch.jsx` — the A / B switch. Inline styles, because it renders inside both
  Tailwind themes.

## Images

Every photograph is stored in `public/img/` and served from this origin — nothing is hot-linked. Each one is
a 1400px `.jpg` with a matching `.webp` alongside it; `ImageSlot` offers the `.webp` first. Licence credits
stay visible in the corner of each frame.

`public/hero.webm`, `public/hero.mp4` and `public/hero-poster.jpg` are Design B's hero film. A does not
load them. They can be deleted if B is dropped, which takes about 12 MB off the build.

## Client content

Phone, address, and the 6,000+ systems, 7 hubs, 70% coverage, 30-year warranty, ~5-year payback, up to 80%
bill reduction and 17c → 34c power price figures all come from the client's own material.

Two things still need confirming before launch:

- **Email address.** `hello@thesolarco.co.nz` in `COMPANY` is a placeholder.
- **Testimonials.** The section on `/#testimonials` is built but its quotes, names and rating are left as
  marked slots. Real Google and Facebook reviews drop straight in. Nothing is invented.
