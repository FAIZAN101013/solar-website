/**
 * Floating switch between the two design versions.
 *
 * v1 — the original concept: full-bleed dark video hero, pinned scroll sequence.
 * v2 — the reworked concept: light throughout, real client content, lead-first.
 *
 * Styled with inline styles on purpose: v1 and v2 compile separate Tailwind
 * token sets, so this component cannot rely on utility classes from either.
 */
export default function VersionSwitch({ current = 'v2' }) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 38,
    height: 30,
    padding: '0 12px',
    borderRadius: 999,
    border: 0,
    font: '700 13px/1 "Plus Jakarta Sans", system-ui, sans-serif',
    letterSpacing: '0.01em',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'background-color .2s, color .2s',
  }
  const on = { ...base, background: '#EC5A2C', color: '#fff' }
  const off = { ...base, background: 'transparent', color: '#3D5171' }

  return (
    <div
      style={{
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: 'calc(16px + env(safe-area-inset-bottom))',
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: 5,
        borderRadius: 999,
        background: 'rgba(255,255,255,.92)',
        border: '1px solid #E3E6EB',
        boxShadow: '0 10px 30px rgba(30,42,58,.18)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <span
        style={{
          padding: '0 6px 0 8px',
          font: '600 11px/1 Inter, system-ui, sans-serif',
          letterSpacing: '.1em',
          textTransform: 'uppercase',
          color: '#8A94A3',
        }}
      >
        Design
      </span>
      <a href="/v1.html" style={current === 'v1' ? on : off} aria-current={current === 'v1' ? 'page' : undefined}>
        v1
      </a>
      <a href="/" style={current === 'v2' ? on : off} aria-current={current === 'v2' ? 'page' : undefined}>
        v2
      </a>
    </div>
  )
}
