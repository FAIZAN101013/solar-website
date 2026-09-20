import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Logo from './components/Logo.jsx'
import ImageSlot from './components/ImageSlot.jsx'

gsap.registerPlugin(ScrollTrigger)

/* ── company details ──────────────────────────────────────────────────────
   Supplied by the client. Confirm the email address before launch — the phone
   number, street address and figures below come from their own material.
   ─────────────────────────────────────────────────────────────────────── */
const COMPANY = {
  name: 'The Solar Co.',
  phone: '0800 537 6527',
  phoneHref: 'tel:08005376527',
  email: 'hello@thesolarco.co.nz',
  street: '4a Edwin Street',
  suburb: 'Mt Eden',
  city: 'Auckland 1024',
  hours: 'Mon–Fri 8am–5pm',
}

/* ── content ─────────────────────────────────────────────────────────── */

const TRUST = [
  { value: '100%', label: 'NZ owned and operated' },
  { value: '6,000+', label: 'Systems installed nationwide' },
  { value: '7', label: 'Solar hubs across New Zealand' },
  { value: '30yr', label: 'Panel performance warranty' },
]

const STATS = [
  { value: 6000, suffix: '+', label: 'Systems installed' },
  { value: 7, suffix: '', label: 'Solar hubs nationwide' },
  { value: 70, suffix: '%', label: 'Of NZ homes in our service area' },
  { value: 30, suffix: ' yr', label: 'Panel performance warranty' },
]

// Residential power price, cents per kWh. Client-supplied end points (2008, 2024);
// the years between are interpolated for the chart shape.
const POWER_PRICES = [
  { year: 2008, cents: 17 },
  { year: 2012, cents: 22 },
  { year: 2016, cents: 26 },
  { year: 2020, cents: 29 },
  { year: 2024, cents: 34 },
]

const FLOW = [
  {
    num: '01',
    title: 'Sunlight hits your roof',
    body: 'Every daylight hour puts free energy on your roof. Output drops in winter and heavy cloud, and a good design allows for that from the start.',
  },
  {
    num: '02',
    title: 'Panels make DC power',
    body: 'Photovoltaic cells turn that sunlight into DC electricity. How much depends on your roof: its orientation, pitch, shading and usable area.',
  },
  {
    num: '03',
    title: 'The inverter converts it',
    body: 'DC becomes the mains AC your appliances run on. It also reports live production, so you and we can see the system working.',
  },
  {
    num: '04',
    title: 'Your home uses it first',
    body: 'The switchboard sends solar to your circuits before anything else. Only what the panels cannot cover is drawn from the grid.',
  },
  {
    num: '05',
    title: 'A battery holds the surplus',
    body: 'Daytime surplus charges the battery so the evening — when a home uses most of its power — runs on sunlight too.',
  },
  {
    num: '06',
    title: 'The rest goes to the grid',
    body: 'Anything left over is exported and measured by your import/export meter. You buy when you need more and sell when you make more.',
  },
]

