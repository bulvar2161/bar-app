import { MapPin, Clock, ChevronLeft, Phone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { asset } from '../lib/asset.js'

export default function Header({ venue, onBack }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`safe-top sticky top-0 z-40 transition-colors duration-300 ${
        scrolled ? 'bg-bar-dark/95 backdrop-blur-xl shadow-lg shadow-black/40' : 'bg-bar-dark'
      }`}
    >
      <div className="mx-auto max-w-md px-4 pt-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                aria-label="На главную"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-bar-dark-card text-bar-cream transition active:scale-95"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <img
              src={asset('/brand/logo.png')}
              alt={venue.shortName}
              className="h-9 w-auto max-w-[62%] object-contain object-left"
            />
          </div>

          <a
            href={`tel:${venue.phoneRaw}`}
            aria-label="Забронировать стол по телефону"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-bar-red text-bar-cream transition active:scale-95"
          >
            <Phone size={19} />
          </a>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-bar-dark-card px-3 py-2.5">
          <MapPin size={16} className="shrink-0 text-bar-red-light" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold text-bar-cream">
              {venue.city}, {venue.address}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-bar-muted">
              <span className={`h-1.5 w-1.5 rounded-full ${venue.isOpen ? 'bg-emerald-400' : 'bg-bar-muted'}`} />
              {venue.isOpen ? 'Открыто' : 'Закрыто'}
              <span className="text-bar-muted/60">·</span>
              <Clock size={11} />
              {venue.hoursShort}
            </span>
          </span>
        </div>

        <div className="pb-3" />
      </div>
    </header>
  )
}
