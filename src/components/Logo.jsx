import { useId } from 'react'

// Dot arc traced from the brand mark, in a 448 × 185 coordinate space: [cx, cy, r].
// Radii are scaled up slightly at render time; the trace under-reads the dot edges.
const DOTS = [
  [104, 181.5, 1.2],
  [81, 179.5, 1.8],
  [92.5, 174.5, 2.5],
  [115, 173.5, 2.2],
  [63, 164, 2],
  [77, 163, 3],
  [42, 159, 2],
  [106.5, 158.5, 5.5],
  [91, 154.5, 5.8],
  [52, 152, 3],
  [77, 146.5, 5.8],
  [50, 135, 3],
  [65.5, 135, 5.8],
  [37, 128.5, 2.2],
  [58, 120.5, 5.8],
  [42, 116, 3],
  [7, 114.5, 2.2],
  [54.5, 105, 5.8],
  [36, 96, 3],
  [55, 88.5, 5.8],
  [25, 80.5, 2.2],
  [44, 77.5, 3.2],
  [60, 73, 6],
  [44, 66, 2],
  [55, 59.5, 3.2],
  [69, 59.5, 5.8],
  [81.5, 49.5, 5.5],
  [52, 46, 2],
  [96.5, 42.5, 5.5],
  [112, 40, 5],
  [63, 38, 3],
  [85.5, 31, 2.8],
  [107.5, 23, 2.2],
  [90, 14.5, 1.8],
  [112, 11, 1],
  [63, 7, 2],
]

const NAVY = '#273750'

/**
 * The Solar Co. brand mark: a sunburst arc of orange dots beside the wordmark.
 * Rendered inline so the wordmark uses the page's display font.
 *
 * `symbol` crops to the dot arc alone and drops the wordmark — used where the
 * full lockup would take more width than the space can give, such as the
 * scrolled nav capsule.
 */
export default function Logo({ className = '', title = 'The Solar Co.', symbol = false }) {
  const gradId = useId()
  return (
    <svg
      viewBox={symbol ? '30 0 96 185' : '0 0 448 185'}
      role="img"
      aria-label={title}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="1" x2="0.6" y2="0">
          <stop offset="0" stopColor="#EC5A2C" />
          <stop offset="0.55" stopColor="#F4863A" />
          <stop offset="1" stopColor="#F9B637" />
        </linearGradient>
      </defs>

      <g fill={`url(#${gradId})`}>
        {DOTS.map(([cx, cy, r]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r * 1.22} />
        ))}
      </g>

      {!symbol && (
        <>
      <text
        y="121"
        fill={NAVY}
        fontFamily="var(--font-display), 'Plus Jakarta Sans', system-ui, sans-serif"
        fontSize="47"
        lengthAdjust="spacingAndGlyphs"
      >
        <tspan x="90" textLength="95" fontWeight="500">
          THE
        </tspan>
        <tspan x="202" textLength="166" fontWeight="800">
          SOLAR
        </tspan>
        <tspan x="385" textLength="30" fontWeight="600">
          C
        </tspan>
      </text>
      {/* the raised "o" ring and its dot */}
      <circle cx="432.5" cy="100.5" r="9.5" fill="none" stroke={NAVY} strokeWidth="3.6" />
      <circle cx="433" cy="118" r="3" fill={NAVY} />
        </>
      )}
    </svg>
  )
}