const SERVICES = [
  {
    num: '01',
    title: 'Residential Solar',
    body: 'Rooftop systems sized to your roof, your power bill and the way your household actually runs.',
    points: ['Free on-site roof assessment', 'Tier-1 panels, 30-year warranty', 'Full install by our own crews'],
    photo: 'house',
  },
  {
    num: '02',
    title: 'Battery Storage',
    body: 'Store what your roof makes during the day and run the evening peak on your own power instead of the grid.',
    points: ['Sized to your evening load', 'Blackout backup options', 'Retrofits to most existing systems'],
    photo: 'battery',
  },
  {
    num: '03',
    title: 'Commercial Solar',
    body: 'Larger arrays for businesses, sheds, packhouses and farms, where daytime load lines up with generation.',
    points: ['Load-profile analysis', 'Depreciation and ROI modelling', 'Staged installs to suit operations'],
    photo: 'benefit',
  },
  {
    num: '04',
    title: 'Solar Consultation',
    body: 'Roof analysis, sun mapping and an energy profile before price ever enters the conversation.',
    points: ['Shade and orientation study', 'Written generation estimate', 'No cost, no obligation'],
    photo: 'crew',
  },
  {
    num: '05',
    title: 'Monitoring & Servicing',
    body: 'Live production monitoring so a fault is spotted before it costs you anything, plus scheduled servicing.',
    points: ['App-based production tracking', 'Proactive fault alerts', 'Panel cleaning and checks'],
    photo: 'install',
  },
  {
    num: '06',
    title: 'System Expansion',
    body: 'Adding an EV, a heat pump or a spa changes your numbers. We extend the system you already own.',
    points: ['EV charger integration', 'Extra panels and capacity', 'Battery added to a solar-only system'],
    photo: 'story',
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
  house: (
    <>
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5.5 9.5V20h13V9.5" />
    </>
  ),
}

const VALUES = [
  {
    icon: 'compass',
    title: 'Design before pricing',
    body: 'We work out what your home needs, then tell you what it costs. Never the other way round.',
  },
  {
    icon: 'calculator',
    title: 'Plain numbers',
    body: 'Expected generation, expected savings and the assumptions behind both, written down before you sign.',
  },
  {
    icon: 'lifebuoy',
    title: 'Here in year ten',
    body: 'Seven hubs, our own crews, and monitoring and servicing long after the scaffolding comes down.',
  },
  {
    icon: 'house',
    title: '100% New Zealand',
    body: 'NZ owned and operated, with systems specified for New Zealand roofs, weather and grid rules.',
  },
]

/** Orange emphasis for body copy. */
const Amber = ({ children }) => <strong className="font-semibold text-orange">{children}</strong>
const Flame = ({ children }) => <em className="text-orange not-italic">{children}</em>

const BENEFITS = [
  {
    title: 'Cut up to 80% off your power bill.',
    body: (
      <>
        Your appliances run on <Amber>your own generation first</Amber> and only reach for the grid when they
        need more. With the right system and a battery, most of the bill simply stops arriving.
      </>
    ),
    photo: 'benefit',
    alt: 'Solar panels on a New Zealand home rooftop in daylight',
  },
  {
    title: 'Typical payback in around 5 years.',
    body: (
      <>
        A well-designed system pays for itself in roughly five years and then keeps generating for decades.{' '}
        <Amber>Panels carry a 30-year performance warranty</Amber>, so the savings outlast the payback many
        times over.
      </>
    ),
    photo: 'battery',
    alt: 'A home battery mounted on a garage wall',
  },
  {
    title: 'Protection from rising prices.',
    body: (
      <>
        New Zealand residential power went from 17c per kWh in 2008 to 34c in 2024. Generating your own is{' '}
        <Amber>the only way to fix your rate</Amber> for the next thirty years.
      </>
    ),
    photo: 'install',
    alt: 'Installers fitting solar panels on a roof',
  },
]

// Short prompts on purpose. This is a thing you tick off in someone's kitchen,
// not a thing you read — which is what separates it from the FAQ.
const CHECKLIST = [
  'Are they 100% New Zealand owned?',
  'Do they visit the roof, or quote from a satellite image?',
  'Is the generation estimate in writing?',
  'Employed crews, or subcontractors you never meet?',
  'How long is the panel performance warranty?',
  'Is the inverter warranty separate, and how long?',
  'Who watches the monitoring alerts?',
  'Is the quote itemised, line by line?',
  'What happens if you add an EV later?',
  'Can they show you installs nearby?',
]

const FAQS = [
  {
    q: 'How much does a solar system cost?',
    a: 'It depends on roof size, panel count and whether you add a battery. A typical New Zealand home system sits in the mid five figures installed, and a written, itemised quote follows the free roof assessment. We never quote a price before we have seen the roof.',
  },
  {
    q: 'How much can I actually save?',
    a: 'Households that use a good share of their generation, or add a battery, commonly take up to 80% off the bill. The honest answer depends on how much power you use and when you use it, which is exactly what the consultation works out.',
  },
  {
    q: 'How long before the system pays for itself?',
    a: 'Around five years is typical for a well-matched system at current power prices. Because panels carry a 30-year performance warranty, the years after payback are the point of the exercise.',
  },
  {
    q: 'Do I need a battery?',
    a: 'Not necessarily. If the house is busy during the day, panels alone already cover a lot. If it is empty until evening, a battery is what turns daytime generation into evening savings. Battery prices have fallen a long way, which is why most new systems now include one.',
  },
  {
    q: 'What happens on cloudy days and in winter?',
    a: 'Generation drops, by roughly a quarter to a half depending on conditions. That is normal and it is built into the design, which is why systems are sized against a full year of usage rather than a sunny afternoon.',
  },
  {
    q: 'Can I sell power back to the grid?',
    a: 'Yes. Surplus is exported through a two-way import/export meter and your retailer credits it at their buy-back rate. Buy-back is worth less than using the power yourself, which is the main argument for storage.',
  },
  {
    q: 'How long does installation take?',
    a: 'Most residential installs are done in one to two days on site, by our own crews. The paperwork either side — network approval and the meter change — usually takes a few weeks.',
  },
  {
    q: 'Do I need council consent?',
    a: 'Standard roof-mounted residential solar generally does not require building consent in New Zealand. Your network company does need to approve the connection, and we handle that application for you.',
  },
  {
    q: 'What if I sell the house?',
    a: 'The system stays with the property and the warranties transfer to the new owner. A documented, monitored solar system is a straightforward thing to show a buyer.',
  },
  {
    q: 'What warranty do I get?',
    a: '30 years of performance warranty on the panels, a separate manufacturer warranty on the inverter, and our own workmanship warranty on the install. All three are set out in the quote.',
  },
]

/* Testimonials are deliberately left as marked slots. Real reviews will be
   supplied by the client — nothing here is invented. */
const TESTIMONIAL_SLOTS = [
  { location: '[Suburb, city]', system: '[System size] + battery' },
  { location: '[Suburb, city]', system: '[System size]' },
  { location: '[Suburb, city]', system: '[System size] commercial' },
]

const BILL_BANDS = ['Under $150', '$150–250', '$250–400', '$400+']
const PROPERTY_TYPES = ['House', 'Townhouse / unit', 'Business', 'Farm / rural']
const ROOF_TYPES = ['Not sure', 'Colorsteel / metal', 'Tile', 'Membrane / flat']
const TIMEFRAMES = ['As soon as possible', 'Next 3 months', '3–6 months', 'Just researching']
const CONTACT_TIMES = ['Any time', 'Morning', 'Afternoon', 'Evening']

const BLANK_LEAD = {
  name: '',
  email: '',
  phone: '',
  address: '',
  suburb: '',
  roof: ROOF_TYPES[0],
  timeframe: TIMEFRAMES[0],
  contactTime: CONTACT_TIMES[0],
  message: '',
}

// Estimator assumptions, tuned to the client's published outcomes
// (up to 80% of the bill offset, payback around five years).
const ESTIMATE = {
  rate: 0.34, // $ per kWh, NZ residential 2024
  yieldPerKw: 1350, // kWh per kW per year
  costPerKw: 2200, // $ installed per kW
  offsetShare: 0.7, // share of usage a solar + battery system covers
}

const CC_WIKI = 'https://commons.wikimedia.org/wiki/'
// Photographs are stored in public/img/ (1400px jpg + webp) and served from this
// origin. Nothing is hot-linked. `credit` keeps the licence attribution visible.
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
// Share of annual generation per month — southern-hemisphere shape.
const SEASON = [0.115, 0.1, 0.095, 0.075, 0.06, 0.05, 0.055, 0.07, 0.08, 0.095, 0.1, 0.115]
const SEASON_MAX = Math.max(...SEASON)

const fmtKw = (v) => `${Math.round(v)} kW`
const fmtMoney = (v) => `$${(Math.round(v / 50) * 50).toLocaleString()}`
const fmtYears = (v) => `${(Math.round(v * 10) / 10).toFixed(1)} yrs`
const fmtKwh = (v) => `${Math.round(v).toLocaleString()} kWh / yr`

/* ── shared class recipes ────────────────────────────────────────────── */

const BTN =
  'inline-flex items-center justify-center gap-2.5 rounded-full border-0 font-display font-bold whitespace-nowrap cursor-pointer transition-colors'
const BTN_CTA = `${BTN} bg-orange text-white hover:bg-orange-hover hover:text-white`
const BTN_GHOST = `${BTN} border border-navy/20 bg-white text-navy hover:border-orange hover:text-orange`
const H2 = 'm-0 max-w-[18ch] font-display font-bold text-h2 leading-[1.02] tracking-[-0.035em] text-navy text-balance'
const KICKER = 'text-[13px] font-semibold uppercase tracking-[0.14em] text-orange'
const LEAD = 'mt-5 mb-0 max-w-[62ch] text-[17px] leading-[1.7] text-ink/70 text-pretty'
const FRAME = 'relative overflow-hidden rounded-3xl bg-grey shadow-frame'
const FRAME_LG = 'relative overflow-hidden rounded-[28px] bg-grey shadow-frame-lg'
const PARALLAX = 'absolute inset-0 will-change-transform'
const CARD = 'rounded-3xl border border-line bg-white'
const FIELD_LABEL = 'mb-2 block text-[13px] font-semibold text-navy'
const INPUT =
  'h-[52px] w-full rounded-xl border border-line bg-white px-4 font-body text-[15px] text-ink placeholder:text-ink/40 transition-colors focus:border-orange focus:outline-none'
const SELECT = `${INPUT} cursor-pointer appearance-none bg-[length:16px] bg-[right_16px_center] bg-no-repeat pr-11 [background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231E2A3A' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")]`
const CHIP =
  'relative inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border bg-white px-4 font-body text-[14px] text-ink transition-colors hover:border-orange'
const CHIP_ON = 'border-orange bg-sun text-navy'
const CHIP_OFF = 'border-line'

/* ── icons ───────────────────────────────────────────────────────────── */

function Arrow({ color = 'currentColor', size = 18 }) {
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

function Check({ color = '#2E7D52', size = 18, width = 2.2 }) {
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

function Star({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#F9B637" aria-hidden="true">
      <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7L12 18l-6.2 3.3L7 14.3l-5-4.9 7-.9L12 2z" />
    </svg>
  )
}

function Sun({ color = '#F9B637', size = 14 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
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
  const bar = `absolute right-0 block h-[2px] rounded-full bg-navy transition-all duration-300 ease-out`
  return (
    <span aria-hidden="true" className="relative block h-[16px] w-[20px]">
      <span className={`${bar} w-[20px] ${open ? 'top-[7px] rotate-45' : 'top-[4px]'}`} />
      <span className={`${bar} ${open ? 'top-[7px] w-[20px] -rotate-45' : 'top-[11px] w-[13px]'}`} />
    </span>
  )
}

function Phone({ color = '#1E2A3A', size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 3h4l2 5-2.5 1.5a11 11 0 005 5L15 12l5 2v4a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z" />
    </svg>
  )
}

function Pin({ color = '#1E2A3A', size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

function Mail({ color = '#1E2A3A', size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5l8.5 6 8.5-6" />
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
 * Scroll-driven motion on GSAP ScrollTrigger: reveals, the "how solar works"
 * energy line, the services track and the drifting photographs. All of it is
 * skipped for visitors who prefer reduced motion.
 */
function useScrollEffects() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const byId = (id) => document.getElementById(id)

    const ctx = gsap.context(() => {
      if (reduced) return

      // 1. reveals
      const once = (el, start) => ({ trigger: el, start, once: true })
      gsap.utils.toArray('.rv').forEach((el) =>
        gsap.from(el, { y: 26, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: once(el, 'top 88%') }),
      )
      gsap.utils.toArray('.rvs').forEach((el) =>
        gsap.from(el, { y: 14, opacity: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: once(el, 'top 92%') }),
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
          y: 16,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: once(h, 'top 86%'),
        }),
      )
      gsap.utils.toArray('[data-stagger]').forEach((group) =>
        gsap.from(group.children, {
          y: 22,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: once(group, 'top 86%'),
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
          scrollTrigger: once(el, 'top 92%'),
          onUpdate: () => {
            el.textContent = Number(o.v.toFixed(decimals)).toLocaleString()
          },
        })
      })

      // 2. how solar works: the energy line fills and the nearest step lights up
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
              start: 'top 55%',
              end: 'bottom 65%',
              scrub: true,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const idx = Math.round(self.progress * (steps.length - 1))
                dots.forEach((dot, i) =>
                  gsap.set(dot, {
                    borderColor: i <= idx ? '#EC5A2C' : '#E3E6EB',
                    backgroundColor: i <= idx ? '#FFF6EA' : '#FFFFFF',
                    scale: i === idx ? 1.08 : 1,
                  }),
                )
                bodies.forEach((b, i) => gsap.set(b, { opacity: self.isActive && i !== idx ? 0.66 : 1 }))
              },
            },
          },
        )
      }

      // 3. large photographs drift inside their frames
      gsap.utils.toArray('[data-parallax]').forEach((el) =>
        gsap.fromTo(
          el.querySelector('img') || el,
          { yPercent: -6, scale: 1.1 },
          {
            yPercent: 6,
            scale: 1.1,
            ease: 'none',
            scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        ),
      )
    })

    const refresh = () => ScrollTrigger.refresh()
    const raf = requestAnimationFrame(refresh)
    if (document.fonts?.ready) document.fonts.ready.then(refresh)
    window.addEventListener('load', refresh)

    return () => {
      window.removeEventListener('load', refresh)
      cancelAnimationFrame(raf)
      ctx.revert()
    }
  }, [])
}

