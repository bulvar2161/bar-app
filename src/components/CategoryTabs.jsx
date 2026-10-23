import { useEffect, useRef } from 'react'

export default function CategoryTabs({ categories, activeId, onChange }) {
  const scrollerRef = useRef(null)

  useEffect(() => {
    const el = scrollerRef.current?.querySelector(`[data-cat="${activeId}"]`)
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [activeId])

  return (
    <nav
      aria-label="Категории меню"
      className="sticky top-[152px] z-30 bg-bar-dark/95 py-2 backdrop-blur-xl"
    >
      <div ref={scrollerRef} className="no-scrollbar mx-auto flex max-w-md gap-2 overflow-x-auto px-4">
        {categories.map((cat) => {
          const active = cat.id === activeId
          return (
            <button
              key={cat.id}
              type="button"
              data-cat={cat.id}
              onClick={() => onChange(cat.id)}
              aria-current={active ? 'true' : undefined}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-bold transition active:scale-95 ${
                active
                  ? 'bg-bar-red text-bar-cream shadow-lg shadow-bar-red/30'
                  : 'bg-bar-dark-card text-bar-muted hover:text-bar-cream'
              }`}
            >
              <span aria-hidden="true">{cat.emoji}</span>
              {cat.name}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
