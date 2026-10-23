import { asset } from '../lib/asset.js'

const ACCENTS = {
  red: 'from-bar-red to-bar-red-dark',
  cream: 'from-[#fff9ca] to-[#f0e39a] text-bar-dark',
  dark: 'from-bar-dark-card to-bar-dark-soft'
}

export default function PromoBanner({ promos }) {
  return (
    <section aria-label="Акции" className="mx-auto max-w-md">
      <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1">
        {promos.map((promo) => (
          <article
            key={promo.id}
            className={`relative flex min-h-36 w-[78%] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-card bg-gradient-to-br p-4 ${
              ACCENTS[promo.accent] ?? ACCENTS.red
            }`}
          >
            {promo.image && (
              <>
                <img
                  src={asset(promo.image)}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-45"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </>
            )}

            <div className="relative flex items-center justify-between">
              <span className="rounded-full bg-black/25 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide">
                {promo.badge}
              </span>
              <span className="text-3xl" aria-hidden="true">
                {promo.emoji}
              </span>
            </div>
            <div className="relative">
              <h3 className="font-display text-base font-extrabold leading-tight text-balance">
                {promo.title}
              </h3>
              <p className="mt-1 text-[12px] font-semibold opacity-90">{promo.subtitle}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
