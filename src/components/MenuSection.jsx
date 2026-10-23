import MenuItemCard from './MenuItemCard.jsx'

export default function MenuSection({ category, onOpenImage }) {
  return (
    <section id={`cat-${category.id}`} aria-labelledby={`cat-${category.id}-title`} className="mx-auto max-w-md px-4">
      <div className="mb-3 mt-6 flex items-center gap-2">
        <h2
          id={`cat-${category.id}-title`}
          className="font-display text-xl font-extrabold uppercase tracking-tight text-bar-cream"
        >
          {category.name}
        </h2>
        <span aria-hidden="true" className="text-lg">
          {category.emoji}
        </span>
        <span className="ml-auto text-[12px] font-semibold text-bar-muted">{category.items.length} позиций</span>
      </div>

      <div className="flex flex-col gap-3">
        {category.items.map((item) => (
          <MenuItemCard key={item.id} item={item} onOpenImage={onOpenImage} />
        ))}
      </div>
    </section>
  )
}
