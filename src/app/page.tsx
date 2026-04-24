'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type GalleryCategory = 'vse' | 'tricka' | 'mikiny' | 'firemni' | 'deti'

interface GalleryItem {
  id: number
  category: Exclude<GalleryCategory, 'vse'>
  label: string
  seed: string
  color: string
}

interface Review {
  id: number
  text: string
  author: string
  org: string
}

type FormField = 'name' | 'email' | 'phone' | 'productType' | 'quantity' | 'message'
type FormData = Record<FormField, string>
type FormErrors = Partial<Record<FormField, string>>

// ─── Data ─────────────────────────────────────────────────────────────────────

const galleryItems: GalleryItem[] = [
  { id: 1, category: 'tricka', label: 'Barevné tričko s potiskem', seed: 'tshirt01', color: '#E8602A' },
  { id: 2, category: 'tricka', label: 'Vlastní design — tričko', seed: 'tshirt02', color: '#F4A261' },
  { id: 3, category: 'mikiny', label: 'Mikina s logem', seed: 'hoodie01', color: '#2D6A4F' },
  { id: 4, category: 'mikiny', label: 'Zip mikina — spolkový merch', seed: 'hoodie02', color: '#1E3A5F' },
  { id: 5, category: 'firemni', label: 'Firemní polokošile', seed: 'corp01', color: '#3D405B' },
  { id: 6, category: 'firemni', label: 'Firemní trička — série 50 ks', seed: 'corp02', color: '#6B4226' },
  { id: 7, category: 'deti', label: 'Dětská trička — školní třída', seed: 'kids01', color: '#D62828' },
  { id: 8, category: 'deti', label: 'Rodinný set — trička', seed: 'kids02', color: '#7209B7' },
]

const reviews: Review[] = [
  {
    id: 1,
    text: 'Objednali jsme trička pro celou třídu a jsme nadšeni! Rychlé vyřízení, skvělý tisk a milé jednání. Děti jsou přišílené z výsledku.',
    author: 'Petra N.',
    org: '3.B ZŠ Výletní, Praha',
  },
  {
    id: 2,
    text: 'Náš hasičský spolek dostal nové dresy — vypadají parádně a vydržely i první sezonu. Určitě se vrátíme na další sérii.',
    author: 'Jiří K.',
    org: 'SDH Dolní Věstonice',
  },
  {
    id: 3,
    text: 'Jako malý startup jsme chtěli originální merch pro konferenci. FajnTriko nám pomohlo s designem i tiskem — výsledek předčil očekávání.',
    author: 'Martin V.',
    org: 'Zakladatel startupu',
  },
  {
    id: 4,
    text: 'Dárkové tričko pro celou rodinu — každé originální! Skvělá komunikace, dodání do druhého dne. Vřele doporučuju.',
    author: 'Lucie B.',
    org: 'Spokojená zákaznice',
  },
]

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useFadeIn<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return { ref, visible }
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function FadeIn({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const { ref, visible } = useFadeIn<HTMLDivElement>()
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  )
}

function Stars({ count = 5 }: { count?: number }) {
  return (
    <span aria-label={`${count} z 5 hvězd`}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-brand-orange text-lg">
          ★
        </span>
      ))}
    </span>
  )
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const IconShirt = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
    <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z" />
  </svg>
)

const IconHoodie = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
    <path d="M3 9l3-7h3a3 3 0 006 0h3l3 7-3 1v11H6V10L3 9z" />
    <path d="M9 2c0 2 1.5 3 3 3s3-1 3-3" />
  </svg>
)

const IconBriefcase = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 12v4M10 14h4" />
  </svg>
)

const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
)

const IconBox = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
)

const IconPencil = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
)

const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 11a19.79 19.79 0 01-3.07-8.67A2 2 0 013.6 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 7.91a16 16 0 006.29 6.29l.91-.91a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
)

const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

const IconMenu = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const IconInstagram = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
)

const IconFacebook = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
)

// ─── Nav ─────────────────────────────────────────────────────────────────────

