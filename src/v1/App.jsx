import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Logo from '../components/Logo.jsx'
import ImageSlot from './ImageSlot.jsx'

gsap.registerPlugin(ScrollTrigger)

/* ── content ─────────────────────────────────────────────────────────── */

const FLOW = [
  {
    num: '01',
    title: 'Sun',
    body: 'Every daylight hour puts free energy on your roof. Output drops by roughly a quarter to a half in winter or heavy cloud, and a good design allows for that.',
  },
  {
    num: '02',
    title: 'Panels',
    body: 'Photovoltaic cells turn that sunlight into DC electricity. How much depends on the roof: its orientation, pitch, shading and usable area.',
  },
  {
    num: '03',
    title: 'Inverter',
    body: 'Converts the DC into the mains AC electricity your appliances run on, and reports live production so you and we can see the system working.',
  },
  {
    num: '04',
    title: 'Your home',
    body: 'The switchboard sends solar power to your circuits first. Only what the panels cannot cover is drawn from the grid.',
  },
  {
    num: '05',
    title: 'Battery',
    body: 'Surplus daytime energy charges the battery, so the evening — when a home uses most of its power — runs on sunlight too. Some systems can also keep essentials running through a blackout.',
  },
  {
    num: '06',
    title: 'Grid',
    body: 'Anything left over is exported and measured by an import/export meter. You stay connected with a two-way link: buy when you need more, sell when you make more.',
  },
]

const SYSTEM_TYPES = [
  {
    title: 'Panels only',
    body: 'The simplest system. Energy has to be used as it is made, so if the house is empty by day the surplus is exported and evenings come from the grid.',
    tag: 'Lower upfront cost',
    tagClass: 'bg-grey text-ink/70',
  },
  {
    title: 'Panels + battery',
    body: 'Store the surplus and use it when it suits you, not when it is generated. Battery prices have fallen a long way, which is why most new systems now include one.',
    tag: 'Most new installs',
    tagClass: 'bg-lime text-ink',
  },
]

const SERVICES = [
  {
    num: '01',
    title: 'Residential Solar',
    body: 'Panel systems sized to your roof, your usage and the way your household runs.',
    photo: 'house',
  },
  {
    num: '02',
    title: 'Battery Storage',
    body: 'Store what your roof makes during the day and use it through the evening.',
    photo: 'battery',
  },
  {
    num: '03',
    title: 'Commercial Solar',
    body: 'Larger arrays for businesses, sheds and farms where daytime load is high.',
    photo: 'benefit',
  },
  {
    num: '04',
    title: 'Solar Consultation',
    body: 'Roof analysis, sun mapping and an energy profile before price enters the conversation.',
    photo: 'crew',
  },
]

const ICON = {
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9l-2 6-4 2 2-6 4-2z" />
    </>
  ),
  calculator: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8.5 7.5h7M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01" />
    </>
  ),
  lifebuoy: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M5.6 5.6l3.9 3.9M14.5 14.5l3.9 3.9M14.5 9.5l3.9-3.9M5.6 18.4l3.9-3.9" />
    </>
  ),
}

const VALUES = [
  {
    bg: 'bg-lime',
    icon: 'compass',
    title: 'Design before pricing',
    body: 'We work out what your home needs, then tell you what it costs. Never the other way round.',
  },
  {
    bg: 'bg-orange',
    icon: 'calculator',
    title: 'Plain numbers',
    body: 'Expected generation, expected savings, and the assumptions behind both, written down.',
  },
  {
    bg: 'bg-lime',
    icon: 'lifebuoy',
    title: 'Still here later',
    body: 'Monitoring, servicing and expansion when your energy use changes.',
  },
]

/** Orange for body copy: the deeper amber step keeps paragraph text readable. */
const Amber = ({ children }) => <strong className="font-medium text-amber">{children}</strong>

const BENEFITS = [
  {
    title: 'Lower energy costs.',
    body: (
      <>
        Your appliances run on <Amber>your own generation first</Amber> and only reach for the grid when they
        need more. The more of your own power you use, the less the bill does the talking.
      </>
    ),
    photo: 'benefit',
    alt: 'Solar panels on a home rooftop in daylight',
    rule: 'bg-lime',
  },
  {
    title: 'Power after sunset.',
    body: (
      <>
        Storage holds the energy your roof makes while you are out, so the evening — when a house actually uses
        power — <Amber>runs on sunlight too</Amber>.
      </>
    ),
    photo: 'battery',
    alt: 'A home battery mounted on a garage wall',
    rule: 'bg-gold',
  },
  {
    title: 'Built for decades.',
    body: (
      <>
        Panels, inverter and mounting chosen for your roof and your climate, installed by our own crew, and
        monitored so <Amber>a fault is seen before it costs you anything</Amber>.
      </>
    ),
    photo: 'install',
    alt: 'Installers fitting panels on a roof',
    rule: 'bg-orange',
  },
]

// Placeholder company figures — confirm with the client before launch.
const STATS = [
  { value: 12, suffix: '+', label: 'Years designing solar' },
  { value: 850, suffix: '+', label: 'Systems installed' },
  { value: 6.4, decimals: 1, suffix: ' MW', label: 'Capacity on roofs' },
  { value: 4.9, decimals: 1, suffix: '★', label: 'Average review' },
]

const BILL_BANDS = ['Under $150', '$150–250', '$250–400', '$400+']
const PROPERTY_TYPES = ['House', 'Townhouse / unit', 'Business', 'Farm / rural']

// Placeholder assumptions — replace with the client's confirmed figures.
const ESTIMATE = {
  rate: 0.34, // $ per kWh
  yieldPerKw: 1300, // kWh per kW per year
  costPerKw: 1800, // $ installed per kW
  offsetShare: 0.5, // share of usage solar covers
}

const CC_WIKI = 'https://commons.wikimedia.org/wiki/'
// Same local photographs as v2 — served from public/img/, never hot-linked.
const PHOTOS = {
  house: {
    src: '/img/house.jpg',
    credit: 'Photo: Wikimedia Commons · CC BY-SA 4.0',
    creditHref: `${CC_WIKI}File:Solar_panel_roof_6th_St.jpg`,
  },
  benefit: {
    src: '/img/benefit.jpg',
    credit: 'Photo: Wikimedia Commons · CC BY-SA 4.0',
    creditHref: `${CC_WIKI}File:Solar_Panels_on_Rooftop.jpg`,
  },
  story: {
    src: '/img/story.jpg',
    credit: 'Photo: Wikimedia Commons · CC BY-SA 4.0',
    creditHref: `${CC_WIKI}File:Rooftop_Solar_Panels.jpg`,
  },
  battery: {
    src: '/img/battery.jpg',
    credit: 'Photo: Magda Ehlers · Pexels',
    creditHref: 'https://www.pexels.com/photo/high-efficiency-residential-power-inverter-setup-37929911/',
  },
  install: {
    src: '/img/install.jpg',
    credit: 'Photo: Hanna Alves · Pexels',
    creditHref: 'https://www.pexels.com/photo/construction-worker-climbing-ladder-at-worksite-28812508/',
  },
  crew: {
    src: '/img/crew.jpg',
    credit: 'Photo: Stephen Yang / The Solutions Project · Wikimedia Commons · CC BY 2.0',
    creditHref: `${CC_WIKI}File:Technicians_working_on_a_solar_panel_installation_(9229).jpg`,
  },
}

const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
// Share of annual generation per month — a southern-hemisphere shape, placeholder until the site is known.
const SEASON = [0.115, 0.1, 0.095, 0.075, 0.06, 0.05, 0.055, 0.07, 0.08, 0.095, 0.1, 0.115]
const SEASON_MAX = Math.max(...SEASON)

const fmtKw = (v) => `${Math.round(v)} kW`
const fmtMoney = (v) => `$${(Math.round(v / 50) * 50).toLocaleString()}`
const fmtYears = (v) => `${(Math.round(v * 10) / 10).toFixed(1)} yrs`
const fmtKwh = (v) => `${Math.round(v).toLocaleString()} kWh / yr`

/* ── shared class recipes ────────────────────────────────────────────── */

const BTN =
  'inline-flex items-center justify-center gap-2.5 rounded-full border-0 font-display font-bold whitespace-nowrap cursor-pointer transition-colors'
const BTN_LIME = `${BTN} bg-lime text-ink hover:bg-orange hover:text-ink`
const H2 =
  'm-0 max-w-[15ch] font-display font-bold text-h2 leading-[1] tracking-[-0.04em] text-balance'
