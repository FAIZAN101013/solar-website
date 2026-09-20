/**
 * Floating switch between the two design directions.
 *
 * A — Light: conversion-focused layout, free-quote form in the hero.
 * B — Video hero: the same content behind a full-width video header.
 *
 * Deliberately A and B rather than v1 and v2: neither direction supersedes the
 * other, and a version number would imply one of them is the older draft.
 *
 * Styled with inline styles on purpose: A and B compile separate Tailwind token
 * sets, so this component cannot rely on utility classes from either.
 */
export default function DesignSwitch({ current = 'a' }) {
  const base = {
    display: 'inline-flex',
    alignItems: 'baseline',
    gap: 6,
    height: 32,
    padding: '0 13px',
    borderRadius: 999,
    border: 0,
    font: '700 13px/1 "Plus Jakarta Sans", system-ui, sans-serif',
    letterSpacing: '0.01em',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transition: 'background-color .2s, color .2s',
  }
  const on = { ...base, background: '#EC5A2C', color: '#fff' }
  const off = { ...base, background: 'transparent', color: '#3D5171' }
  const note = { font: '500 11.5px/1 Inter, system-ui, sans-serif', opacity: 0.75 }

  return (
    <nav
      aria-label="Design direction"
      style={{
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: 'calc(16px + env(safe-area-inset-bottom))',
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        maxWidth: 'calc(100vw - 32px)',
        padding: 5,
        borderRadius: 999,
        background: 'rgba(255,255,255,.92)',
        border: '1px solid #E3E6EB',
        boxShadow: '0 10px 30px rgba(30,42,58,.18)',
        backdropFilter: 'blur(12px) saturate(1.5)',
      }}
    >
      <a href="/" style={current === 'a' ? on : off} aria-current={current === 'a' ? 'page' : undefined}>
        A<span style={note}>Light</span>
      </a>
      <a href="/b.html" style={current === 'b' ? on : off} aria-current={current === 'b' ? 'page' : undefined}>
        B<span style={note}>Video hero</span>
      </a>
    </nav>
  )
}