const navLinks = [
  { label: 'Co nabízíme', href: 'sluzby' },
  { label: 'Jak fungujeme', href: 'jak-to-funguje' },
  { label: 'Galerie', href: 'galerie' },
  { label: 'Ceník', href: 'cenik' },
  { label: 'Kontakt', href: 'kontakt' },
]

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-brand-cream/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container-pad flex items-center justify-between h-16 md:h-18">
        <button
          onClick={() => scrollTo('hero')}
          className="font-display font-800 text-xl text-brand-dark hover:text-brand-orange transition-colors"
        >
          FajnTriko<span className="text-brand-orange">.cz</span>
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-sm font-body font-600 text-brand-muted hover:text-brand-orange transition-colors"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo('kontakt')}
            className="btn-primary text-sm py-2.5 px-5"
          >
            Objednat
          </button>
        </nav>

        <button
          className="md:hidden p-2 text-brand-dark"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
        >
          {menuOpen ? <IconClose /> : <IconMenu />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-brand-cream/98 backdrop-blur-sm border-t border-brand-border px-4 pb-6 pt-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-left text-base font-body font-600 text-brand-dark hover:text-brand-orange transition-colors py-1"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo('kontakt')}
            className="btn-primary w-full justify-center mt-2"
          >
            Chci svůj potisk
          </button>
        </div>
      )}
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center fabric-texture bg-brand-cream overflow-hidden"
    >
      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-32 w-80 h-80 bg-brand-orange-soft/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-brand-orange/8 rounded-full blur-2xl pointer-events-none" />

      {/* Floating color swatches */}
      <div className="absolute top-28 right-8 md:right-24 flex flex-col gap-3 pointer-events-none hidden sm:flex">
        {['#E8602A', '#F4A261', '#2D6A4F', '#1E3A5F', '#7209B7', '#D62828'].map((color, i) => (
          <div
            key={color}
            className="w-10 h-10 rounded-xl shadow-md opacity-80"
            style={{
              backgroundColor: color,
              transform: `rotate(${i % 2 === 0 ? '6deg' : '-4deg'})`,
            }}
          />
        ))}
      </div>

      <div className="container-pad relative z-10 pt-24 pb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-brand-orange/10 text-brand-orange rounded-full px-4 py-1.5 text-sm font-600 mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-brand-orange inline-block" />
            Praha &amp; okolí · Rychlé dodání
          </div>

          <h1 className="font-display font-800 text-5xl sm:text-6xl md:text-7xl leading-[1.05] text-brand-dark mb-6 uppercase">
            Trička,{' '}
            <span className="relative inline-block">
              která
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-brand-orange/20 -rotate-1 -z-10 rounded" />
            </span>{' '}
            <br />
            <span className="text-brand-orange">vyprávějí</span>
            <br />
            tvůj příběh.
          </h1>

          <p className="text-lg md:text-xl text-brand-muted leading-relaxed mb-10 max-w-xl">
            Potiskujeme trička, mikiny a merch pro jednotlivce, rodiny, třídy i firmy.
            Rychle, kvalitně, s osobním přístupem.
          </p>

          <div className="flex flex-wrap gap-4">
            <button onClick={() => scrollTo('kontakt')} className="btn-primary text-base">
              Chci svůj potisk <IconArrow />
            </button>
            <button onClick={() => scrollTo('sluzby')} className="btn-outline text-base">
              Co nabízíme
            </button>
          </div>

          <div className="mt-12 flex flex-wrap gap-6 text-sm text-brand-muted">
            {['DTF & sublimační tisk', 'Maloodběr od 1 ks', 'Pomoc s designem', 'Náhled před tiskem'].map(
              (item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <span className="text-brand-orange font-700">✓</span> {item}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Services ─────────────────────────────────────────────────────────────────

const services = [
  {
    icon: <IconShirt />,
    title: 'Potisk triček',
    desc: 'DTF a sublimační tisk na bavlněná i syntetická trička. Plnobarevné motivy, foto, loga — bez limitu barev.',
  },
  {
    icon: <IconHoodie />,
    title: 'Mikiny a merch',
    desc: 'Zip mikiny, klasické mikiny, čepice. Ideální pro spolkový nebo firemní merch s dlouhou životností.',
  },
  {
    icon: <IconBriefcase />,
    title: 'Firemní oblečení',
    desc: 'Polokošile, trička a mikiny s logem vaší firmy. Jednotný vizuál, profesionální dojem.',
  },
  {
    icon: <IconUsers />,
    title: 'Třídy & spolky',
    desc: 'Třídní trička, sportovní dresy, spolkové uniformy. Skupinové objednávky vyřídíme rychle a bez stresu.',
  },
  {
    icon: <IconBox />,
    title: 'Maloodběr i série',
    desc: 'Klidně 1 kus jako dárek, nebo 500 ks pro celou firmu. Množstevní slevy od 5 kusů.',
  },
  {
    icon: <IconPencil />,
    title: 'Váš návrh nebo náš',
    desc: 'Máte vlastní grafiku? Super. Nemáte? Pomůžeme s designem — od nápadu po hotový soubor pro tisk.',
  },
]

function Services() {
  return (
    <section id="sluzby" className="section-pad bg-brand-dark">
      <div className="container-pad">
        <FadeIn>
          <div className="text-center mb-14">
            <span className="text-brand-orange font-600 text-sm uppercase tracking-widest">
              Naše služby
            </span>
            <h2 className="font-display font-800 text-4xl md:text-5xl text-white mt-3">
              Co nabízíme
            </h2>
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <FadeIn key={s.title} delay={i * 80}>
              <div className="group bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-brand-orange/10 hover:border-brand-orange/30 transition-all duration-300 hover:-translate-y-1">
                <div className="text-brand-orange mb-4">{s.icon}</div>
                <h3 className="font-display font-700 text-white text-xl mb-2">{s.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── How it works ─────────────────────────────────────────────────────────────

const steps = [
  {
    num: '01',
    title: 'Pošli návrh',
    desc: 'Sdílej svůj motiv, logo nebo myšlenku. Nemáš grafiku? Pomůžeme s designem od základu.',
  },
  {
    num: '02',
    title: 'Schválíš náhled',
    desc: 'Před zahájením tisku dostaneš digitální náhled — jak bude potisk vypadat na reálném produktu.',
  },
  {
    num: '03',
    title: 'Doručíme',
    desc: 'Hotové kusy předáme osobně (Praha a okolí) nebo zašleme zásilkovnou. Rychle a bezpečně.',
  },
]

function HowItWorks() {
  return (
    <section id="jak-to-funguje" className="section-pad bg-white fabric-texture">
      <div className="container-pad">
        <FadeIn>
          <div className="text-center mb-14">
            <span className="text-brand-orange font-600 text-sm uppercase tracking-widest">
              Proces
            </span>
            <h2 className="font-display font-800 text-4xl md:text-5xl text-brand-dark mt-3">
              Jak to funguje
            </h2>
            <p className="text-brand-muted mt-3 max-w-md mx-auto">
              Od nápadu po hotový potisk ve třech jednoduchých krocích.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-brand-border" />

          {steps.map((step, i) => (
            <FadeIn key={step.num} delay={i * 120}>
              <div className="text-center relative">
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-orange text-white font-display font-800 text-2xl mb-6 shadow-lg shadow-brand-orange/30">
                  {step.num}
                </div>
                <h3 className="font-display font-700 text-2xl text-brand-dark mb-3">{step.title}</h3>
                <p className="text-brand-muted leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Gallery ─────────────────────────────────────────────────────────────────

const categoryLabels: Record<GalleryCategory, string> = {
  vse: 'Vše',
  tricka: 'Trička',
  mikiny: 'Mikiny',
  firemni: 'Firemní',
  deti: 'Pro děti',
}

function Gallery() {
  const [active, setActive] = useState<GalleryCategory>('vse')

  const visible =
    active === 'vse' ? galleryItems : galleryItems.filter((g) => g.category === active)

  return (
    <section id="galerie" className="section-pad bg-brand-cream">
      <div className="container-pad">
        <FadeIn>
          <div className="text-center mb-10">
            <span className="text-brand-orange font-600 text-sm uppercase tracking-widest">
              Ukázky
            </span>
            <h2 className="font-display font-800 text-4xl md:text-5xl text-brand-dark mt-3">
              Naše práce
            </h2>
          </div>
        </FadeIn>

        {/* Filter pills */}
        <FadeIn delay={100}>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {(Object.keys(categoryLabels) as GalleryCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-5 py-2 rounded-full text-sm font-600 transition-all duration-200 ${
                  active === cat
                    ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/30'
                    : 'bg-white text-brand-muted border border-brand-border hover:border-brand-orange hover:text-brand-orange'
                }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {visible.map((item, i) => (
            <FadeIn key={item.id} delay={i * 60}>
              <div className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Colored placeholder */}
                <div
                  className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundColor: item.color }}
                >
                  {/* Placeholder pattern */}
                  <div className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `radial-gradient(circle at 30% 40%, rgba(255,255,255,0.4) 0%, transparent 60%),
                                        radial-gradient(circle at 70% 70%, rgba(0,0,0,0.2) 0%, transparent 50%)`,
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <IconShirt />
                    <span className="text-xs mt-2 font-600 opacity-70">FOTO BRZY</span>
                  </div>
                </div>
                {/* Overlay label */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white font-display font-600 text-sm">{item.label}</span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

const pricingTiers = [
  {
    id: 1,
    name: 'Tričko',
    price: 'od 249 Kč',
    unit: 'za kus',
    features: [
      'Jednostranný potisk',
      'DTF nebo sublimace',
      'Plnobarevný motiv',
      'Maloodběr od 1 ks',
    ],
    highlight: false,
  },
  {
    id: 2,
    name: 'Mikina',
    price: 'od 599 Kč',
    unit: 'za kus',
    features: [
      'Potisk přední/zadní',
      'Zip i klasická mikina',
      'Více velikostí',
      'Vhodná jako merch',
    ],
    highlight: true,
  },
  {
    id: 3,
    name: 'Série 20+ ks',
    price: 'Dohodou',
    unit: 'množstevní sleva',
    features: [
      'Sleva 15 % (20+ ks)',
      'Sleva 25 % (50+ ks)',
      'Firemní faktura',
      'Prioritní zpracování',
    ],
    highlight: false,
  },
]

function Pricing() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="cenik" className="section-pad bg-white">
      <div className="container-pad">
        <FadeIn>
          <div className="text-center mb-14">
            <span className="text-brand-orange font-600 text-sm uppercase tracking-widest">
              Ceník
            </span>
            <h2 className="font-display font-800 text-4xl md:text-5xl text-brand-dark mt-3">
              Orientační ceny
            </h2>
            <p className="text-brand-muted mt-3 max-w-md mx-auto">
              Přesnou cenu spočítám po dohodě dle počtu kusů, složitosti designu a typu materiálu.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingTiers.map((tier, i) => (
            <FadeIn key={tier.id} delay={i * 100}>
              <div
                className={`rounded-2xl p-8 border-2 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 ${
                  tier.highlight
                    ? 'bg-brand-orange border-brand-orange text-white shadow-xl shadow-brand-orange/25'
                    : 'bg-white border-brand-border hover:border-brand-orange/40'
                }`}
              >
                {tier.highlight && (
                  <div className="text-xs font-700 uppercase tracking-widest text-white/80 mb-3">
                    Nejoblíbenější
                  </div>
                )}
                <h3
                  className={`font-display font-800 text-2xl mb-1 ${
                    tier.highlight ? 'text-white' : 'text-brand-dark'
                  }`}
                >
                  {tier.name}
                </h3>
                <div className="mb-6">
                  <span
                    className={`font-display font-800 text-4xl ${
                      tier.highlight ? 'text-white' : 'text-brand-orange'
                    }`}
                  >
                    {tier.price}
                  </span>
                  <span
                    className={`text-sm ml-2 ${
                      tier.highlight ? 'text-white/70' : 'text-brand-muted'
                    }`}
                  >
                    {tier.unit}
                  </span>
                </div>
                <ul className="space-y-3 flex-grow mb-8">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className={`flex items-center gap-2 text-sm ${
                        tier.highlight ? 'text-white/90' : 'text-brand-muted'
                      }`}
                    >
                      <span
                        className={`font-700 text-base ${
                          tier.highlight ? 'text-white' : 'text-brand-orange'
                        }`}
                      >
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => scrollTo('kontakt')}
                  className={`w-full py-3 rounded-full font-display font-700 text-sm transition-all duration-200 ${
                    tier.highlight
                      ? 'bg-white text-brand-orange hover:bg-brand-cream'
                      : 'bg-brand-orange text-white hover:bg-orange-600 shadow-md shadow-brand-orange/20'
                  }`}
                >
                  Nezávazná poptávka
                </button>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Quantity discount banner */}
        <FadeIn delay={300}>
          <div className="mt-10 max-w-3xl mx-auto bg-brand-cream rounded-2xl p-6 flex flex-wrap gap-6 justify-around text-center">
            {[
              { label: '5+ ks', value: 'sleva 5 %' },
              { label: '20+ ks', value: 'sleva 15 %' },
              { label: '50+ ks', value: 'sleva 25 %' },
            ].map((d) => (
              <div key={d.label}>
                <div className="font-display font-800 text-2xl text-brand-orange">{d.value}</div>
                <div className="text-brand-muted text-sm mt-0.5">{d.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

function Reviews() {
  return (
    <section id="reference" className="section-pad bg-brand-dark fabric-texture">
      <div className="container-pad">
        <FadeIn>
          <div className="text-center mb-14">
            <span className="text-brand-orange font-600 text-sm uppercase tracking-widest">
              Reference
            </span>
            <h2 className="font-display font-800 text-4xl md:text-5xl text-white mt-3">
              Co říkají zákazníci
            </h2>
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.map((r, i) => (
            <FadeIn key={r.id} delay={i * 90}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:bg-white/8 hover:border-brand-orange/30 transition-all duration-300">
                <Stars />
                <p className="text-white/75 text-sm leading-relaxed flex-grow">&ldquo;{r.text}&rdquo;</p>
                <div>
                  <div className="font-display font-700 text-white text-sm">{r.author}</div>
                  <div className="text-brand-orange text-xs mt-0.5">{r.org}</div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────

const productTypes = [
  'Vyberte typ produktu…',
  'Tričko',
  'Mikina',
  'Polo / košile',
  'Čepice / doplněk',
  'Firemní série',
  'Jiné',
]

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {}
  if (!data.name.trim() || data.name.trim().length < 2) errors.name = 'Zadejte prosím jméno.'
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = 'Zadejte platnou e-mailovou adresu.'
  if (data.phone && !/^[+\d\s\-()]{7,20}$/.test(data.phone))
    errors.phone = 'Zadejte platné telefonní číslo.'
  if (!data.productType || data.productType === productTypes[0])
    errors.productType = 'Vyberte typ produktu.'
  if (!data.message.trim() || data.message.trim().length < 10)
    errors.message = 'Popište svoji poptávku (min. 10 znaků).'
  return errors
}

function Contact() {
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    productType: '',
    quantity: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const set = (field: FormField) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setSubmitted(true)
  }

  const inputClass = (field: FormField) =>
    `w-full bg-white border rounded-xl px-4 py-3 text-sm text-brand-dark placeholder:text-brand-muted focus:outline-none focus:ring-2 transition-all ${
      errors[field]
        ? 'border-red-400 focus:ring-red-200'
        : 'border-brand-border focus:border-brand-orange focus:ring-brand-orange/20'
    }`

  return (
    <section id="kontakt" className="section-pad bg-brand-cream">
      <div className="container-pad">
        <FadeIn>
          <div className="text-center mb-14">
            <span className="text-brand-orange font-600 text-sm uppercase tracking-widest">
              Kontakt
            </span>
            <h2 className="font-display font-800 text-4xl md:text-5xl text-brand-dark mt-3">
              Ozvěte se nám
            </h2>
            <p className="text-brand-muted mt-3 max-w-md mx-auto">
              Poptejte bez závazků — odpovíme do 24 hodin.
            </p>
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
          {/* Form */}
          <FadeIn>
            {submitted ? (
              <div className="bg-white rounded-2xl p-10 shadow-sm text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-3xl">✓</span>
                </div>
                <h3 className="font-display font-800 text-2xl text-brand-dark mb-2">
                  Poptávka odeslána!
                </h3>
                <p className="text-brand-muted">
                  Díky za zájem. Ozveme se na <strong>{form.email}</strong> do 24 hodin.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', productType: '', quantity: '', message: '' }) }}
                  className="mt-6 text-brand-orange text-sm font-600 hover:underline"
                >
                  Odeslat další poptávku
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="bg-white rounded-2xl p-8 shadow-sm flex flex-col gap-5"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-700 text-brand-muted uppercase tracking-wide mb-1.5 block">
                      Jméno *
                    </label>
                    <input
                      type="text"
                      placeholder="Jana Nováková"
                      value={form.name}
                      onChange={set('name')}
                      className={inputClass('name')}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-700 text-brand-muted uppercase tracking-wide mb-1.5 block">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      placeholder="jana@email.cz"
                      value={form.email}
                      onChange={set('email')}
                      className={inputClass('email')}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-700 text-brand-muted uppercase tracking-wide mb-1.5 block">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      placeholder="+420 777 123 456"
                      value={form.phone}
                      onChange={set('phone')}
                      className={inputClass('phone')}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-700 text-brand-muted uppercase tracking-wide mb-1.5 block">
                      Počet kusů
                    </label>
                    <input
                      type="number"
                      placeholder="10"
                      min="1"
                      value={form.quantity}
                      onChange={set('quantity')}
                      className={inputClass('quantity')}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-700 text-brand-muted uppercase tracking-wide mb-1.5 block">
                    Typ produktu *
                  </label>
                  <select
                    value={form.productType}
                    onChange={set('productType')}
                    className={inputClass('productType')}
                  >
                    {productTypes.map((t) => (
                      <option key={t} value={t === productTypes[0] ? '' : t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {errors.productType && (
                    <p className="text-red-500 text-xs mt-1">{errors.productType}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-700 text-brand-muted uppercase tracking-wide mb-1.5 block">
                    Popis nápadu / zpráva *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Popište, co chcete na tričku, jaký motiv, barvy, velikosti…"
                    value={form.message}
                    onChange={set('message')}
                    className={`${inputClass('message')} resize-none`}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                  )}
                </div>

                <button type="submit" className="btn-primary justify-center w-full text-base">
                  Odeslat poptávku <IconArrow />
                </button>

                <p className="text-xs text-brand-muted text-center">
                  Bez závazků — odpovíme do 24 hodin.
                </p>
              </form>
            )}
          </FadeIn>

          {/* Contact info */}
          <FadeIn delay={150}>
            <div className="flex flex-col gap-8">
              <div>
                <h3 className="font-display font-700 text-2xl text-brand-dark mb-6">
                  Kde nás najdete
                </h3>
                <div className="flex flex-col gap-4">
                  {[
                    { icon: <IconPhone />, label: 'Telefon', value: '+420 777 123 456' },
                    { icon: <IconMail />, label: 'E-mail', value: 'info@fajntriko.cz' },
                    { icon: <IconPin />, label: 'Lokalita', value: 'Praha a okolí · Zásilkovna ČR' },
                  ].map((c) => (
                    <div key={c.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center flex-shrink-0">
                        {c.icon}
                      </div>
                      <div>
                        <div className="text-xs font-700 text-brand-muted uppercase tracking-wide">
                          {c.label}
                        </div>
                        <div className="text-brand-dark font-600 mt-0.5">{c.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h4 className="font-display font-700 text-lg text-brand-dark mb-3">
                  Pracovní doba
                </h4>
                <div className="flex flex-col gap-2 text-sm">
                  {[
                    { day: 'Pondělí–Pátek', time: '9:00–18:00' },
                    { day: 'Sobota', time: '10:00–14:00' },
                    { day: 'Neděle', time: 'Zavřeno' },
                  ].map((row) => (
                    <div key={row.day} className="flex justify-between">
                      <span className="text-brand-muted">{row.day}</span>
                      <span className="font-600 text-brand-dark">{row.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-brand-orange/10 border border-brand-orange/20 rounded-2xl p-6">
                <p className="text-brand-dark font-600 text-sm leading-relaxed">
                  Preferujete osobní schůzku?{' '}
                  <span className="text-brand-orange">Domluvíme se!</span> Ukážeme vám vzorky
                  materiálů a tisků, ať přesně víte, co dostanete.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <footer className="bg-brand-dark border-t border-white/10">
      <div className="container-pad py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <button
              onClick={() => scrollTo('hero')}
              className="font-display font-800 text-2xl text-white mb-3 block"
            >
              FajnTriko<span className="text-brand-orange">.cz</span>
            </button>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Rodinný podnik na potisk textilu. Trička, mikiny a merch pro každého — s osobním
              přístupem.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-brand-orange hover:border-brand-orange transition-colors"
              >
                <IconInstagram />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-brand-orange hover:border-brand-orange transition-colors"
              >
                <IconFacebook />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h5 className="font-display font-700 text-white text-sm uppercase tracking-widest mb-4">
              Navigace
            </h5>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <button
                    onClick={() => scrollTo(l.href)}
                    className="text-white/50 text-sm hover:text-brand-orange transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="font-display font-700 text-white text-sm uppercase tracking-widest mb-4">
              Kontakt
            </h5>
            <div className="flex flex-col gap-2.5 text-sm text-white/50">
              <a href="tel:+420777123456" className="hover:text-brand-orange transition-colors">
                +420 777 123 456
              </a>
              <a href="mailto:info@fajntriko.cz" className="hover:text-brand-orange transition-colors">
                info@fajntriko.cz
              </a>
              <span>Praha a okolí</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-white/30">
          <span>© 2025 FajnTriko.cz — Všechna práva vyhrazena.</span>
          <span>Rodinný podnik · Praha a okolí</span>
        </div>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Services />
      <HowItWorks />
      <Gallery />
      <Pricing />
      <Reviews />
      <Contact />
      <Footer />
    </main>
  )
}