const H3 = 'm-0 font-display font-bold text-h3 leading-[1.04] tracking-[-0.03em] text-balance'
const SEC_HEAD = 'flex flex-wrap items-end justify-between gap-6'
const IDX = 'shrink basis-[300px] text-sm text-amber tabular-nums'
const IDX_MUTED = 'text-sm text-ink/50 tabular-nums'
const KICKER = 'text-[13px] font-semibold uppercase tracking-[0.14em] text-amber'
const LEAD = 'mt-[18px] mb-0 text-[17px] leading-[1.65] text-ink/70 text-pretty'
const FRAME = 'relative overflow-hidden rounded-3xl bg-grey shadow-frame'
const FRAME_LG = 'relative overflow-hidden rounded-[28px] bg-grey shadow-frame-lg'
const PARALLAX = 'absolute inset-0 will-change-transform'
const FIELD_LABEL = 'mb-2 block text-[13px] font-semibold'
const INPUT =
  'h-[54px] w-full rounded-[14px] border border-ink/16 bg-white px-4 font-body text-[15px] text-ink placeholder:text-ink/40 transition-colors focus:border-lime-deep focus:outline-none'
const CHIP =
  'relative inline-flex min-h-[46px] cursor-pointer items-center gap-[9px] rounded-full border bg-transparent px-[18px] font-body text-[15px] text-ink transition-colors hover:border-lime-deep'
const CHIP_ON = 'border-ink bg-lime/28'
const CHIP_OFF = 'border-ink/16'

/* ── icons ───────────────────────────────────────────────────────────── */

function Arrow({ color = '#0E1011', size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function Check({ color = '#5E7A17', size = 18, width = 2.2 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  )
}

function Star() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="#B6E241" aria-hidden="true">
      <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7L12 18l-6.2 3.3L7 14.3l-5-4.9 7-.9L12 2z" />
    </svg>
  )
}

function Sun() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#EBD87A"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4" />
    </svg>
  )
}

/**
 * Two rounded rules of unequal length — the shorter one right-aligned under the
 * longer — which even up and cross into an X while the menu is open.
 */
function MenuIcon({ open }) {
  const bar = `absolute right-0 block h-[2px] rounded-full bg-ink transition-all duration-300 ease-out`
  return (
    <span aria-hidden="true" className="relative block h-[16px] w-[20px]">
      <span className={`${bar} w-[20px] ${open ? 'top-[7px] rotate-45' : 'top-[4px]'}`} />
      <span className={`${bar} ${open ? 'top-[7px] w-[20px] -rotate-45' : 'top-[11px] w-[13px]'}`} />
    </span>
  )
}

function Phone() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0E1011"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 3h4l2 5-2.5 1.5a11 11 0 005 5L15 12l5 2v4a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z" />
    </svg>
  )
}

/* ── hooks ───────────────────────────────────────────────────────────── */

