import { Home, BookOpen, Percent, Phone } from 'lucide-react'

const TABS = [
  { id: 'home', label: 'Главная', icon: Home },
  { id: 'menu', label: 'Меню', icon: BookOpen },
  { id: 'promo', label: 'Акции', icon: Percent },
  { id: 'contacts', label: 'Контакты', icon: Phone }
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav
      aria-label="Основная навигация"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/5 bg-bar-dark/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-bold transition ${
                isActive ? 'text-bar-red-light' : 'text-bar-muted'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              {tab.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
