import { Download, Share, X } from 'lucide-react'

export default function InstallPrompt({ visible, isIos, onInstall, onDismiss }) {
  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-20 z-40 px-4">
      <div className="mx-auto flex max-w-md items-start gap-3 rounded-2xl border border-bar-red/40 bg-bar-dark-card p-3 shadow-2xl shadow-black/50">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-bar-red text-bar-cream">
          <Download size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-bar-cream">Установить приложение «Бульвар 21»</p>
          {isIos ? (
            <p className="mt-0.5 text-[12px] leading-snug text-bar-muted">
              Нажмите <Share size={12} className="inline -mt-0.5" /> «Поделиться» → «На экран “Домой”»
            </p>
          ) : (
            <p className="mt-0.5 text-[12px] leading-snug text-bar-muted">
              Быстрый доступ с главного экрана и работа без интернета
            </p>
          )}

          {!isIos && (
            <button
              type="button"
              onClick={onInstall}
              className="mt-2 rounded-full bg-bar-red px-4 py-1.5 text-[12px] font-bold text-bar-cream active:scale-95"
            >
              Установить
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onDismiss}
          aria-label="Скрыть предложение установки"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-bar-muted active:scale-90"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