function scrollToId(id) {
  const el = id ? document.getElementById(id) : null
  window.scrollTo({
    top: el ? Math.max(0, window.scrollY + el.getBoundingClientRect().top - 96) : 0,
    behavior: 'smooth',
  })
}

/* ── page ────────────────────────────────────────────────────────────── */

const NAV = [
  { label: 'Home', id: null },
  { label: 'About Us', id: 'about' },
  { label: 'Services', id: 'services' },
  { label: 'Testimonials', id: 'testimonials' },
  { label: 'FAQ', id: 'faq' },
]

export default function App() {
  const w = useViewportWidth()
  const wide = w >= 1000
  const [menuOpen, setMenuOpen] = useState(false)
  const [bill, setBill] = useState(250)
  const [sent, setSent] = useState(false)
  // The lead fields live here so the hero's three-field card can hand its
  // answers straight to the full consultation form further down the page.
  const [lead, setLead] = useState(BLANK_LEAD)

  useScrollEffects()

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const go = useCallback(
    (id) => (e) => {
      if (e) e.preventDefault()
      setMenuOpen(false)
      scrollToId(id)
    },
    [],
  )

  const showMobileBar = !wide && !sent

  return (
    <>
      <Header menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((o) => !o)} onCloseMenu={closeMenu} go={go} />
      <main>
        <Hero showMobileBar={showMobileBar} onQuickLead={setLead} />
        <TrustBar />
        <Intro />
        <PowerPrices />
        <Benefits />
        <HowSolarWorks />
        <Services />
        <About />
        <Checklist />
        <Testimonials />
        <Estimator bill={bill} onBill={setBill} />
        <Faq />
        <Quote sent={sent} onSent={setSent} fields={lead} onFields={setLead} bill={bill} />
      </main>
      <Footer go={go} />
      {showMobileBar && <MobileBar />}
    </>
  )
}

function Header({ menuOpen, onToggleMenu, onCloseMenu, go }) {
  const [scrolled, setScrolled] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

  const navLink =
    'rounded-full px-3.5 py-2 font-display text-[15px] font-semibold text-navy transition-colors hover:bg-grey hover:text-orange'
  const menuLink =
    'rounded-2xl px-4 py-3 font-display text-[17px] font-bold text-navy transition-colors hover:bg-grey hover:text-orange'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled ? 'border-b border-line bg-white/92 shadow-pill backdrop-blur-xl' : 'border-b border-transparent bg-white'
      }`}
    >
      {/* utility strip: the phone number is visible before anything else */}
      <div className="hidden border-b border-line bg-sun px-pad lg:block">
        <div className="mx-auto flex max-w-wrap items-center justify-between gap-6 py-2 text-[13px] text-navy">
          <span className="flex items-center gap-2">
            <Sun size={13} />
            100% New Zealand owned and operated · 6,000+ systems installed
          </span>
          <span className="flex items-center gap-5">
            <a href={COMPANY.phoneHref} className="flex items-center gap-2 font-semibold hover:text-orange">
              <Phone size={14} color="#EC5A2C" />
              {COMPANY.phone}
            </a>
            <span className="flex items-center gap-2 text-ink/60">
              <Pin size={14} color="#3D5171" />
              {COMPANY.street}, {COMPANY.suburb}, {COMPANY.city}
            </span>
          </span>
        </div>
      </div>

      <div ref={rootRef} className="px-pad">
        <div className="mx-auto flex max-w-wrap items-center justify-between gap-4 py-3.5">
          <a href="#home" onClick={go(null)} aria-label={`${COMPANY.name} home`} className="flex shrink-0 items-center">
            <Logo className="block h-auto w-[clamp(118px,11vw,152px)]" />
          </a>

          <nav className="hidden items-center gap-0.5 lg:flex">
            {NAV.map((n) => (
              <a key={n.label} href={n.id ? `#${n.id}` : '#home'} onClick={go(n.id)} className={navLink}>
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={COMPANY.phoneHref}
              className={`${BTN_GHOST} h-[48px] px-4 text-[15px] max-md:hidden`}
              aria-label={`Call ${COMPANY.phone}`}
            >
              <Phone size={17} color="#EC5A2C" />
              {COMPANY.phone}
            </a>
            <a href="#quote" onClick={go('quote')} className={`${BTN_CTA} h-[48px] px-5 text-[15px] shadow-cta max-sm:hidden`}>
              Free Quote
            </a>
            <button
              type="button"
              aria-label="Menu"
              aria-expanded={menuOpen}
              onClick={onToggleMenu}
              className="relative grid h-[48px] w-[48px] cursor-pointer place-items-center rounded-full border border-line bg-white transition-colors hover:bg-grey lg:hidden"
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="mx-auto mb-3 flex max-w-wrap flex-col rounded-3xl border border-line bg-white p-2 shadow-menu lg:hidden animate-[revealSoft_220ms_ease_both]">
            {NAV.map((n) => (
              <a key={n.label} href={n.id ? `#${n.id}` : '#home'} onClick={go(n.id)} className={menuLink}>
                {n.label}
              </a>
            ))}
            <a href={COMPANY.phoneHref} className={`${menuLink} flex items-center gap-2.5 text-orange`}>
              <Phone size={18} color="#EC5A2C" />
              {COMPANY.phone}
            </a>
          </nav>
        )}
      </div>
    </header>
  )
}

/* ── hero: light, lead-first ─────────────────────────────────────────── */

