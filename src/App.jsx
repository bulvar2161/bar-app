import { useCallback, useEffect, useState } from 'react'
import { MapPin, Phone } from 'lucide-react'
import menu from './data/menu.json'
import Landing from './components/Landing.jsx'
import Header from './components/Header.jsx'
import PromoBanner from './components/PromoBanner.jsx'
import CategoryTabs from './components/CategoryTabs.jsx'
import MenuSection from './components/MenuSection.jsx'
import BottomNav from './components/BottomNav.jsx'
import InstallPrompt from './components/InstallPrompt.jsx'
import Lightbox from './components/Lightbox.jsx'
import { usePwaInstall } from './hooks/usePwaInstall.js'
import { asset } from './lib/asset.js'

const { venue, promos, categories } = menu

export default function App() {
  const [view, setView] = useState('landing')
  const [activeCat, setActiveCat] = useState(categories[0].id)
  const [navTab, setNavTab] = useState('home')
  const [photo, setPhoto] = useState(null)

  const { canPrompt, installed, isIos, dismissed, dismiss, promptInstall } = usePwaInstall()

  const scrollToId = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const openMenu = useCallback(() => {
    setView('menu')
    setNavTab('menu')
    window.scrollTo({ top: 0 })
  }, [])

  const goHome = useCallback(() => {
    setView('landing')
    setNavTab('home')
    window.scrollTo({ top: 0 })
  }, [])

  useEffect(() => {
    if (view !== 'menu') return

    const sections = categories
      .map((cat) => document.getElementById(`cat-${cat.id}`))
      .filter(Boolean)
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveCat(visible.target.id.replace('cat-', ''))
      },
      { rootMargin: '-180px 0px -60% 0px', threshold: [0.1, 0.4, 0.75] }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [view])

  const scrollToCategory = useCallback(
    (id) => {
      setActiveCat(id)
      scrollToId(`cat-${id}`)
    },
    [scrollToId]
  )

  const handleNav = useCallback(
    (tab) => {
      setNavTab(tab)
      if (tab === 'menu') scrollToCategory(categories[0].id)
      else if (tab === 'promo') scrollToId('promos')
      else if (tab === 'contacts') scrollToId('contacts')
      else goHome()
    },
    [scrollToCategory, scrollToId, goHome]
  )

  const showInstall = canPrompt && !installed && !dismissed

  return (
    <>
      {view === 'landing' ? (
        <Landing venue={venue} onOpenMenu={openMenu} />
      ) : (
        <div className="min-h-dvh bg-bar-dark">
          <Header venue={venue} onBack={goHome} />

          <main className="pb-24">
            <div id="promos" className="pt-1">
              <PromoBanner promos={promos} />
            </div>

            <CategoryTabs categories={categories} activeId={activeCat} onChange={scrollToCategory} />

            <div className="mt-2">
              {categories.map((category) => (
                <MenuSection key={category.id} category={category} onOpenImage={setPhoto} />
              ))}
            </div>

            <footer id="contacts" className="mx-auto mt-12 max-w-md px-4 pb-4 text-center">
              <img
                src={asset('/brand/logo.png')}
                alt={venue.shortName}
                className="mx-auto h-12 w-auto object-contain"
              />
              <div className="mt-4 flex flex-col items-center gap-2 text-[13px]">
                <span className="inline-flex items-center gap-2 font-semibold text-bar-cream">
                  <MapPin size={15} className="text-bar-red-light" />
                  {venue.city}, {venue.address}
                </span>
                <a
                  href={`tel:${venue.phoneRaw}`}
                  className="inline-flex items-center gap-2 font-semibold text-bar-cream"
                >
                  <Phone size={15} className="text-bar-red-light" />
                  {venue.phone}
                </a>
              </div>

              <p className="mt-4 text-[12px] text-bar-muted">{venue.hoursWeek}</p>
              <p className="text-[12px] text-bar-muted">{venue.hoursWeekend}</p>

              <p className="mt-6 text-[11px] text-bar-muted">
                {venue.shortName} © {new Date().getFullYear()}
              </p>
              <p className="mt-3 text-[11px] leading-relaxed text-bar-muted/80">
                18+ Чрезмерное употребление алкоголя вредит вашему здоровью
              </p>
            </footer>
          </main>

          <BottomNav active={navTab} onChange={handleNav} />
        </div>
      )}

      <Lightbox photo={photo} onClose={() => setPhoto(null)} />

      <InstallPrompt
        visible={showInstall}
        isIos={isIos}
        onInstall={promptInstall}
        onDismiss={dismiss}
      />
    </>
  )
}
