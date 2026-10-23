import {
  BookOpen,
  ChevronRight,
  Clock,
  HandCoins,
  Instagram,
  MapPin,
  MapPinned,
  Phone,
  Send
} from 'lucide-react'

const SLIDES = [
  '/gallery/gallery-01.jpg',
  '/gallery/gallery-02.jpg',
  '/gallery/gallery-04.jpg',
  '/gallery/gallery-06.jpg',
  '/gallery/gallery-08.jpg',
  '/gallery/gallery-10.jpg'
]

function ActionTile({ href, icon: Icon, label, hint, external, delay = 0 }) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className="group flex animate-rise items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-left backdrop-blur-md transition hover:bg-white/[0.12] active:scale-[0.99]"
      style={{ animationDelay: `${delay}s` }}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-bar-red text-bar-cream shadow-lg shadow-bar-red/20">
        <Icon size={19} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-bold leading-tight text-bar-cream">{label}</span>
        {hint && <span className="mt-0.5 block text-[12px] leading-tight text-bar-cream/65">{hint}</span>}
      </span>
      <ChevronRight size={18} className="shrink-0 text-bar-cream/40 transition group-hover:text-bar-cream/80" />
    </a>
  )
}

export default function Landing({ venue, onOpenMenu }) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-bar-dark">
      <div className="absolute inset-0" aria-hidden="true">
        {SLIDES.map((src, index) => (
          <img
            key={src}
            src={src}
            alt=""
            className="hero-slide absolute inset-0 h-full w-full object-cover"
            style={{ animationDelay: `${index * 6}s` }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_0%,rgba(0,0,0,0.55)_100%)]" />
      </div>

      <div className="safe-top safe-bottom relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-8">
        <div className="flex justify-center pt-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[12px] font-bold text-bar-cream backdrop-blur-md">
            <span className={`h-2 w-2 rounded-full ${venue.isOpen ? 'bg-emerald-400' : 'bg-bar-muted'}`} />
            {venue.isOpen ? 'Открыто' : 'Закрыто'}
            <span className="text-bar-cream/50">·</span>
            <Clock size={12} className="text-bar-cream/70" />
            <span className="font-semibold text-bar-cream/80">{venue.hoursShort}</span>
          </span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
          <img
            src="/brand/logo.png"
            alt={venue.shortName}
            className="w-[80%] max-w-xs drop-shadow-[0_6px_24px_rgba(0,0,0,0.6)]"
          />
          <p className="mt-4 text-[12px] font-bold uppercase tracking-[0.28em] text-bar-cream/70">
            {venue.tagline}
          </p>
          <p className="mt-3 inline-flex items-center gap-2 text-[13px] font-semibold text-bar-cream/85">
            <MapPin size={15} className="text-bar-red-light" />
            {venue.city}, {venue.address}
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onOpenMenu}
            className="animate-rise flex items-center justify-between rounded-2xl bg-bar-red px-5 py-4 text-left shadow-2xl shadow-bar-red/40 transition active:scale-[0.99]"
          >
            <span className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-black/20">
                <BookOpen size={20} className="text-bar-cream" />
              </span>
              <span>
                <span className="block font-display text-base font-extrabold text-bar-cream">Меню бара</span>
                <span className="block text-[12px] text-bar-cream/80">Кухня · коктейли · настойки</span>
              </span>
            </span>
            <ChevronRight size={20} className="text-bar-cream/80" />
          </button>

          <ActionTile
            href={`tel:${venue.phoneRaw}`}
            icon={Phone}
            label="Забронировать стол"
            hint="по звонку"
            delay={0.06}
          />
          <ActionTile
            href={venue.tips}
            external
            icon={HandCoins}
            label="Оставить чаевые"
            hint="Netmonet"
            delay={0.12}
          />
          <ActionTile
            href={venue.maps}
            external
            icon={MapPinned}
            label="Яндекс.Карты"
            hint="отзыв и маршрут"
            delay={0.18}
          />
          <ActionTile
            href={venue.instagram}
            external
            icon={Instagram}
            label="Instagram"
            hint="@bulvar.21"
            delay={0.24}
          />
          <ActionTile
            href={venue.telegram}
            external
            icon={Send}
            label="Telegram"
            hint="@bulvarr21"
            delay={0.3}
          />
        </div>

        <p className="mt-5 text-center text-[11px] leading-relaxed text-bar-cream/45">
          18+ Чрезмерное употребление алкоголя вредит вашему здоровью
        </p>
      </div>
    </div>
  )
}
