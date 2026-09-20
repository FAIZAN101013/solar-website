/**
 * Floating switch between the two design directions.
 *
 * A — Light: conversion-focused layout, free-quote form in the hero.
 * B — Video hero: the same content behind a full-width video header.
 *
 * Deliberately A and B rather than v1 and v2: neither direction supersedes the
 * other, and a version number would imply one of them is the older draft.
 *
 * It sits in the bottom centre and fades back to 66% while the pointer is
 * elsewhere, so it reads as an overlay rather than part of the page.
 *
 * Styles are scoped inline and in one tagged <style> block on purpose: A and B
 * compile separate Tailwind token sets, so this component cannot rely on
 * utility classes from either.
 */
const CSS = `
.dsw {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: calc(16px + env(safe-area-inset-bottom, 0px));
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e3e6eb;
  box-shadow: 0 10px 28px rgba(30, 42, 58, 0.16);
  backdrop-filter: blur(12px) saturate(1.5);
  opacity: 0.66;
  transition: opacity 0.2s ease;
}
.dsw:hover,
.dsw:focus-within {
  opacity: 1;
}
.dsw a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  font: 700 13px/1 "Plus Jakarta Sans", system-ui, sans-serif;
  color: #3d5171;
  text-decoration: none;
  white-space: nowrap;
  transition: background-color 0.2s, color 0.2s;
}
.dsw a[aria-current] {
  background: #ec5a2c;
  color: #fff;
}
.dsw a span {
  font: 500 11.5px/1 Inter, system-ui, sans-serif;
  opacity: 0.78;
}
/* clear of the fixed call/quote bar on phones */
@media (max-width: 999px) {
  .dsw {
    bottom: calc(96px + env(safe-area-inset-bottom, 0px));
  }
}
@media (max-width: 420px) {
  .dsw a span {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .dsw,
  .dsw a {
    transition-duration: 0.01ms;
  }
}
`

export default function DesignSwitch({ current = 'a' }) {
  return (
    <>
      <style>{CSS}</style>
      <nav className="dsw" aria-label="Design direction">
        <a href="/" aria-current={current === 'a' ? 'page' : undefined}>
          A<span>Light</span>
        </a>
        <a href="/b.html" aria-current={current === 'b' ? 'page' : undefined}>
          B<span>Video hero</span>
        </a>
      </nav>
    </>
  )
}