function Hero({ showMobileBar, onQuickLead }) {
  const [form, setForm] = useState({ name: '', phone: '', suburb: '' })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    onQuickLead((lead) => ({ ...lead, name: form.name, phone: form.phone, suburb: form.suburb }))
    scrollToId('quote')
  }

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-white px-pad pt-[clamp(104px,11vw,140px)] pb-[clamp(36px,4vw,56px)]"
    >
      {/* soft daylight wash — keeps the page light, never dark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[28%] -right-[10%] h-[70vw] max-h-[820px] w-[70vw] max-w-[820px] rounded-full [background:radial-gradient(circle,rgba(249,182,55,.22)_0%,rgba(249,182,55,.07)_45%,rgba(249,182,55,0)_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[30%] -left-[14%] h-[52vw] max-h-[620px] w-[52vw] max-w-[620px] rounded-full [background:radial-gradient(circle,rgba(234,242,248,.9)_0%,rgba(234,242,248,0)_70%)]"
      />

      <div className="relative mx-auto grid max-w-wrap items-start gap-[clamp(24px,2.8vw,44px)] lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)]">
        <div>
          <div className="inline-flex min-h-[30px] items-center gap-2 rounded-full border border-gold-soft bg-sun px-3 text-[12.5px] font-semibold tracking-[0.01em] text-navy animate-[rise_500ms_ease_both]">
            <Sun />
            100% NZ owned · 6,000+ systems installed
          </div>

          <h1 className="mt-[clamp(12px,1.3vw,18px)] mb-0 max-w-[15ch] font-display text-[clamp(30px,3.5vw,48px)] leading-[1] font-extrabold tracking-[-0.04em] text-navy text-balance animate-[rise_600ms_ease_120ms_both]">
            Cut up to <Flame>80%</Flame> off your power bill.
          </h1>

          <p className="mt-[clamp(12px,1.2vw,16px)] mb-0 max-w-[52ch] text-[clamp(14.5px,1.05vw,16.5px)] leading-[1.6] text-ink/72 text-pretty animate-[rise_560ms_ease_200ms_both]">
            Solar and battery systems designed around your roof, your power use and your budget. Free on-site
            assessment, a written estimate before you commit, and typical payback in around five years.
          </p>

          <ul
            className="mt-5 mb-0 grid list-none gap-x-4 gap-y-2 p-0 sm:grid-cols-2 animate-[rise_560ms_ease_280ms_both]"
            aria-label="Why homeowners choose us"
          >
            {[
              'Free roof assessment, no obligation',
              '30-year panel performance warranty',
              '7 solar hubs covering 70% of NZ homes',
              'Installed by our own qualified crews',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2 text-[13.5px] leading-[1.45] text-ink/78">
                <span className="mt-0.5 shrink-0">
                  <Check size={15} width={2.4} />
                </span>
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-3 animate-[rise_560ms_ease_340ms_both]">
            <a href="#quote" className={`${BTN_CTA} h-[50px] px-6 text-[15.5px] shadow-cta`}>
              Get My Free Quote
              <Arrow color="#fff" />
            </a>
            <a href={COMPANY.phoneHref} className={`${BTN_GHOST} h-[50px] px-5 text-[15.5px]`}>
              <Phone size={17} color="#EC5A2C" />
              {COMPANY.phone}
            </a>
          </div>
        </div>

        {/* quick lead capture, above the fold */}
        <div className="animate-[rise_640ms_ease_260ms_both]">
          <div className={`${FRAME_LG} aspect-[16/10] w-full sm:aspect-[21/9] lg:aspect-[5/2]`}>
            <div data-parallax="1" className={PARALLAX}>
              <ImageSlot
                {...PHOTOS.house}
                eager
                alt="A New Zealand home with a rooftop solar array in daylight"
                placeholder="Drop a wide house photograph"
              />
            </div>
          </div>

          <form
            onSubmit={submit}
            className="relative z-[2] mx-auto -mt-[clamp(24px,2.6vw,36px)] w-[min(100%,560px)] rounded-3xl border border-line bg-white p-[clamp(18px,1.9vw,24px)] shadow-form"
          >
            <h2 className="m-0 font-display text-[clamp(17px,1.5vw,20px)] leading-tight font-bold tracking-[-0.025em] text-navy">
              Book a free solar assessment
            </h2>
            <p className="mt-1 mb-4 text-[13px] leading-[1.5] text-ink/62">
              Three details is all we need to call you back.
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <label className="block">
                <span className="sr-only">Your name</span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={set('name')}
                  className={`${INPUT} h-[46px]`}
                />
              </label>
              <label className="block">
                <span className="sr-only">Phone number</span>
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={set('phone')}
                  className={`${INPUT} h-[46px]`}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="sr-only">Suburb</span>
                <input
                  type="text"
                  name="suburb"
                  autoComplete="address-level2"
                  placeholder="Suburb or town"
                  value={form.suburb}
                  onChange={set('suburb')}
                  className={`${INPUT} h-[46px]`}
                />
              </label>
            </div>
            <button type="submit" className={`${BTN_CTA} mt-3 h-[48px] w-full text-[15px] shadow-cta`}>
              Request My Free Quote
              <Arrow color="#fff" />
            </button>
            <p className="mt-2.5 mb-0 text-center text-[11.5px] leading-[1.45] text-ink/55">
              No cost, no obligation. Your details are used only for this quote.
            </p>
          </form>
        </div>
      </div>

      {showMobileBar && <div className="h-[72px]" aria-hidden="true" />}
    </section>
  )
}