function useViewportWidth() {
  const [w, setW] = useState(() => (typeof window === 'undefined' ? 1440 : window.innerWidth))
  useEffect(() => {
    const onResize = () => setW(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return w
}

/**
 * Scroll-driven motion, all on GSAP ScrollTrigger: reveals, the hero's layered
 * exit, the nav pill solidifying, the "how solar works" energy line, the
 * services track and the drifting photographs. Pointer parallax on the hero
 * rides on gsap.quickTo. All of it is skipped for visitors who prefer reduced
 * motion.
 */
function useScrollEffects() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const byId = (id) => document.getElementById(id)

    const ctx = gsap.context(() => {
      const heroTrack = byId('home')
      const stage = byId('hero-stage')
      const primary = byId('hero-primary')
      const secondary = byId('hero-secondary')
      const intro = byId('next')

      if (reduced) {
        // no pinned sequence: a plain viewport-height hero with the primary copy,
        // and the services track scrolls natively
        if (heroTrack) heroTrack.style.height = '100svh'
        if (intro) intro.style.marginTop = '0'
        const scroller = byId('svc-scroller')
        if (scroller) scroller.style.overflowX = 'auto'
        return
      }

      // 1. hero: three scroll phases while the stage is pinned —
      //    headline lifts out → second text rises in → the whole stage moves up
      //    and the next section, sitting underneath, is revealed
      if (heroTrack && stage && primary && secondary) {
        const vh = () => window.innerHeight
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: heroTrack,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
          .to(primary, { y: () => -vh() * 1.15, duration: 1 }, 0)
          .fromTo(secondary, { y: () => vh() * 0.9, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 0.6)
          .to(stage, { y: () => -vh(), duration: 1 }, 2)
      }

      // 2. reveals
      const once = (el, start) => ({ trigger: el, start, once: true })
      gsap.utils.toArray('.rv').forEach((el) =>
        gsap.from(el, { y: 28, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: once(el, 'top 88%') }),
      )
      gsap.utils.toArray('.rvs').forEach((el) =>
        gsap.from(el, { y: 14, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: once(el, 'top 90%') }),
      )
      gsap.utils.toArray('.draw').forEach((el) =>
        gsap.from(el, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: once(el, 'top 85%'),
        }),
      )
      gsap.utils.toArray('[data-words]').forEach((h) =>
        gsap.from(h.querySelectorAll('.wrd'), {
          y: 18,
          opacity: 0,
          duration: 0.7,
          stagger: 0.09,
          ease: 'power3.out',
          scrollTrigger: once(h, 'top 85%'),
        }),
      )
      gsap.utils.toArray('[data-stagger]').forEach((group) =>
        gsap.from(group.children, {
          y: 24,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: once(group, 'top 85%'),
        }),
      )
      gsap.utils.toArray('[data-count]').forEach((el) => {
        const target = parseFloat(el.dataset.count)
        const decimals = Number(el.dataset.decimals || 0)
        const o = { v: 0 }
        gsap.to(o, {
          v: target,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: once(el, 'top 90%'),
          onUpdate: () => {
            el.textContent = o.v.toFixed(decimals)
          },
        })
      })
      gsap.utils.toArray('.plate-rise').forEach((el) =>
        gsap.fromTo(
          el,
          { y: 40 },
          { y: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 55%', scrub: true } },
        ),
      )

      // 3. how solar works: the energy line fills and the nearest step lights up
      const track = byId('flow-track')
      const fill = byId('flow-fill')
      if (track && fill) {
        const steps = gsap.utils.toArray('[data-flow-step]', track)
        const dots = steps.map((st) => st.querySelector('[data-flow-dot]'))
        const bodies = steps.map((st) => st.querySelector('[data-flow-body]'))
        gsap.fromTo(
          fill,
          { height: 0 },
          {
            height: () => track.offsetHeight - 56,
            ease: 'none',
            scrollTrigger: {
              trigger: track,
              start: 'top 50%',
              end: 'bottom 60%',
              scrub: true,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const idx = Math.round(self.progress * (steps.length - 1))
                dots.forEach((dot, i) =>
                  gsap.set(dot, {
                    borderColor: i <= idx ? '#B6E241' : 'rgba(14,16,17,.14)',
                    scale: i === idx ? 1.08 : 1,
                    boxShadow: i === idx ? '0 8px 22px rgba(182,226,65,.45)' : 'none',
                  }),
                )
                bodies.forEach((b, i) => gsap.set(b, { opacity: self.isActive && i !== idx ? 0.62 : 1 }))
              },
            },
          },
        )
      }

      // 4. services: the section pins while vertical scroll runs the four cards
      //    across; it releases once the last card is in view
      const services = byId('services')
      const sc = byId('svc-scroller')
      const svcTrack = byId('svc-track')
      if (services && sc && svcTrack) {
        const mm = gsap.matchMedia()
        mm.add('(min-width: 1024px)', () => {
          const travel = () => Math.max(0, svcTrack.scrollWidth - sc.clientWidth)
          gsap.to(svcTrack, {
            x: () => -travel(),
            ease: 'none',
            scrollTrigger: {
              trigger: services,
              start: 'top top',
              // pin for a bit more than the track's own travel so the pass feels unhurried
              end: () => '+=' + Math.max(Math.round(travel() * 2.4), 1),
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          })
        })
        // phones and tablets: swipe the track natively
        mm.add('(max-width: 1023px)', () => {
          sc.style.overflowX = 'auto'
          sc.style.scrollSnapType = 'x mandatory'
          return () => {
            sc.style.overflowX = ''
            sc.style.scrollSnapType = ''
          }
        })
      }

      // the nav steps aside only while the dark estimator panel is under it.
      // Created after the services pin so its start/end include the pin's spacer.
      const panel = byId('estimate-panel')
      if (panel) {
        ScrollTrigger.create({
          trigger: panel,
          start: 'top 150px',
          end: 'bottom 20px',
          refreshPriority: -1,
          onToggle: ({ isActive }) =>
            window.dispatchEvent(new CustomEvent('nav-hide', { detail: isActive })),
        })
      }

      // 5. large photographs drift inside their frames
      gsap.utils.toArray('[data-parallax]').forEach((el) =>
        gsap.fromTo(
          el.querySelector('img') || el,
          { yPercent: -7, scale: 1.1 },
          {
            yPercent: 7,
            scale: 1.1,
            ease: 'none',
            scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        ),
      )
    })

    // pointer parallax on the hero
    const media = byId('hero-media-inner')
    const glow = byId('hero-glow')
    const copy = byId('hero-copy-inner')
    const ease = { duration: 0.6, ease: 'power2.out' }
    const to = (el, prop) => (el ? gsap.quickTo(el, prop, ease) : () => {})
    const mediaX = to(media, 'x')
    const mediaY = to(media, 'y')
    const glowX = to(glow, 'x')
    const glowY = to(glow, 'y')
    const copyX = to(copy, 'x')
    const onMove = (e) => {
      if (reduced) return
      const tx = e.clientX / window.innerWidth - 0.5
      const ty = e.clientY / window.innerHeight - 0.5
      mediaX(-tx * 14)
      mediaY(-ty * 9)
      glowX(-tx * 26)
      glowY(-ty * 16)
      copyX(-tx * 3)
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const refresh = () => ScrollTrigger.refresh()
    const raf = requestAnimationFrame(refresh)
    if (document.fonts?.ready) document.fonts.ready.then(refresh)
    window.addEventListener('load', refresh)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('load', refresh)
      cancelAnimationFrame(raf)
      ctx.revert()
    }
  }, [])
}

/**
 * Full-bleed background film for the hero. Muted and looping so browsers allow
 * autoplay; the poster frame stands in until the first frame decodes and for
 * visitors who prefer reduced motion, where playback is paused.
 */
function HeroVideo() {
  const ref = useRef(null)
  useEffect(() => {
    const video = ref.current
    if (!video) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => {
      if (mq.matches) video.pause()
      else video.play().catch(() => {})
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])
  return (
    <video
      ref={ref}
      className="absolute inset-0 block h-full w-full object-cover brightness-[1.14] saturate-[1.14] contrast-[1.05]"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster="/hero-poster.jpg"
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src="/hero.webm" type="video/webm" />
      <source src="/hero.mp4" type="video/mp4" />
    </video>
  )
}

function scrollToId(id) {
  const el = id ? document.getElementById(id) : null
  window.scrollTo({
    top: el ? Math.max(0, window.scrollY + el.getBoundingClientRect().top - 96) : 0,
    behavior: 'smooth',
  })
}

/* ── page ────────────────────────────────────────────────────────────── */

export default function App() {
  const w = useViewportWidth()
  const wide = w >= 1000
  const [menuOpen, setMenuOpen] = useState(false)
  const [bill, setBill] = useState(250)
  const [sent, setSent] = useState(false)

  useScrollEffects()

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const go = (id) => (e) => {
    e.preventDefault()
    setMenuOpen(false)
    scrollToId(id)
  }

  const showMobileBar = !wide && !sent

  return (
    <>
      <Header
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((o) => !o)}
        onCloseMenu={closeMenu}
        go={go}
      />
      <Hero showMobileBar={showMobileBar} />
      <Intro />
      <DesignedAroundYou />
      <HowSolarWorks />
      <Benefits />
      <Services />
      <CustomerStory />
      <About />
      <Estimator bill={bill} onBill={setBill} />
      <Quote sent={sent} onSent={setSent} />
      <Footer go={go} />
      {showMobileBar && <MobileBar />}
    </>
  )
}

function Header({ menuOpen, onToggleMenu, onCloseMenu, go }) {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    const onHide = (e) => setHidden(Boolean(e.detail))
    window.addEventListener('nav-hide', onHide)
    return () => window.removeEventListener('nav-hide', onHide)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // clicking anywhere outside the pill or the menu, or pressing Escape, closes it
  useEffect(() => {
    if (!menuOpen) return
    const onPointer = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) onCloseMenu()
    }
    const onKey = (e) => {
      if (e.key === 'Escape') onCloseMenu()
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen, onCloseMenu])

  const menuLink =
    'rounded-full px-5 py-3.5 font-display text-[21px] font-bold tracking-[-0.015em] text-orange transition-colors hover:bg-grey hover:text-lime-deep'
  return (
    <header
      className={`fixed inset-x-0 top-[clamp(16px,2.4vw,28px)] z-20 flex justify-center px-pad transition-[transform,opacity] duration-300 ease-out ${
        hidden && !menuOpen ? 'pointer-events-none -translate-y-[160%] opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <div
        ref={rootRef}
        className={`mx-auto flex flex-col items-stretch gap-2.5 ${
          scrolled ? 'w-full max-w-wrap' : 'w-max max-w-full'
        }`}
      >
        {/* At rest this is one pill. Once scrolled the shell drops its surface
            and the two halves take their own, so the logo becomes a capsule of
            its own at the left and the controls sit apart at the right. */}
        <div
          id="nav-pill"
          className={`flex items-center transition-[gap,padding,background-color,border-color,box-shadow] duration-300 animate-[rise_520ms_ease_both] ${
            scrolled
              ? 'w-full justify-between gap-4 rounded-full border border-transparent bg-transparent p-0 shadow-none'
              : 'gap-[clamp(16px,2vw,32px)] rounded-full border border-white/60 bg-white/88 pr-[clamp(14px,1.6vw,22px)] pl-[clamp(18px,2vw,26px)] shadow-pill backdrop-blur-2xl backdrop-saturate-150'
          }`}
        >
          <a
            href="#home"
            onClick={go(null)}
            aria-label="The Solar Co. home"
            className={`flex shrink-0 items-center rounded-full transition-[height,padding,background-color,border-color,box-shadow] duration-300 ${
              scrolled ? 'h-[72px] border px-[clamp(18px,2vw,26px)] border-white/70 bg-white/74 shadow-[0_8px_32px_rgba(14,16,17,.14),inset_0_1px_0_rgba(255,255,255,.75)] backdrop-blur-2xl backdrop-saturate-150' : 'h-[76px] border border-transparent px-0'
            }`}
          >
            <Logo className="block h-auto w-[clamp(112px,11vw,145px)]" />
          </a>

          <div
            className={`flex shrink-0 items-center gap-2 rounded-full transition-[height,padding,background-color,border-color,box-shadow] duration-300 ${
              scrolled ? 'h-[72px] border pr-2.5 pl-[clamp(14px,1.6vw,20px)] border-white/70 bg-white/74 shadow-[0_8px_32px_rgba(14,16,17,.14),inset_0_1px_0_rgba(255,255,255,.75)] backdrop-blur-2xl backdrop-saturate-150' : 'h-[76px] border border-transparent p-0'
            }`}
          >
            <a
              href="#quote"
              className={`${BTN_LIME} transition-[height,padding,font-size] duration-300 max-sm:hidden ${
                scrolled
                  ? 'h-[52px] px-[clamp(16px,1.8vw,24px)] text-[15px]'
                  : 'h-[56px] px-[clamp(18px,2vw,26px)] text-[15.5px]'
              }`}
            >
              {scrolled ? 'Free Quote' : 'Get a Free Quote'}
            </a>
            <button
              type="button"
              aria-label="Menu"
              aria-expanded={menuOpen}
              onClick={onToggleMenu}
              className={`relative grid cursor-pointer place-items-center rounded-full border-0 bg-grey transition-[height,width,background-color] duration-300 hover:bg-grey-hover ${
                scrolled ? 'h-[52px] w-[52px]' : 'h-[56px] w-[56px]'
              }`}
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className={`flex min-w-[260px] flex-col rounded-[28px] border border-white/60 bg-white/92 p-3 shadow-menu backdrop-blur-2xl backdrop-saturate-150 animate-[rise_240ms_ease_both] ${scrolled ? 'ml-auto' : ''}`}>
            <a href="#home" onClick={go(null)} className={menuLink}>
              Home
            </a>
            <a href="#about" onClick={go('about-area')} className={menuLink}>
              About
            </a>
            <a href="#services" onClick={go('services')} className={menuLink}>
              Services
            </a>
            <a href="#stories" onClick={go('stories')} className={menuLink}>
              Testimonials
            </a>
          </nav>
        )}
      </div>
    </header>
  )
}

function Hero({ showMobileBar }) {
  return (
    <section id="home" className="relative z-[2] h-[320svh]">
      <div
        id="hero-stage"
        style={{ backgroundImage: 'url(/hero-poster.jpg)' }}
        className="sticky top-0 flex h-svh flex-col justify-end overflow-hidden bg-grey bg-cover bg-center pt-[clamp(104px,14vw,128px)] will-change-transform"
      >
      <div id="hero-media" className="absolute -inset-[3%] will-change-transform animate-[fade_900ms_ease_both]">
        <div id="hero-media-inner" className="absolute inset-0 will-change-transform">
          <HeroVideo />
        </div>
      </div>

      <div
        id="hero-glow"
        className="pointer-events-none absolute -top-[18%] -right-[6%] h-[70vw] max-h-[900px] w-[70vw] max-w-[900px] rounded-full mix-blend-screen animate-[fade_1400ms_ease_both] [background:radial-gradient(circle,rgba(255,232,160,.62)_0%,rgba(255,232,160,.2)_44%,rgba(255,232,160,0)_72%)]"
      />
      <div className="pointer-events-none absolute inset-0 [background:linear-gradient(180deg,rgba(255,255,255,.1)_0%,rgba(255,255,255,.02)_34%,rgba(255,255,255,0)_58%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] [background:linear-gradient(180deg,rgba(14,16,17,0)_0%,rgba(14,16,17,.12)_46%,rgba(14,16,17,.4)_100%)]" />

      <div id="hero-copy" className="relative z-[5] w-full px-pad pb-[clamp(36px,5vw,72px)] [text-shadow:0_2px_20px_rgba(14,16,17,.5)]">
        <div id="hero-copy-inner" className="relative mx-auto max-w-wrap will-change-transform">
          <div id="hero-primary" className="will-change-transform">
          <div className="inline-flex min-h-[34px] items-center gap-[9px] rounded-full border border-white/40 bg-white/18 px-[15px] text-[13px] font-medium tracking-[0.02em] whitespace-nowrap text-white backdrop-blur-sm animate-[rise_520ms_ease_120ms_both]">
            <Sun />
            Solar energy made personal
          </div>

          <h1 className="mt-[clamp(18px,2vw,28px)] mb-0 max-w-[15ch] font-display text-h1 leading-[0.92] font-bold tracking-[-0.042em] text-white text-balance animate-[rise_620ms_ease_220ms_both]">
            Power your home. With the <em className="text-lime not-italic">sun</em>.
          </h1>

          <div className="mt-[clamp(28px,3.4vw,44px)] flex flex-wrap items-end justify-between gap-[clamp(24px,4vw,56px)]">
            <div className="max-w-[520px] grow basis-[380px] animate-[rise_560ms_ease_340ms_both]">
              <p className="m-0 max-w-[440px] text-[clamp(16px,1.25vw,19px)] leading-[1.6] text-white/88 text-pretty">
                Clean solar solutions designed around your home, your energy needs and your future.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#quote" className={`${BTN_LIME} h-14 px-[30px] text-base shadow-cta`}>
                  Get a Free Quote
                  <Arrow />
                </a>
                <a
                  href="#services"
                  className={`${BTN} h-14 border border-white/55 bg-transparent px-[26px] text-base font-semibold text-white hover:border-orange hover:bg-orange hover:text-ink`}
                >
                  Explore Our Services
                  <Arrow color="currentColor" />
                </a>
              </div>
            </div>

            <div className="shrink basis-[320px] border-l border-white/28 pl-[clamp(0px,2vw,24px)] animate-[rise_560ms_ease_440ms_both]">
              <div className="flex gap-[3px]" aria-label="Five star rating">
                <Star />
                <Star />
                <Star />
                <Star />
                <Star />
              </div>
              <p className="mt-3 mb-0 text-[15px] leading-[1.55] text-white text-pretty">
                Trusted solar guidance
                <br />
                from consultation to installation.
              </p>
            </div>
          </div>
          {showMobileBar && <div className="h-[88px]" aria-hidden="true" />}
          </div>

          <div id="hero-secondary" className="absolute inset-x-0 bottom-0 opacity-0 will-change-transform">
            <div className="inline-flex min-h-[34px] items-center gap-[9px] rounded-full border border-white/40 bg-white/18 px-[15px] text-[13px] font-medium tracking-[0.02em] whitespace-nowrap text-white backdrop-blur-sm">
              <Sun />
              Consultation · Design · Install · Support
            </div>
            <h2 className="mt-[clamp(18px,2vw,28px)] mb-0 max-w-[14ch] font-display text-[clamp(36px,6.2vw,92px)] leading-[0.94] font-bold tracking-[-0.042em] text-white text-balance">
              Designed around the way you <Orange>live</Orange>.
            </h2>
            <div className="mt-[clamp(24px,3vw,40px)] flex flex-wrap items-end justify-between gap-[clamp(24px,4vw,56px)]">
              <p className="m-0 max-w-[460px] text-[clamp(16px,1.25vw,19px)] leading-[1.6] text-white/88 text-pretty">
                One team from the first roof visit to the last check-in — sizing the system to how much power you
                use, when you use it, and what your roof can actually do.
              </p>
              <a href="#next" className={`${BTN_LIME} h-14 px-[30px] text-base shadow-cta`}>
                See how it works
                <Arrow />
              </a>
            </div>
            {showMobileBar && <div className="h-[88px]" aria-hidden="true" />}
          </div>
        </div>
      </div>

      <a
        href="#next"
        aria-label="Scroll to next section"
        className="absolute top-[calc(50svh-22px)] right-pad z-[6] grid h-11 w-11 place-items-center rounded-full bg-lime shadow-scroll transition-colors animate-[bob_3.4s_ease-in-out_infinite] hover:bg-orange"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0E1011"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M6 13l6 6 6-6" />
        </svg>
      </a>
      </div>
    </section>
  )
}

/** Splits a headline into words that reveal one after another on scroll. */
/** Headline words that reveal one after another; `accent` colours one of them. */
function Words({ words, accent, accentClass = 'text-lime' }) {
  return words.map((word) => (
    <Fragment key={word}>
      <span className={`wrd inline-block${word === accent ? ` ${accentClass}` : ''}`}>{word}</span>{' '}
    </Fragment>
  ))
}

const Lime = ({ children }) => <em className="text-lime not-italic">{children}</em>
const Orange = ({ children }) => <em className="text-orange not-italic">{children}</em>

function Intro() {
  return (
    <section id="next" className="relative z-[1] -mt-[100svh] bg-white px-pad pt-[clamp(84px,9vw,132px)] pb-sec">
      <div className="mx-auto max-w-wrap">
        <h2
          data-words="1"
          className="m-0 max-w-[15ch] font-display text-[clamp(30px,3.6vw,50px)] leading-[1] font-bold tracking-[-0.04em] text-balance"
        >
          <Words words={['Solar', "shouldn't", 'feel', 'complicated.']} accent="complicated." accentClass="text-lime" />
        </h2>
        <div className="mt-[clamp(40px,5vw,72px)] flex flex-wrap gap-[clamp(28px,5vw,88px)]">
          <div className="draw mt-3.5 h-0.5 w-[72px] shrink-0 bg-lime" />
          <p className="rvs m-0 max-w-[620px] grow basis-[420px] text-[clamp(17px,1.5vw,22px)] leading-[1.6] text-ink/72 text-pretty">
            We help homeowners understand their options and design a system around the way they live —{' '}
            <Amber>how much power you use, when you use it</Amber>, and what your roof can actually do.
          </p>
        </div>
      </div>
    </section>
  )
}

function DesignedAroundYou() {
  const tag = 'inline-flex min-h-8 items-center rounded-full bg-grey px-[13px] text-[13px]'
  return (
    <section className="bg-white px-pad pb-sec">
      <div className="relative mx-auto max-w-wrap">
        <div className={`${SEC_HEAD} rvs mb-[clamp(28px,3vw,44px)]`}>
          <div className={KICKER}>Designed around your home</div>
          <div className={IDX_MUTED}>01 — Site &amp; roof</div>
        </div>

        <div className={`${FRAME_LG} aspect-[4/3] sm:aspect-auto sm:h-[clamp(260px,42svh,460px)]`}>
          <div data-parallax="1" className={PARALLAX}>
            <ImageSlot
              {...PHOTOS.house}
              alt="A wide view of a house with a rooftop solar array"
              placeholder="Drop a wide house photograph"
            />
          </div>
        </div>

        <div className="relative z-[2] flex flex-wrap items-start justify-between gap-[clamp(20px,3vw,48px)]">
          <div className="rvs pointer-events-none mt-[clamp(24px,3vw,40px)] min-w-0 shrink basis-[260px]">
            <div className="draw h-px w-full bg-ink/14" />
            <p className="mt-6 mb-0 font-display text-[clamp(18px,1.7vw,24px)] leading-[1.35] font-medium tracking-[-0.02em] text-pretty">
              Two identical houses rarely need identical systems.
            </p>
          </div>

          <div className="plate-rise mt-6 mr-[clamp(0px,2vw,32px)] min-w-0 max-w-[520px] grow basis-[380px] md:mt-[clamp(-96px,-6vw,-40px)] rounded-3xl bg-white p-[clamp(28px,3vw,44px)] shadow-card">
            <h3 className={H3}>Every roof is <Orange>different</Orange>.</h3>
            <p className="mt-[18px] mb-0 text-base leading-[1.65] text-ink/70 text-pretty">
              Orientation, pitch, shading and usable area decide what your roof can generate.{' '}
              <Amber>We map the sun across your roof</Amber> before anyone talks about price.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className={tag}>Orientation</span>
              <span className={tag}>Pitch &amp; tilt</span>
              <span className={tag}>Shading</span>
              <span className={tag}>Usable area</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HowSolarWorks() {
  return (
    <section id="flow" className="bg-grey px-pad py-sec">
      <div className="mx-auto flex max-w-wrap flex-wrap items-start gap-[clamp(40px,5vw,88px)]">
        <div className="min-w-0 max-w-[480px] grow basis-[360px] lg:sticky lg:top-[clamp(128px,12vw,150px)]">
          <div className="text-sm text-amber tabular-nums">02 — How solar works</div>
          <h2 className="mt-5 mb-0 max-w-[15ch] font-display text-[clamp(28px,3.5vw,48px)] leading-[1] font-bold tracking-[-0.04em] text-balance">
            Sunlight, all the way to your <Lime>switchboard</Lime>.
          </h2>
          <p className="mt-6 mb-0 max-w-[420px] text-[17px] leading-[1.65] text-ink/70 text-pretty">
            <Amber>Your appliances use solar power first.</Amber> Anything spare charges a battery or is exported
            and measured — so the system keeps working whether you are home or not.
          </p>
          <a href="#quote" className={`${BTN_LIME} mt-9 h-14 px-7 text-base`}>
            Get a Free Quote
            <Arrow />
          </a>
        </div>

        <div id="flow-track" className="relative min-w-0 grow basis-[420px] pl-1 lg:pr-[clamp(0px,15vw,212px)]">
          <div className="absolute top-7 bottom-7 left-[27px] w-0.5 bg-ink/12" />
          <div
            id="flow-fill"
            className="absolute top-7 left-[27px] h-0 w-0.5 [background:linear-gradient(180deg,#EBD87A_0%,#B6E241_30%,#B6E241_100%)]"
          />
          {FLOW.map((f) => (
            <div key={f.num} data-flow-step="1" className="relative flex gap-[clamp(20px,2.5vw,32px)] pb-[clamp(36px,4.5vw,64px)]">
              <div
                data-flow-dot="1"
                className="grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 border-ink/14 bg-white transition-[transform,border-color,box-shadow] duration-[340ms]"
              >
                <span className="font-display text-[15px] font-bold tabular-nums">{f.num}</span>
              </div>
              <div data-flow-body="1" className="pt-1.5 transition-opacity duration-[340ms]">
                <h3 className="m-0 font-display text-[clamp(22px,2.4vw,30px)] font-bold tracking-[-0.025em]">
                  {f.title}
                </h3>
                <p className="mt-2.5 mb-0 max-w-[460px] text-base leading-[1.6] text-ink/66 text-pretty">{f.body}</p>
              </div>
            </div>
          ))}

          <div data-stagger="1" className="mt-2 grid gap-4 sm:grid-cols-2">
            {SYSTEM_TYPES.map((t) => (
              <div key={t.title} className="rounded-2xl border border-ink/8 bg-white p-6">
                <span className={`inline-flex min-h-7 items-center rounded-full px-3 text-xs font-semibold ${t.tagClass}`}>
                  {t.tag}
                </span>
                <h4 className="mt-4 mb-0 font-display text-[20px] font-bold tracking-[-0.02em]">{t.title}</h4>
                <p className="mt-2 mb-0 text-[15px] leading-[1.6] text-ink/66 text-pretty">{t.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 mb-0 max-w-[560px] text-[14px] leading-[1.6] text-ink/55 text-pretty">
            A common misconception is that solar means going off-grid. Most solar homes keep their grid
            connection, and simply have a small <Amber>power station on the roof</Amber> doing the first shift.
          </p>
        </div>
      </div>
    </section>
  )
}

function Benefits() {
  const [active, setActive] = useState(0)
  const listRef = useRef(null)

  useEffect(() => {
    const items = listRef.current ? [...listRef.current.querySelectorAll('[data-benefit]')] : []
    if (!items.length) return
    const ctx = gsap.context(() => {
      items.forEach((el, i) =>
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => {
            if (self.isActive) setActive(i)
          },
        }),
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section className="relative isolate z-0 bg-white px-pad py-sec">
      <div className="mx-auto max-w-wrap">
        <div className={`${SEC_HEAD} rvs`}>
          <h2 data-words="1" className={`${H2} max-w-[14ch]`}>
            <Words words={['What', 'changes', 'when', 'you', 'go', 'solar.']} accent="solar." accentClass="text-orange" />
          </h2>
          <div className={IDX}>03 — Benefits</div>
        </div>

        <div className="mt-[clamp(40px,5vw,72px)] grid gap-x-[clamp(24px,4vw,64px)] lg:grid-cols-2">
          <div className="sticky top-[112px] z-[1] h-[34vh] lg:top-[132px] lg:h-[min(66svh,calc(100svh-164px))] lg:self-start">
            <div className={`${FRAME} h-full`}>
              {BENEFITS.map((b, i) => (
                <div
                  key={b.title}
                  aria-hidden={i !== active}
                  className={`absolute inset-0 transition-opacity duration-700 ${i === active ? 'opacity-100' : 'opacity-0'}`}
                >
                  <ImageSlot {...PHOTOS[b.photo]} alt={b.alt} />
                </div>
              ))}
            </div>
          </div>

          <div ref={listRef} className="pt-6 lg:pt-0">
            {BENEFITS.map((b, i) => {
              const on = i === active
              return (
                <div
                  key={b.title}
                  data-benefit="1"
                  className="flex min-h-[54vh] flex-col justify-end py-8 max-lg:pb-[12vh] lg:min-h-[calc(100svh-164px)] lg:justify-center lg:py-10"
                >
                  <div className={`h-0.5 w-14 transition-opacity duration-500 ${b.rule} ${on ? 'opacity-100' : 'opacity-0'}`} />
                  <h3
                    className={`${H3} mt-6 max-w-[14ch] text-[clamp(26px,2.9vw,42px)] transition-colors duration-500 ${on ? 'text-ink' : 'text-ink/25'}`}
                  >
                    {b.title}
                  </h3>
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ${on ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className={`${LEAD} max-w-[460px]`}>{b.body}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section id="services" className="relative isolate z-[3] bg-grey px-pad py-sec">
      <div className="mx-auto max-w-wrap">
        <div className={`${SEC_HEAD} rvs`}>
          <h2 className={`${H2} rv`}>Solar solutions for the way you <Lime>live</Lime>.</h2>
          <div className={IDX}>04 — Services</div>
        </div>

        <div id="svc-scroller" className="noscroll -mx-pad mt-[clamp(36px,5vw,64px)] scroll-px-pad overflow-hidden">
          <div id="svc-track" className="flex w-max gap-[clamp(16px,2vw,28px)] px-pad pt-1 pb-2 will-change-transform">
            {SERVICES.map((sv) => {
              const photo = PHOTOS[sv.photo]
              return (
                <a
                  key={sv.num}
                  href="#quote"
                  className="group relative flex min-h-[300px] w-[clamp(225px,23vw,285px)] snap-start flex-col justify-between overflow-hidden rounded-3xl bg-ink p-[clamp(18px,2vw,26px)] text-white transition-[transform,box-shadow] duration-[320ms] hover:-translate-y-1.5 hover:text-white hover:shadow-svc"
                >
                  <img
                    src={photo.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 [background:linear-gradient(180deg,rgba(14,16,17,.35)_0%,rgba(14,16,17,.05)_35%,rgba(14,16,17,.55)_65%,rgba(14,16,17,.9)_100%)]" />
                  <div className="relative flex items-center justify-between">
                    <span className="text-[13px] text-white/70 tabular-nums">{sv.num}</span>
                    <span className="h-0.5 w-7 bg-orange transition-[width] duration-[320ms] group-hover:w-12" />
                  </div>
                  <div className="relative">
                    <h3 className="m-0 font-display text-[clamp(19px,1.8vw,25px)] leading-[1.08] font-bold tracking-[-0.03em] text-balance">
                      {sv.title}
                    </h3>
                    <p className="mt-3 mb-0 text-[15px] leading-[1.6] text-white/75 text-pretty">{sv.body}</p>
                    <div className="mt-6 flex items-center gap-2.5 font-display text-[15px] font-semibold text-lime transition-colors duration-[320ms] group-hover:text-orange">
                      Request a quote
                      <span className="transition-transform duration-[320ms] group-hover:translate-x-1">
                        <Arrow size={16} color="currentColor" />
                      </span>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function CustomerStory() {
  return (
    <section id="stories" className="bg-white px-pad py-sec">
      <div className="mx-auto max-w-wrap">
        <div className={`${SEC_HEAD} rvs mb-[clamp(32px,4vw,56px)]`}>
          <div className={KICKER}>Customer story</div>
          <div className={IDX_MUTED}>05 — In their words</div>
        </div>
        <div className={`${FRAME_LG} aspect-[4/3] sm:aspect-auto sm:h-[clamp(220px,34svh,400px)]`}>
          <div data-parallax="1" className={PARALLAX}>
            <ImageSlot
              {...PHOTOS.story}
              alt="Rooftop solar panels on a customer's home"
              placeholder="Drop the customer's home photograph"
            />
          </div>
        </div>
        {/* the quote runs across the width instead of hugging the left edge, and
            the attribution fills the space beside it */}
        <div className="mt-[clamp(40px,5vw,72px)] flex flex-wrap items-end justify-between gap-[clamp(24px,4vw,64px)]">
          <blockquote className="rv mx-0 mb-0 max-w-[17ch] grow basis-[420px] font-display text-[clamp(26px,3vw,42px)] leading-[1.06] font-medium tracking-[-0.04em] text-balance">
            “[Their words go here — a real review, supplied by you. We have not
            written one on your behalf.]”
          </blockquote>

          <div className="rvs shrink basis-[240px]">
            <div className="flex gap-[3px]" aria-label="Five star rating">
              <Star />
              <Star />
              <Star />
              <Star />
              <Star />
            </div>
            <div className="mt-4 flex items-center gap-4 text-[15px] leading-normal">
              <div className="h-0.5 w-11 shrink-0 bg-lime" />
              <div>
                <strong className="font-semibold">[Customer name]</strong>
                <span className="block text-ink/55">[Suburb] · [System size]</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about-area" className="bg-white px-pad py-sec">
      <div className="mx-auto max-w-wrap">
        <div className={`${SEC_HEAD} rvs`}>
          <h2 className={H2}>A solar <Orange>partner</Orange>, not a panel seller.</h2>
          <div className={IDX}>06 — About us</div>
        </div>

        <div className="mt-[clamp(28px,3.5vw,56px)] grid items-start gap-[clamp(24px,3vw,44px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="relative min-w-0">
            <div className={`${FRAME} rvs aspect-[16/9]`}>
              <div data-parallax="1" className={PARALLAX}>
                <ImageSlot
                  {...PHOTOS.crew}
                  alt="Technicians fitting panels on a roof"
                  placeholder="Drop a team or install-crew photo"
                />
              </div>
            </div>
            <div className="rvs absolute -bottom-6 left-6 flex items-center gap-3.5 rounded-2xl bg-white p-4 pr-6 shadow-card sm:left-8">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-lime">
                <Check color="#0E1011" size={20} width={2.4} />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-[15px] font-bold">Accredited installers</span>
                <span className="block text-[13px] text-ink/55">[Accreditation body] · Est. [YYYY]</span>
              </span>
            </div>
          </div>
          <div className="plate-rise min-w-0 lg:pr-[clamp(0px,15vw,212px)] lg:mt-[clamp(20px,3vw,48px)]">
            <div className="draw h-0.5 w-14 bg-orange" />
            <p className="mt-7 mb-0 text-[17px] leading-[1.65] text-ink/72 text-pretty">
              There is no one-size-fits-all with solar. The right system depends on how you use energy, what your
              roof can do and what you want solar to achieve. We start with those questions,{' '}
              <Amber>then design around the answers</Amber>.
            </p>
            <p className="mt-4 mb-0 text-[17px] leading-[1.65] text-ink/72 text-pretty">
              A system sits on your roof for decades, so the design work, the install and the person who answers
              the phone in year six matter more than the badge on the panel.
            </p>
            <p className="mt-4 mb-0 text-[15px] leading-[1.65] text-ink/55 text-pretty">
              Company history, team size, accreditations and service area are placeholders until you confirm
              them.
            </p>
          </div>
        </div>

        <div
          data-stagger="1"
          className="mt-[clamp(56px,7vw,104px)] grid grid-cols-2 gap-x-6 gap-y-10 border-y border-ink/12 py-[clamp(28px,3vw,44px)] lg:grid-cols-4"
        >
          {STATS.map((st) => (
            <div key={st.label}>
              <div className="font-display text-[clamp(36px,4vw,56px)] leading-none font-bold tracking-[-0.04em] tabular-nums">
                <span data-count={st.value} data-decimals={st.decimals || 0}>
                  0
                </span>
                <span className="text-amber">{st.suffix}</span>
              </div>
              <div className="mt-2 text-[13px] font-semibold tracking-[0.08em] text-ink/50 uppercase">{st.label}</div>
            </div>
          ))}
        </div>
        <p className="mt-3 mb-0 text-[13px] text-ink/45">Placeholder figures until you confirm them.</p>

        <div
          data-stagger="1"
          className="mt-[clamp(48px,6vw,88px)] grid grid-cols-[repeat(auto-fit,minmax(256px,1fr))] gap-6"
        >
          {VALUES.map((v, i) => (
            <div
              key={v.title}
              className={`group relative flex min-h-[280px] flex-col overflow-hidden rounded-3xl ${v.bg} p-[clamp(24px,2.6vw,36px)] text-ink transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-frame`}
            >
              <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/25 blur-2xl" />
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="pointer-events-none absolute -right-8 -bottom-10 h-52 w-52 text-ink/[0.08] transition-transform duration-700 ease-out group-hover:-rotate-6 group-hover:scale-110"
              >
                {ICON[v.icon]}
              </svg>

              <div className="relative flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-white">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {ICON[v.icon]}
                  </svg>
                </span>
                <span className="font-display text-[13px] font-bold text-ink/55 tabular-nums">0{i + 1}</span>
              </div>
              <h3 className="relative mt-auto pt-10 font-display text-[24px] leading-[1.1] font-bold tracking-[-0.025em]">
                {v.title}
              </h3>
              <p className="relative mt-3 mb-0 max-w-[34ch] text-[15px] leading-[1.6] text-ink/75 text-pretty">{v.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/** A number that eases to its new value instead of snapping. */
function AnimatedNumber({ value, format }) {
  const ref = useRef(null)
  const shown = useRef(value)
  useEffect(() => {
    const o = { v: shown.current }
    const tween = gsap.to(o, {
      v: value,
      duration: 0.7,
      ease: 'power2.out',
      onUpdate: () => {
        shown.current = o.v
        if (ref.current) ref.current.textContent = format(o.v)
      },
    })
    return () => tween.kill()
  }, [value, format])
  return <span ref={ref}>{format(value)}</span>
}

function Estimator({ bill, onBill }) {
  const { rate, yieldPerKw, costPerKw, offsetShare } = ESTIMATE
  const annualKwh = (bill * 12) / rate
  const sizeKw = Math.max(3, Math.min(15, Math.round((annualKwh * offsetShare) / yieldPerKw)))
  const saving = Math.max(0, bill * 12 * offsetShare)
  const payback = saving > 0 ? Math.round(((sizeKw * costPerKw) / saving) * 10) / 10 : 0
  const annualGen = sizeKw * yieldPerKw
  const offsetPct = Math.round(offsetShare * 100)
  const growth = 0.45 + 0.55 * (sizeKw / 15)
  const assumptions = `$${rate.toFixed(2)} per kWh, ${yieldPerKw} kWh per kW each year, $${costPerKw} per kW installed, ${offsetPct}% of usage offset.`

  const tile = 'rounded-[14px] border border-white/10 bg-white/6 p-3'
  const tileLabel = 'text-xs font-semibold tracking-[0.08em] text-white/50 uppercase'
  const tileValue =
    'mt-1 font-display text-[clamp(18px,1.7vw,23px)] leading-none font-bold tracking-[-0.03em] tabular-nums'
  const tileSub = 'mt-1.5 text-[11px] text-white/45'

  return (
    <section className="bg-white px-pad pt-sec">
      <div className="mx-auto max-w-wrap">
        <div className={`${SEC_HEAD} rvs`}>
          <h2 className={`${H2} text-[clamp(24px,3vw,42px)] leading-none`}>What could solar do on <Lime>your roof</Lime>?</h2>
          <div className={IDX}>07 — Estimate</div>
        </div>

        <div
          id="estimate-panel"
          className="rvs relative mt-[clamp(14px,1.8vw,26px)] overflow-hidden rounded-[24px] bg-ink text-white"
        >
          <div className="pointer-events-none absolute -top-40 -right-32 h-[520px] w-[520px] rounded-full bg-lime/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-48 -left-24 h-[420px] w-[420px] rounded-full bg-sky/25 blur-3xl" />

          <div className="relative grid gap-[clamp(16px,1.8vw,26px)] p-[clamp(14px,1.6vw,22px)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <div>
              <div className="text-[13px] font-semibold tracking-[0.12em] text-white/55 uppercase">
                Your average monthly power bill
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <strong className="font-display text-[clamp(28px,2.8vw,40px)] leading-none font-bold tracking-[-0.04em] tabular-nums">
                  ${bill}
                </strong>
                <span className="text-[15px] text-white/55">per month</span>
              </div>
              <input
                type="range"
                min="80"
                max="600"
                step="10"
                value={bill}
                onChange={(e) => onBill(Number(e.target.value))}
                aria-label="Average monthly power bill"
                className="mt-3 h-6 w-full cursor-pointer accent-lime"
              />
              <div className="mt-1 flex justify-between text-xs text-white/45 tabular-nums">
                <span>$80</span>
                <span>$600</span>
              </div>
              <p className="mt-4 mb-0 max-w-[380px] text-[13px] leading-[1.55] text-white/60 text-pretty">
                Indicative only, and rounded. <span className="text-orange">A real design</span> uses your usage
                profile, roof and tariff.
              </p>
              <a href="#quote" className={`${BTN_LIME} mt-4 h-[46px] px-[20px] text-[14px]`}>
                Get an exact quote
                <Arrow />
              </a>
            </div>

            <div className="grid content-start gap-2">
              <div className="grid gap-2 sm:grid-cols-3">
                <div className={tile}>
                  <div className={tileLabel}>System size</div>
                  <div className={tileValue}>
                    <AnimatedNumber value={sizeKw} format={fmtKw} />
                  </div>
                  <div className={tileSub}>sized to your usage</div>
                </div>
                <div className={tile}>
                  <div className={tileLabel}>Annual saving</div>
                  <div className={`${tileValue} text-lime`}>
                    <AnimatedNumber value={saving} format={fmtMoney} />
                  </div>
                  <div className={tileSub}>at today&apos;s tariff</div>
                </div>
                <div className={tile}>
                  <div className={tileLabel}>Payback</div>
                  <div className={tileValue}>
                    <AnimatedNumber value={payback} format={fmtYears} />
                  </div>
                  <div className={tileSub}>simple, before rebates</div>
                </div>
              </div>

              <div className={tile}>
                <div className="flex items-center justify-between gap-4 text-[13px]">
                  <span className="font-semibold">Where your power comes from</span>
                  <span className="text-white/55 tabular-nums">{offsetPct}% solar</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/12">
                  <div
                    className="h-full rounded-full bg-lime transition-[width] duration-500"
                    style={{ width: `${offsetPct}%` }}
                  />
                </div>
                <div className="mt-2.5 flex gap-5 text-xs text-white/55">
                  <span className="flex items-center gap-1.5">
                    <i className="inline-block h-2 w-2 rounded-full bg-lime" />
                    Solar {offsetPct}%
                  </span>
                  <span className="flex items-center gap-1.5">
                    <i className="inline-block h-2 w-2 rounded-full bg-white/30" />
                    Grid {100 - offsetPct}%
                  </span>
                </div>
              </div>

              <div className={tile}>
                <div className="flex items-baseline justify-between gap-4 text-[13px]">
                  <span className="font-semibold">Estimated generation through the year</span>
                  <span className="text-white/55 tabular-nums">
                    <AnimatedNumber value={annualGen} format={fmtKwh} />
                  </span>
                </div>
                <div className="mt-2 flex h-[36px] items-end gap-1.5" aria-hidden="true">
                  {SEASON.map((w, i) => (
                    <div
                      key={MONTHS[i] + i}
                      className="flex-1 rounded-t-md bg-lime transition-[height,opacity] duration-500"
                      style={{
                        height: `${(w / SEASON_MAX) * growth * 100}%`,
                        opacity: 0.5 + 0.5 * (w / SEASON_MAX),
                      }}
                    />
                  ))}
                </div>
                <div className="mt-1.5 flex gap-1.5 text-[11px] text-white/45" aria-hidden="true">
                  {MONTHS.map((m, i) => (
                    <span key={m + i} className="flex-1 text-center">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-dashed border-white/25 px-3.5 py-2.5 text-[11.5px] leading-[1.5] text-white/55">
                Placeholder assumptions awaiting your confirmation: {assumptions}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Quote({ sent, onSent }) {
  const [step, setStep] = useState(1)
  const [band, setBand] = useState(null)
  const [property, setProperty] = useState(null)
  const formRef = useRef(null)

  // keep the card's top on screen whenever the step changes
  const goStep = (n) => {
    setStep(n)
    requestAnimationFrame(() => {
      const el = formRef.current
      if (!el) return
      const top = el.getBoundingClientRect().top
      if (top < 100 || top > window.innerHeight * 0.4) {
        window.scrollTo({ top: window.scrollY + top - 120, behavior: 'smooth' })
      }
    })
  }

  const submit = (e) => {
    e.preventDefault()
    onSent(true)
  }
  const reset = () => {
    onSent(false)
    setStep(1)
  }

  const stepLabel = 'font-display text-[13px] font-bold tabular-nums'
  const stepBar = 'h-[3px] grow rounded-full bg-ink/10'
  const stepFill = 'block h-[3px] rounded-full bg-lime'
  const formH3 = 'mt-6 mb-0 font-display text-[clamp(22px,2.4vw,30px)] font-bold tracking-[-0.03em]'
  const formSub = 'mt-2.5 mb-7 text-[15px] text-ink/60'
  const point = 'flex items-center gap-3 text-base'

  return (
    <section
      id="quote"
      className="px-pad py-sec [background:linear-gradient(180deg,#FFFFFF_0%,#F6F6F6_40%,#F6F6F6_100%)]"
    >
      <div className="mx-auto flex max-w-wrap flex-wrap items-start gap-[clamp(40px,5vw,80px)]">
        <div className="min-w-0 max-w-[520px] grow basis-[380px]">
          <h2 className={`${H2} rv max-w-[13ch] text-[clamp(30px,3.6vw,50px)]`}>Ready to make the <Orange>switch</Orange>?</h2>
          <p className="rvs mt-6 mb-0 max-w-[420px] text-[clamp(17px,1.5vw,21px)] leading-[1.6] text-ink/70 text-pretty">
            Let's design a solar solution <Amber>around your home</Amber>.
          </p>
          <div className="rvs mt-10 flex flex-col gap-3.5 border-t border-ink/14 pt-8">
            <div className={point}>
              <Check />
              No cost and no obligation
            </div>
            <div className={point}>
              <Check />A designer replies within [XX] working hours
            </div>
            <div className={point}>
              <Check />
              Your details are only used for the quote
            </div>
          </div>
        </div>

        <form
          ref={formRef}
          onSubmit={submit}
          className="rvs min-w-0 max-w-[600px] grow basis-[420px] rounded-[28px] bg-white p-[clamp(24px,3vw,44px)] shadow-form"
        >
          {!sent && step === 1 && (
            <div>
              <div className="flex items-center gap-3">
                <span className={stepLabel}>Step 1 of 3</span>
                <span className={stepBar}>
                  <i className={`${stepFill} w-1/3`} />
                </span>
              </div>
              <h3 className={formH3}>Where is the roof?</h3>
              <p className={formSub}>Two answers and we can size a system.</p>

              <label className="block">
                <span className={FIELD_LABEL}>Postcode or suburb</span>
                <input
                  type="text"
                  name="postcode"
                  autoComplete="postal-code"
                  placeholder="e.g. 3011"
                  className={INPUT}
                />
              </label>

              <div className="mt-6">
                <span className={`${FIELD_LABEL} mb-3`}>Average monthly power bill</span>
                <div className="flex flex-wrap gap-2">
                  {BILL_BANDS.map((label) => (
                    <button
                      key={label}
                      type="button"
                      aria-pressed={band === label}
                      onClick={() => setBand(label)}
                      className={`${CHIP} ${band === label ? CHIP_ON : CHIP_OFF}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <button type="button" onClick={() => goStep(2)} className={`${BTN_LIME} mt-8 h-[60px] w-full text-[17px]`}>
                Continue
                <Arrow />
              </button>
            </div>
          )}

          {!sent && step === 2 && (
            <div key="step2" className="animate-[revealSoft_300ms_ease_both]">
              <div className="flex items-center gap-3">
                <span className={stepLabel}>Step 2 of 3</span>
                <span className={stepBar}>
                  <i className={`${stepFill} w-2/3`} />
                </span>
              </div>
              <h3 className={formH3}>Where should we send it?</h3>
              <p className={formSub}>
                {band
                  ? `Sized for a bill around ${band} a month.`
                  : 'Name and a number is enough to get started.'}
              </p>

              <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                <label className="block">
                  <span className={FIELD_LABEL}>Name</span>
                  <input type="text" name="name" autoComplete="name" placeholder="Your full name" className={INPUT} />
                </label>
                <label className="block">
                  <span className={FIELD_LABEL}>Phone</span>
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    placeholder="Best number to reach you"
                    className={INPUT}
                  />
                </label>
                <label className="block">
                  <span className={FIELD_LABEL}>Email</span>
                  <input type="email" name="email" autoComplete="email" placeholder="you@email.com" className={INPUT} />
                </label>
                <label className="block">
                  <span className={FIELD_LABEL}>Postcode</span>
                  <input
                    type="text"
                    name="postcode"
                    autoComplete="postal-code"
                    placeholder="Where is the roof?"
                    className={INPUT}
                  />
                </label>
              </div>

              <button type="button" onClick={() => goStep(3)} className={`${BTN_LIME} mt-7 h-[60px] w-full text-[17px]`}>
                Continue
                <Arrow />
              </button>
              <button
                type="button"
                onClick={() => goStep(1)}
                className="mt-2.5 block h-12 w-full cursor-pointer rounded-full border-0 bg-transparent font-body text-sm text-ink/60 hover:text-ink"
              >
                Back
              </button>
            </div>
          )}

          {!sent && step === 3 && (
            <div key="step3" className="animate-[revealSoft_300ms_ease_both]">
              <div className="flex items-center gap-3">
                <span className={stepLabel}>Step 3 of 3</span>
                <span className={stepBar}>
                  <i className={`${stepFill} w-full`} />
                </span>
              </div>
              <h3 className={formH3}>A little about the property</h3>
              <p className={formSub}>This helps us bring the right options to the first conversation.</p>

              <div>
                <span className={`${FIELD_LABEL} mb-3`}>Property type</span>
                <div className="flex flex-wrap gap-2">
                  {PROPERTY_TYPES.map((label) => {
                    const on = property === label
                    return (
                      <label key={label} className={`${CHIP} ${on ? CHIP_ON : CHIP_OFF}`}>
                        <input
                          type="radio"
                          name="property"
                          value={label}
                          checked={on}
                          onChange={() => setProperty(label)}
                          className="absolute h-0 w-0 opacity-0"
                        />
                        <span
                          className={`grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full border ${on ? 'border-ink' : 'border-ink/16'}`}
                        >
                          <i className={`h-2 w-2 rounded-full ${on ? 'bg-ink' : 'bg-transparent'}`} />
                        </span>
                        {label}
                      </label>
                    )
                  })}
                </div>
              </div>

              <label className="mt-6 block">
                <span className={FIELD_LABEL}>
                  Message <span className="font-normal text-ink/50">(optional)</span>
                </span>
                <textarea
                  name="message"
                  rows="3"
                  placeholder="Anything we should know about your roof or your power use?"
                  className={`${INPUT} h-auto resize-y px-4 py-3.5 leading-[1.55]`}
                />
              </label>

              <button type="submit" className={`${BTN_LIME} mt-7 h-[60px] w-full text-[17px]`}>
                Request My Quote
                <Arrow />
              </button>
              <button
                type="button"
                onClick={() => goStep(2)}
                className="mt-2.5 block h-12 w-full cursor-pointer rounded-full border-0 bg-transparent font-body text-sm text-ink/60 hover:text-ink"
              >
                Back
              </button>
            </div>
          )}

          {sent && (
            <div className="px-2 py-10 text-center animate-[rise_360ms_ease_both]">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-lime">
                <Check color="#0E1011" size={30} width={2.4} />
              </div>
              <h3 className="mt-6 mb-0 font-display text-[26px] font-bold tracking-[-0.03em]">Request received</h3>
              <p className="mx-auto mt-3 mb-0 max-w-[340px] text-[15px] leading-[1.65] text-ink/68">
                A designer will be in touch within [XX] working hours to talk through your roof and your
                options.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-7 h-12 cursor-pointer rounded-full border border-ink/18 bg-transparent px-6 font-display text-[15px] font-semibold transition-colors hover:border-orange hover:text-orange"
              >
                Send another request
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  )
}

function Footer({ go }) {
  const heading = 'm-0 text-[13px] font-semibold uppercase tracking-[0.1em] text-ink/45'
  const links = 'mt-5 flex flex-col gap-3 text-[15px] text-ink/66'
  return (
    <footer className="border-t border-ink/12 bg-white px-pad pt-sec pb-10">
      <div className="mx-auto max-w-wrap">
        <div className="flex flex-wrap justify-between gap-[clamp(32px,5vw,80px)]">
          <div className="max-w-[360px] grow basis-[280px]">
            <Logo className="block h-auto w-[145px]" />
            <p className="mt-5 mb-0 text-[15px] leading-[1.7] text-ink/66 text-pretty">
              Solar design, supply and installation for homes that want to run on their own energy.
            </p>
          </div>
          <div className="shrink basis-[160px]">
            <h4 className={heading}>Pages</h4>
            <div className={links}>
              <a href="#home" onClick={go(null)}>
                Home
              </a>
              <a href="#about" onClick={go('about-area')}>
                About
              </a>
              <a href="#services" onClick={go('services')}>
                Services
              </a>
              <a href="#stories" onClick={go('stories')}>
                Testimonials
              </a>
            </div>
          </div>
          <div className="shrink basis-[200px]">
            <h4 className={heading}>Contact</h4>
            <div className={links}>
              <a href="tel:">[XX] XXX XXXX</a>
              <a href="mailto:">hello@[domain]</a>
              <div>
                [Street address]
                <br />
                [City], [Region]
              </div>
            </div>
          </div>
          <div className="shrink basis-[200px]">
            <h4 className={heading}>Service area</h4>
            <div className="mt-5 text-[15px] leading-[1.7] text-ink/66">
              [Regions served — confirm and we will list them here.]
            </div>
          </div>
        </div>
        <div className="mt-14 flex flex-wrap justify-between gap-4 border-t border-ink/12 pt-6 text-[13px] text-ink/50">
          <div>© [YYYY] The Solar Co. All rights reserved.</div>
          <div className="flex gap-5">
            <a href="#" className="text-ink/50 hover:text-ink">
              Privacy
            </a>
            <a href="#" className="text-ink/50 hover:text-ink">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function MobileBar() {
  return (
    <>
      <div className="h-[calc(88px+env(safe-area-inset-bottom))] bg-white" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-[18] flex items-center gap-2.5 bg-white/96 px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] shadow-bar backdrop-blur-xl">
        <a
          href="tel:"
          aria-label="Call us"
          className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full bg-grey transition-colors hover:bg-grey-hover"
        >
          <Phone />
        </a>
        <a href="#quote" className={`${BTN_LIME} h-[52px] grow text-base`}>
          Get a Free Quote
          <Arrow />
        </a>
      </div>
    </>
  )
}
