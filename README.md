# The Solar Co. — website

Marketing site for The Solar Co., built with React 19, Vite and Tailwind CSS v4. The home page is a port of the
"Home v2" artboard from the Claude Design project.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Structure

- `src/App.jsx` — the home page: header, hero, sections, savings estimator, two-step quote form, footer.
- `src/index.css` — Tailwind v4 entry: design tokens in `@theme`, keyframes, and the scroll-reveal utilities.
- `src/components/ImageSlot.jsx` — cover-fit photo with credit, or a labelled placeholder when no photo is set.
- `src/components/Logo.jsx` — brand mark as inline SVG (orange dot arc and wordmark).
- `public/hero.webm`, `public/hero.mp4`, `public/hero-poster.jpg` — the hero background film (1080p, muted) and its poster frame. The 4K master lives in `media-src/` (not committed); re-encode with ffmpeg if it changes.

## Placeholders

Copy in square brackets (`[XX]`, `[Customer name]`, `[Regions served]`) and the estimator assumptions in
`src/App.jsx` are waiting on confirmed figures from the client.