function TrustBar() {
  return (
    <section aria-label="Company credentials" className="border-y border-line bg-grey px-pad py-[clamp(24px,3vw,40px)]">
      <div data-stagger="1" className="mx-auto grid max-w-wrap grid-cols-2 gap-x-6 gap-y-7 lg:grid-cols-4">
        {TRUST.map((t) => (
          <div key={t.label} className="text-center lg:text-left">
            <div className="font-display text-[clamp(26px,3vw,40px)] leading-none font-extrabold tracking-[-0.035em] text-orange tabular-nums">
              {t.value}
            </div>
            <div className="mx-auto mt-2 max-w-[22ch] text-[13.5px] leading-[1.45] text-ink/65 lg:mx-0">{t.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

/**
 * Section header: kicker and section index share one row, the heading sits under
 * them. Keeps the top of every section to three tight lines on a laptop screen.
 */
function SectionHead({ kicker, index, children, lead }) {
  return (
    <header className="rvs">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
        <span className={KICKER}>{kicker}</span>
        {index && <span className="text-[13px] text-ink/40 tabular-nums">{index}</span>}
      </div>
      <h2 className={`${H2} mt-3`}>{children}</h2>
      {lead && <p className={LEAD}>{lead}</p>}
    </header>
  )
}

/** Headline words that reveal one after another; `accent` colours one of them. */
function Words({ words, accent }) {
  return words.map((word, i) => (
    <Fragment key={word + i}>
      <span className={`wrd inline-block${word === accent ? ' text-orange' : ''}`}>{word}</span>{' '}
    </Fragment>
  ))
}

function Intro() {
  return (
    <section className="bg-white px-pad py-sec">
      <div className="mx-auto max-w-wrap">
        <h2
          data-words="1"
          className="m-0 max-w-[20ch] font-display text-[clamp(30px,4.4vw,64px)] leading-[1.02] font-extrabold tracking-[-0.038em] text-navy text-balance"
        >
          <Words words={['Solar', "shouldn't", 'feel', 'complicated.']} accent="complicated." />
        </h2>
        <div className="mt-[clamp(28px,3.5vw,52px)] flex flex-wrap gap-[clamp(24px,4vw,72px)]">
          <div className="draw mt-3.5 h-0.5 w-[72px] shrink-0 bg-gold" />
          <p className="rvs m-0 max-w-[620px] grow basis-[420px] text-[clamp(16px,1.4vw,20px)] leading-[1.65] text-ink/72 text-pretty">
            We have put solar on more than six thousand New Zealand roofs. Every one started the same way:{' '}
            <Amber>what does this household actually use, and when</Amber>. The system is designed around the
            answer, not the other way round.
          </p>
        </div>
      </div>
    </section>
  )
}

function PowerPrices() {
  const max = Math.max(...POWER_PRICES.map((p) => p.cents))
  return (
    <section className="bg-sun px-pad py-sec">
      <div className="mx-auto grid max-w-wrap items-center gap-[clamp(32px,4vw,72px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <div className={KICKER}>Why now</div>
          <h2 className={`${H2} rv mt-4`}>
            Power prices have <Flame>doubled</Flame> since 2008.
          </h2>
          <p className={LEAD}>
            New Zealand residential electricity went from <Amber>17 cents per kWh in 2008</Amber> to{' '}
            <Amber>34 cents in 2024</Amber>. Every year you wait, the grid costs more and the case for
            generating your own gets stronger.
          </p>
          <a href="#quote" className={`${BTN_CTA} mt-8 h-[54px] px-6 text-[16px] shadow-cta`}>
            Lock in your own rate
            <Arrow color="#fff" />
          </a>
        </div>

        <figure className="rvs m-0 rounded-3xl border border-gold-soft bg-white p-[clamp(20px,2.4vw,32px)] shadow-frame">
          <figcaption className="mb-6 flex items-baseline justify-between gap-4">
            <span className="font-display text-[15px] font-bold text-navy">NZ residential power price</span>
            <span className="text-[13px] text-ink/55">cents per kWh</span>
          </figcaption>
          <div className="flex h-[200px] items-end gap-[clamp(8px,1.6vw,20px)]">
            {POWER_PRICES.map((p, i) => {
              const last = i === POWER_PRICES.length - 1
              return (
                <div key={p.year} className="flex flex-1 flex-col items-center gap-2">
                  <span
                    className={`font-display text-[13px] font-bold tabular-nums ${last ? 'text-orange' : 'text-ink/55'}`}
                  >
                    {p.cents}c
                  </span>
                  <div
                    className={`w-full rounded-t-lg transition-[height] duration-700 ${last ? 'bg-orange' : 'bg-gold-soft'}`}
                    style={{ height: `${(p.cents / max) * 150}px` }}
                  />
                  <span className="text-[12px] text-ink/50 tabular-nums">{p.year}</span>
                </div>
              )
            })}
          </div>
          <p className="mt-5 mb-0 border-t border-line pt-4 text-[12.5px] leading-[1.5] text-ink/55">
            2008 and 2024 figures supplied by The Solar Co.; intermediate years shown for shape.
          </p>
        </figure>
      </div>
    </section>
  )
}

function Benefits() {
  return (
    <section className="bg-white px-pad py-sec">
      <div className="mx-auto max-w-wrap">
        <SectionHead kicker="The difference it makes" index="01 — Benefits">
          What solar actually does for a <Flame>New Zealand home</Flame>.
        </SectionHead>

        <div data-stagger="1" className="mt-[clamp(24px,3vw,44px)] grid gap-5 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <article key={b.title} className={`${CARD} overflow-hidden transition-shadow duration-300 hover:shadow-card`}>
              <div className="relative aspect-[2/1]">
                <ImageSlot
                  {...PHOTOS[b.photo]}
                  alt={b.alt}
                  sizes="(max-width: 1024px) 100vw, 380px"
                  placeholder="Drop a photograph"
                />
              </div>
              <div className="p-[clamp(16px,1.7vw,22px)]">
                <h3 className="m-0 font-display text-[clamp(17px,1.5vw,20px)] leading-[1.15] font-bold tracking-[-0.025em] text-navy text-balance">
                  {b.title}
                </h3>
                <p className="mt-2.5 mb-0 text-[13.5px] leading-[1.6] text-ink/70 text-pretty">{b.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowSolarWorks() {
  return (
    <section id="how" className="bg-grey px-pad py-sec">
      <div className="mx-auto grid max-w-wrap gap-[clamp(28px,3.5vw,64px)] lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        {/* the heading column holds the width on wide screens so the timeline
            is not a lone strip down the left edge */}
        <div className="lg:sticky lg:top-[132px] lg:self-start">
          <SectionHead kicker="How solar works" index="02 — How it works">
            From <Flame>sunlight</Flame> to the socket, in six steps.
          </SectionHead>
          <p className={LEAD}>
            No jargon and no black boxes. This is the whole chain, from the roof to the grid and back again.
          </p>

          <div className={`${FRAME} rvs mt-8 hidden aspect-[4/3] lg:block`}>
            <div data-parallax="1" className={PARALLAX}>
              <ImageSlot
                {...PHOTOS.benefit}
                sizes="420px"
                alt="Solar panels on a rooftop feeding a home"
                placeholder="Drop a rooftop photograph"
              />
            </div>
          </div>

          <a href="#quote" className={`${BTN_CTA} mt-8 h-[52px] px-6 text-[16px] shadow-cta`}>
            See it on your roof
            <Arrow color="#fff" />
          </a>
        </div>

        <div id="flow-track" className="relative pl-[46px] sm:pl-[60px] lg:pt-2">
          <div className="absolute top-7 bottom-7 left-[15px] w-0.5 bg-line sm:left-[22px]" aria-hidden="true" />
          <div id="flow-fill" className="absolute top-7 left-[15px] w-0.5 bg-orange sm:left-[22px]" aria-hidden="true" />

          <ol className="m-0 grid list-none gap-[clamp(18px,2vw,28px)] p-0">
            {FLOW.map((f) => (
              <li key={f.num} data-flow-step="1" className="relative">
                <span
                  data-flow-dot="1"
                  aria-hidden="true"
                  className="absolute top-1 -left-[46px] grid h-8 w-8 place-items-center rounded-full border-2 border-line bg-white font-display text-[12px] font-bold text-navy tabular-nums sm:-left-[60px] sm:h-11 sm:w-11 sm:text-[14px]"
                >
                  {f.num}
                </span>
                <div data-flow-body="1">
                  <h3 className="m-0 font-display text-[clamp(17px,1.5vw,21px)] leading-tight font-bold tracking-[-0.02em] text-navy">
                    {f.title}
                  </h3>
                  <p className="mt-2 mb-0 max-w-[58ch] text-[14.5px] leading-[1.6] text-ink/70 text-pretty">{f.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ── required section: Services ──────────────────────────────────────── */

function Services() {
  return (
    <section id="services" className="bg-white px-pad py-sec">
      <div className="mx-auto max-w-wrap">
        <SectionHead kicker="Services" index="03 — Services">
          Everything from the first roof visit to <Flame>year thirty</Flame>.
        </SectionHead>

        {/* a plain grid, not a pinned horizontal track: every card is fully
            visible without hijacking the scroll */}
        <div data-stagger="1" className="mt-[clamp(26px,3vw,44px)] grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((sv) => (
            <article
              key={sv.num}
              className={`${CARD} group flex flex-col overflow-hidden transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-card`}
            >
              <div className="relative aspect-[2/1] shrink-0 overflow-hidden">
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
                  <ImageSlot
                    {...PHOTOS[sv.photo]}
                    credit={undefined}
                    alt=""
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                  />
                </div>
                <span className="absolute top-3 left-3 rounded-full bg-white/92 px-2.5 py-1 font-display text-[12px] font-bold text-navy tabular-nums backdrop-blur-sm">
                  {sv.num}
                </span>
              </div>
              <div className="flex grow flex-col p-[clamp(15px,1.5vw,20px)]">
                <h3 className="m-0 font-display text-[clamp(16px,1.35vw,19px)] leading-tight font-bold tracking-[-0.025em] text-navy">
                  {sv.title}
                </h3>
                <p className="mt-2 mb-0 text-[13.5px] leading-[1.55] text-ink/68 text-pretty">{sv.body}</p>
                <ul className="mt-3 mb-0 grid list-none gap-1.5 p-0">
                  {sv.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-[12.5px] leading-[1.45] text-ink/72">
                      <span className="mt-0.5 shrink-0">
                        <Check size={14} width={2.4} />
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>
                <a
                  href="#quote"
                  className="mt-auto flex items-center gap-2 pt-4 font-display text-[13.5px] font-bold text-orange transition-colors hover:text-orange-hover"
                >
                  Request a quote
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    <Arrow size={15} />
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── required section: About Us ──────────────────────────────────────── */

function About() {
  return (
    <section id="about" className="bg-white px-pad py-sec">
      <div className="mx-auto max-w-wrap">
        {/* header row: the heading no longer sits alone against an empty half —
            the opening statement runs beside it */}
        <div className="rvs grid gap-x-[clamp(24px,4vw,72px)] gap-y-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
              <span className={KICKER}>About us</span>
              <span className="text-[13px] text-ink/40 tabular-nums lg:hidden">04 — About us</span>
            </div>
            <h2 className={`${H2} mt-3`}>
              A New Zealand solar company, <Flame>owned and run here</Flame>.
            </h2>
          </div>
          <div>
            <div className="mb-3 hidden text-right text-[13px] text-ink/40 tabular-nums lg:block">
              04 — About us
            </div>
            <p className="m-0 text-[clamp(16px,1.4vw,19px)] leading-[1.7] text-ink/74 text-pretty">
              The Solar Co. is <Amber>100% New Zealand owned and operated</Amber>. We have designed, supplied
              and installed more than <Amber>6,000 solar systems</Amber> for homes, businesses and farms from
              Northland to Otago.
            </p>
          </div>
        </div>

        <div className="mt-[clamp(24px,3vw,48px)] grid items-start gap-[clamp(24px,3vw,48px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
          <div className="relative min-w-0">
            <div className={`${FRAME} rvs aspect-[16/9]`}>
              <div data-parallax="1" className={PARALLAX}>
                <ImageSlot
                  {...PHOTOS.crew}
                  sizes="(max-width: 1024px) 100vw, 560px"
                  alt="Technicians fitting solar panels on a roof"
                  placeholder="Drop a team or install-crew photo"
                />
              </div>
            </div>
            <div className="rvs absolute -bottom-4 left-4 flex items-center gap-2.5 rounded-xl border border-line bg-white py-2 pr-3.5 pl-2.5 shadow-card">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sun">
                <Check color="#EC5A2C" size={16} width={2.6} />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-[13px] font-bold text-navy">Our own install crews</span>
                <span className="block text-[11.5px] text-ink/55">7 hubs · 70% of NZ homes</span>
              </span>
            </div>
          </div>

          <div className="min-w-0">
            <div className="draw h-0.5 w-14 bg-orange" />
            <p className="mt-6 mb-0 text-[16px] leading-[1.7] text-ink/74 text-pretty">
              Seven solar hubs put a local team within reach of around 70% of New Zealand homes, so the people
              who design your system are the people who install it and the people who pick up the phone in year
              six.
            </p>
            <p className="mt-4 mb-0 text-[16px] leading-[1.7] text-ink/74 text-pretty">
              A system sits on your roof for decades. That is why we quote after we have seen the roof, put the
              generation estimate in writing, and back the panels with a{' '}
              <Amber>30-year performance warranty</Amber>.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#quote" className={`${BTN_CTA} h-[52px] px-6 text-[16px] shadow-cta`}>
                Book a free assessment
                <Arrow color="#fff" />
              </a>
              <a href={COMPANY.phoneHref} className={`${BTN_GHOST} h-[52px] px-5 text-[16px]`}>
                <Phone size={18} color="#EC5A2C" />
                {COMPANY.phone}
              </a>
            </div>
          </div>
        </div>

        <div
          data-stagger="1"
          className="mt-[clamp(48px,6vw,96px)] grid grid-cols-2 gap-x-6 gap-y-10 border-y border-line py-[clamp(26px,3vw,42px)] lg:grid-cols-4"
        >
          {STATS.map((st) => (
            <div key={st.label}>
              <div className="font-display text-[clamp(32px,3.6vw,52px)] leading-none font-extrabold tracking-[-0.04em] text-navy tabular-nums">
                <span data-count={st.value}>0</span>
                <span className="text-orange">{st.suffix}</span>
              </div>
              <div className="mt-2 max-w-[20ch] text-[13px] leading-[1.4] font-semibold tracking-[0.04em] text-ink/55 uppercase">
                {st.label}
              </div>
            </div>
          ))}
        </div>

        <div data-stagger="1" className="mt-[clamp(40px,5vw,72px)] grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className={`${CARD} p-[clamp(20px,2.2vw,28px)] transition-shadow duration-300 hover:shadow-card`}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sun text-orange">
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
              <h3 className="mt-6 mb-0 font-display text-[19px] leading-tight font-bold tracking-[-0.02em] text-navy">
                {v.title}
              </h3>
              <p className="mt-2.5 mb-0 text-[14.5px] leading-[1.6] text-ink/68 text-pretty">{v.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── required section: Testimonials ──────────────────────────────────── */

function Testimonials() {
  return (
    <section id="testimonials" className="bg-grey px-pad py-sec">
      <div className="mx-auto max-w-wrap">
        <SectionHead kicker="Testimonials" index="06 — Testimonials">
          What our <Flame>customers</Flame> say.
        </SectionHead>

        <div className="mt-[clamp(28px,3vw,44px)] flex flex-wrap items-center gap-x-8 gap-y-4 rounded-3xl border border-line bg-white px-[clamp(20px,2.4vw,32px)] py-5">
          <div className="flex items-center gap-3">
            <div className="flex gap-1" aria-label="Rated five stars">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={20} />
              ))}
            </div>
            <span className="font-display text-[19px] font-extrabold text-navy tabular-nums">[X.X]</span>
          </div>
          <span className="text-[14.5px] text-ink/65">
            from <strong className="font-semibold text-navy">[NN]</strong> verified reviews across Google and
            Facebook
          </span>
          <a href="#quote" className="ml-auto font-display text-[14.5px] font-bold text-orange hover:text-orange-hover">
            Join them — get a free quote →
          </a>
        </div>

        <div data-stagger="1" className="mt-6 grid gap-5 lg:grid-cols-3">
          {TESTIMONIAL_SLOTS.map((t, i) => (
            <figure key={i} className={`${CARD} m-0 flex flex-col p-[clamp(20px,2.2vw,30px)]`}>
              <div className="flex gap-1" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star key={s} />
                ))}
              </div>
              <blockquote className="m-0 mt-5 grow text-[16px] leading-[1.65] text-ink/72 text-pretty">
                “[Customer review — supplied by The Solar Co. from their Google or Facebook reviews. Nothing in
                this section is written for them.]”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3.5 border-t border-line pt-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sun font-display text-[15px] font-bold text-orange">
                  [ ]
                </span>
                <span className="leading-tight">
                  <span className="block font-display text-[15px] font-bold text-navy">[Customer name]</span>
                  <span className="block text-[13px] text-ink/55">
                    {t.location} · {t.system}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-4 mb-0 text-[13px] leading-[1.6] text-ink/50">
          Review slots are left empty on purpose. Send us your real Google and Facebook reviews and they drop
          straight in — we will not write customer quotes on your behalf.
        </p>
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

  const tile = 'rounded-2xl border border-line bg-white p-4'
  const tileLabel = 'text-[11.5px] font-semibold tracking-[0.08em] text-ink/50 uppercase'
  const tileValue =
    'mt-1.5 font-display text-[clamp(24px,2.4vw,32px)] leading-none font-extrabold tracking-[-0.03em] text-navy tabular-nums'
  const tileSub = 'mt-2 text-[12px] text-ink/50'

  return (
    <section id="estimate" className="bg-sky px-pad py-sec">
      <div className="mx-auto max-w-wrap">
        <SectionHead kicker="Savings estimator" index="07 — Estimate">
          What could solar do on <Flame>your roof</Flame>?
        </SectionHead>

        <div className="rvs mt-[clamp(28px,3.5vw,48px)] grid gap-[clamp(20px,2.5vw,40px)] rounded-[28px] border border-line bg-white p-[clamp(20px,2.6vw,40px)] shadow-frame lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <div className="text-[12.5px] font-semibold tracking-[0.1em] text-ink/55 uppercase">
              Your average monthly power bill
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <strong className="font-display text-[clamp(44px,4.6vw,66px)] leading-none font-extrabold tracking-[-0.04em] text-navy tabular-nums">
                ${bill}
              </strong>
              <span className="text-[15px] text-ink/55">per month</span>
            </div>
            <input
              type="range"
              min="80"
              max="600"
              step="10"
              value={bill}
              onChange={(e) => onBill(Number(e.target.value))}
              aria-label="Average monthly power bill"
              className="mt-6 h-8 w-full cursor-pointer accent-orange"
            />
            <div className="mt-1 flex justify-between text-[12px] text-ink/45 tabular-nums">
              <span>$80</span>
              <span>$600</span>
            </div>
            <p className="mt-5 mb-0 max-w-[42ch] text-[14px] leading-[1.6] text-ink/60 text-pretty">
              Indicative and rounded, based on 34c per kWh, {yieldPerKw} kWh per kW each year and {offsetPct}% of
              your usage offset by solar and storage. <Amber>A real design</Amber> uses your own usage profile,
              roof and tariff.
            </p>
            <a href="#quote" className={`${BTN_CTA} mt-6 h-[52px] px-6 text-[16px] shadow-cta`}>
              Get an exact quote
              <Arrow color="#fff" />
            </a>
          </div>

          <div className="grid content-start gap-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className={tile}>
                <div className={tileLabel}>System size</div>
                <div className={tileValue}>
                  <AnimatedNumber value={sizeKw} format={fmtKw} />
                </div>
                <div className={tileSub}>sized to your usage</div>
              </div>
              <div className={tile}>
                <div className={tileLabel}>Annual saving</div>
                <div className={`${tileValue} text-orange`}>
                  <AnimatedNumber value={saving} format={fmtMoney} />
                </div>
                <div className={tileSub}>at today&apos;s tariff</div>
              </div>
              <div className={tile}>
                <div className={tileLabel}>Payback</div>
                <div className={tileValue}>
                  <AnimatedNumber value={payback} format={fmtYears} />
                </div>
                <div className={tileSub}>simple, before incentives</div>
              </div>
            </div>

            <div className={tile}>
              <div className="flex items-center justify-between gap-4 text-[13px]">
                <span className="font-semibold text-navy">Where your power comes from</span>
                <span className="text-ink/55 tabular-nums">{offsetPct}% solar</span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-grey">
                <div
                  className="h-full rounded-full bg-orange transition-[width] duration-500"
                  style={{ width: `${offsetPct}%` }}
                />
              </div>
              <div className="mt-2.5 flex gap-5 text-[12px] text-ink/55">
                <span className="flex items-center gap-1.5">
                  <i className="inline-block h-2 w-2 rounded-full bg-orange" />
                  Solar {offsetPct}%
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="inline-block h-2 w-2 rounded-full bg-line" />
                  Grid {100 - offsetPct}%
                </span>
              </div>
            </div>

            <div className={tile}>
              <div className="flex items-baseline justify-between gap-4 text-[13px]">
                <span className="font-semibold text-navy">Estimated generation through the year</span>
                <span className="text-ink/55 tabular-nums">
                  <AnimatedNumber value={annualGen} format={fmtKwh} />
                </span>
              </div>
              <div className="mt-3 flex h-[64px] items-end gap-1.5" aria-hidden="true">
                {SEASON.map((wgt, i) => (
                  <div
                    key={MONTHS[i] + i}
                    className="flex-1 rounded-t-md bg-gold transition-[height,opacity] duration-500"
                    style={{
                      height: `${(wgt / SEASON_MAX) * growth * 100}%`,
                      opacity: 0.55 + 0.45 * (wgt / SEASON_MAX),
                    }}
                  />
                ))}
              </div>
              <div className="mt-1.5 flex gap-1.5 text-[11px] text-ink/45" aria-hidden="true">
                {MONTHS.map((m, i) => (
                  <span key={m + i} className="flex-1 text-center">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Checklist() {
  return (
    <section className="bg-white px-pad py-sec">
      <div className="mx-auto grid max-w-wrap gap-[clamp(24px,3vw,56px)] lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
        <div>
          <SectionHead kicker="Before you sign anything" index="05 — Checklist">
            Ten questions to ask <Flame>any</Flame> solar installer.
          </SectionHead>
          <p className={LEAD}>
            Take it to every quote you get, ours included. A system sits on your roof for thirty years, so the
            company behind it matters as much as the panels. A good installer answers all ten without
            hesitating.
          </p>
          <a href="#quote" className={`${BTN_CTA} mt-7 h-[52px] px-6 text-[16px] shadow-cta`}>
            Put us to the test
            <Arrow color="#fff" />
          </a>
        </div>

        {/* deliberately unlike the FAQ below: a tick-list to run down, not
            question cards to open */}
        <ol
          data-stagger="1"
          className="m-0 grid list-none gap-x-8 gap-y-0 rounded-3xl border border-gold-soft bg-sun p-[clamp(18px,2.2vw,30px)] sm:grid-cols-2"
        >
          {CHECKLIST.map((item, i) => (
            <li
              key={item}
              className="flex items-start gap-3 border-b border-orange/12 py-3 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0"
            >
              <span
                aria-hidden="true"
                className="mt-px grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border-[1.5px] border-orange/45 bg-white"
              >
                <Check color="#EC5A2C" size={12} width={3} />
              </span>
              <span className="text-[14px] leading-[1.5] text-navy text-pretty">{item}</span>
              <span className="ml-auto pl-2 font-display text-[11.5px] font-bold text-orange/40 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="bg-grey px-pad py-sec">
      <div className="mx-auto max-w-wrap">
        <SectionHead kicker="Questions" index="08 — FAQ">
          Solar, <Flame>answered</Flame>.
        </SectionHead>

        <div className="mt-[clamp(28px,3.5vw,52px)] grid gap-3 lg:grid-cols-2 lg:items-start">
          <div className="grid gap-3">
            {FAQS.filter((_, i) => i % 2 === 0).map((f) => (
              <FaqItem key={f.q} item={f} open={open === f.q} onToggle={() => setOpen(open === f.q ? null : f.q)} />
            ))}
          </div>
          <div className="grid gap-3">
            {FAQS.filter((_, i) => i % 2 === 1).map((f) => (
              <FaqItem key={f.q} item={f} open={open === f.q} onToggle={() => setOpen(open === f.q ? null : f.q)} />
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4 rounded-3xl border border-gold-soft bg-sun px-[clamp(20px,2.4vw,32px)] py-5">
          <p className="m-0 text-[15.5px] leading-[1.6] text-ink/75">
            Still have a question? Talk to a solar designer, not a call centre.
          </p>
          <a href={COMPANY.phoneHref} className={`${BTN_CTA} ml-auto h-[50px] px-6 text-[15px] shadow-cta`}>
            <Phone size={18} color="#fff" />
            {COMPANY.phone}
          </a>
        </div>
      </div>
    </section>
  )
}

function FaqItem({ item, open, onToggle }) {
  return (
    <div className={`${CARD} overflow-hidden`}>
      <h3 className="m-0">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex w-full cursor-pointer items-start justify-between gap-4 border-0 bg-transparent p-[clamp(16px,1.8vw,22px)] text-left font-display text-[16px] leading-[1.45] font-bold text-navy transition-colors hover:text-orange"
        >
          {item.q}
          <span
            aria-hidden="true"
            className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sun text-orange transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
        </button>
      </h3>
      {open && (
        <p className="m-0 px-[clamp(16px,1.8vw,22px)] pb-[clamp(16px,1.8vw,22px)] text-[14.5px] leading-[1.7] text-ink/70 text-pretty animate-[revealSoft_240ms_ease_both]">
          {item.a}
        </p>
      )}
    </div>
  )
}

/* ── lead capture: full consultation form ────────────────────────────── */

function Quote({ sent, onSent, fields, onFields, bill }) {
  const [property, setProperty] = useState(null)
  const [band, setBand] = useState(null)
  const formRef = useRef(null)

  const suggestedBand = useMemo(() => {
    if (bill < 150) return BILL_BANDS[0]
    if (bill < 250) return BILL_BANDS[1]
    if (bill < 400) return BILL_BANDS[2]
    return BILL_BANDS[3]
  }, [bill])

  const set = (k) => (e) => onFields((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    onSent(true)
  }
  const reset = () => {
    onSent(false)
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const aside = 'flex items-start gap-3.5 text-[15px] leading-[1.55] text-ink/75'

  return (
    <section id="quote" className="bg-white px-pad py-sec">
      <div className="mx-auto grid max-w-wrap items-start gap-[clamp(32px,4vw,64px)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div>
          <div className={KICKER}>Free quote</div>
          <h2 className={`${H2} rv mt-4`}>
            Book your free solar <Flame>assessment</Flame>.
          </h2>
          <p className={LEAD}>
            Tell us about your property and a solar designer will call you back to arrange a site visit. No cost,
            no obligation, and a written estimate before you decide anything.
          </p>

          <div className="mt-9 grid gap-4 border-t border-line pt-8">
            <div className={aside}>
              <Check />
              Free on-site roof assessment and sun mapping
            </div>
            <div className={aside}>
              <Check />
              Itemised, written quote with generation estimates
            </div>
            <div className={aside}>
              <Check />A designer replies within one working day
            </div>
            <div className={aside}>
              <Check />
              Your details are used only for this quote
            </div>
          </div>

          <div className="mt-9 grid gap-4 rounded-3xl border border-line bg-grey p-[clamp(20px,2.2vw,28px)]">
            <a href={COMPANY.phoneHref} className="flex items-center gap-3.5 font-display text-[19px] font-extrabold text-navy hover:text-orange">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white">
                <Phone size={17} color="#EC5A2C" />
              </span>
              {COMPANY.phone}
            </a>
            <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-3.5 text-[15px] text-ink/75 hover:text-orange">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white">
                <Mail size={18} color="#3D5171" />
              </span>
              {COMPANY.email}
            </a>
            <div className="flex items-start gap-3.5 text-[15px] leading-[1.55] text-ink/75">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white">
                <Pin size={18} color="#3D5171" />
              </span>
              <span>
                {COMPANY.street}, {COMPANY.suburb}
                <br />
                {COMPANY.city}
                <br />
                <span className="text-ink/55">{COMPANY.hours}</span>
              </span>
            </div>
          </div>
        </div>

        <form
          ref={formRef}
          onSubmit={submit}
          className="rvs rounded-[28px] border border-line bg-white p-[clamp(22px,2.8vw,40px)] shadow-form"
        >
          {!sent ? (
            <>
              <h3 className="m-0 font-display text-[clamp(21px,2.2vw,27px)] leading-tight font-extrabold tracking-[-0.03em] text-navy">
                Request your free quote
              </h3>
              <p className="mt-2 mb-7 text-[14.5px] leading-[1.55] text-ink/62">
                Fields marked with an asterisk are required.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={FIELD_LABEL}>Full name *</span>
                  <input
                    required
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder="Jane Smith"
                    value={fields.name}
                    onChange={set('name')}
                    className={INPUT}
                  />
                </label>
                <label className="block">
                  <span className={FIELD_LABEL}>Phone *</span>
                  <input
                    required
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    placeholder="021 123 4567"
                    value={fields.phone}
                    onChange={set('phone')}
                    className={INPUT}
                  />
                </label>
                <label className="block">
                  <span className={FIELD_LABEL}>Email *</span>
                  <input
                    required
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@email.co.nz"
                    value={fields.email}
                    onChange={set('email')}
                    className={INPUT}
                  />
                </label>
                <label className="block">
                  <span className={FIELD_LABEL}>Suburb or town *</span>
                  <input
                    required
                    type="text"
                    name="suburb"
                    autoComplete="address-level2"
                    placeholder="Mt Eden, Auckland"
                    value={fields.suburb}
                    onChange={set('suburb')}
                    className={INPUT}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className={FIELD_LABEL}>Street address of the property</span>
                  <input
                    type="text"
                    name="address"
                    autoComplete="street-address"
                    placeholder="So we can check the roof before we visit"
                    value={fields.address}
                    onChange={set('address')}
                    className={INPUT}
                  />
                </label>
              </div>

              <fieldset className="mt-7 border-0 p-0">
                <legend className={`${FIELD_LABEL} p-0`}>Property type *</legend>
                <div className="mt-3 flex flex-wrap gap-2">
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
                          className={`grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full border ${on ? 'border-orange' : 'border-line'}`}
                        >
                          <i className={`h-2 w-2 rounded-full ${on ? 'bg-orange' : 'bg-transparent'}`} />
                        </span>
                        {label}
                      </label>
                    )
                  })}
                </div>
              </fieldset>

              <fieldset className="mt-6 border-0 p-0">
                <legend className={`${FIELD_LABEL} p-0`}>Average monthly power bill</legend>
                <div className="mt-3 flex flex-wrap gap-2">
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
                {!band && (
                  <p className="mt-2.5 mb-0 text-[13px] text-ink/55">
                    From the estimator above, yours looks like {suggestedBand}.
                  </p>
                )}
              </fieldset>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className={FIELD_LABEL}>Roof type</span>
                  <select name="roof" value={fields.roof} onChange={set('roof')} className={SELECT}>
                    {ROOF_TYPES.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className={FIELD_LABEL}>Timeframe</span>
                  <select name="timeframe" value={fields.timeframe} onChange={set('timeframe')} className={SELECT}>
                    {TIMEFRAMES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className={FIELD_LABEL}>Best time to call</span>
                  <select name="contactTime" value={fields.contactTime} onChange={set('contactTime')} className={SELECT}>
                    {CONTACT_TIMES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="mt-6 block">
                <span className={FIELD_LABEL}>
                  Anything else? <span className="font-normal text-ink/50">(optional)</span>
                </span>
                <textarea
                  name="message"
                  rows="3"
                  placeholder="Shading, an EV on the way, a planned re-roof, a battery you already own…"
                  value={fields.message}
                  onChange={set('message')}
                  className={`${INPUT} h-auto resize-y px-4 py-3.5 leading-[1.55]`}
                />
              </label>

              <label className="mt-6 flex items-start gap-3 text-[13.5px] leading-[1.55] text-ink/65">
                <input
                  required
                  type="checkbox"
                  name="consent"
                  className="mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer accent-orange"
                />
                <span>
                  I am happy for {COMPANY.name} to contact me about this quote. We never sell or share your
                  details. *
                </span>
              </label>

              <button type="submit" className={`${BTN_CTA} mt-7 h-[58px] w-full text-[17px] shadow-cta`}>
                Request My Free Quote
                <Arrow color="#fff" />
              </button>
              <p className="mt-3 mb-0 text-center text-[13px] text-ink/55">
                Prefer to talk? Call{' '}
                <a href={COMPANY.phoneHref} className="font-semibold text-orange hover:text-orange-hover">
                  {COMPANY.phone}
                </a>{' '}
                — {COMPANY.hours}.
              </p>
            </>
          ) : (
            <div className="px-2 py-12 text-center animate-[rise_340ms_ease_both]">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sun">
                <Check color="#EC5A2C" size={30} width={2.4} />
              </div>
              <h3 className="mt-6 mb-0 font-display text-[26px] font-extrabold tracking-[-0.03em] text-navy">
                Request received
              </h3>
              <p className="mx-auto mt-3 mb-0 max-w-[38ch] text-[15px] leading-[1.7] text-ink/68">
                A solar designer will call you within one working day to talk through your roof and arrange the
                free assessment. If it is urgent, call{' '}
                <a href={COMPANY.phoneHref} className="font-semibold text-orange">
                  {COMPANY.phone}
                </a>
                .
              </p>
              <button type="button" onClick={reset} className={`${BTN_GHOST} mt-8 h-12 px-6 text-[15px]`}>
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
    <footer className="border-t border-line bg-grey px-pad pt-[clamp(48px,6vw,88px)] pb-10">
      <div className="mx-auto max-w-wrap">
        <div className="flex flex-wrap justify-between gap-[clamp(28px,5vw,72px)]">
          <div className="max-w-[340px] grow basis-[280px]">
            <Logo className="block h-auto w-[148px]" />
            <p className="mt-5 mb-0 text-[15px] leading-[1.7] text-ink/66 text-pretty">
              100% New Zealand owned and operated. Solar design, supply and installation for homes, businesses
              and farms — 6,000 systems and counting.
            </p>
            <a href="#quote" onClick={go('quote')} className={`${BTN_CTA} mt-6 h-[48px] px-5 text-[15px]`}>
              Get a Free Quote
              <Arrow color="#fff" />
            </a>
          </div>

          <div className="shrink basis-[160px]">
            <h4 className={heading}>Pages</h4>
            <div className={links}>
              {NAV.map((n) => (
                <a key={n.label} href={n.id ? `#${n.id}` : '#home'} onClick={go(n.id)}>
                  {n.label}
                </a>
              ))}
              <a href="#quote" onClick={go('quote')}>
                Contact
              </a>
            </div>
          </div>

          <div className="shrink basis-[190px]">
            <h4 className={heading}>Services</h4>
            <div className={links}>
              {SERVICES.slice(0, 5).map((s) => (
                <a key={s.title} href="#services" onClick={go('services')}>
                  {s.title}
                </a>
              ))}
            </div>
          </div>

          <div className="shrink basis-[230px]">
            <h4 className={heading}>Contact</h4>
            <div className={links}>
              <a href={COMPANY.phoneHref} className="font-display text-[17px] font-bold text-navy hover:text-orange">
                {COMPANY.phone}
              </a>
              <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
              <div className="leading-[1.7]">
                {COMPANY.street}
                <br />
                {COMPANY.suburb}
                <br />
                {COMPANY.city}
              </div>
              <div className="text-ink/50">{COMPANY.hours}</div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap justify-between gap-4 border-t border-line pt-6 text-[13px] text-ink/50">
          <div>© {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</div>
          <div className="flex gap-5">
            <a href="#" className="text-ink/50 hover:text-orange">
              Privacy
            </a>
            <a href="#" className="text-ink/50 hover:text-orange">
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
      <div className="h-[calc(84px+env(safe-area-inset-bottom))] bg-white" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-[18] flex items-center gap-2.5 border-t border-line bg-white/96 px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] shadow-bar backdrop-blur-xl">
        <a
          href={COMPANY.phoneHref}
          aria-label={`Call ${COMPANY.phone}`}
          className="flex h-[52px] shrink-0 items-center gap-2 rounded-full border border-line bg-white px-4 font-display text-[15px] font-bold text-navy transition-colors hover:bg-grey"
        >
          <Phone size={18} color="#EC5A2C" />
          Call
        </a>
        <a href="#quote" className={`${BTN_CTA} h-[52px] grow text-[16px]`}>
          Get a Free Quote
          <Arrow color="#fff" />
        </a>
      </div>
    </>
  )
}
