import { Maximize2 } from 'lucide-react'
import { formatPrice } from '../lib/format.js'

const TAG_STYLES = {
  hit: { label: 'Хит', className: 'bg-bar-red text-bar-cream' },
  new: { label: 'Новинка', className: 'bg-bar-cream text-bar-dark' },
  spicy: { label: 'Остро', className: 'bg-amber-500 text-bar-dark' }
}

export default function MenuItemCard({ item, onOpenImage }) {
  const priceLabel = item.price > 0 ? formatPrice(item.price) : 'по ассортименту'

  return (
    <article className="animate-rise flex gap-3 rounded-card bg-bar-dark-card p-3">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-bar-dark-soft">
        {item.image ? (
          <button
            type="button"
            onClick={() => onOpenImage?.({ src: item.image, name: item.name })}
            aria-label={`Открыть фото «${item.name}»`}
            className="group block h-full w-full"
          >
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-active:scale-105"
            />
            <span className="absolute bottom-1 right-1 grid h-6 w-6 place-items-center rounded-full bg-black/55 text-bar-cream backdrop-blur-sm">
              <Maximize2 size={13} />
            </span>
          </button>
        ) : (
          <span className="grid h-full w-full place-items-center text-4xl" aria-hidden="true">
            {item.emoji}
          </span>
        )}

        <div className="pointer-events-none absolute left-1 top-1 flex flex-col gap-1">
          {(item.tags ?? []).slice(0, 2).map((tag) => {
            const style = TAG_STYLES[tag]
            if (!style) return null
            return (
              <span
                key={tag}
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${style.className}`}
              >
                {style.label}
              </span>
            )
          })}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="text-[15px] font-bold leading-tight text-bar-cream">{item.name}</h3>
        <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-bar-muted">
          {item.description}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold text-bar-muted">
          {item.volume && <span>{item.volume}</span>}
          {item.weight && <span>{item.weight}</span>}
          {typeof item.abv === 'number' && item.abv > 0 && (
            <span className="rounded bg-bar-dark-soft px-1.5 py-0.5 text-bar-cream/80">{item.abv}%</span>
          )}
        </div>

        <div className="mt-auto pt-2">
          <span className="font-display text-base font-extrabold text-bar-cream">
            {priceLabel}
            {item.priceBottle ? (
              <span className="ml-1 text-[11px] font-semibold text-bar-muted">
                / {formatPrice(item.priceBottle)}
              </span>
            ) : null}
          </span>
        </div>
      </div>
    </article>
  )
}
