import { X } from 'lucide-react'
import { useEffect } from 'react'

export default function Lightbox({ photo, onClose }) {
  useEffect(() => {
    if (!photo) return
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [photo, onClose])

  if (!photo) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.name}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Закрыть фото"
        className="absolute right-4 top-[calc(env(safe-area-inset-top,0px)+1rem)] grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-bar-cream backdrop-blur-md transition active:scale-95"
      >
        <X size={20} />
      </button>

      <figure
        className="animate-lightbox flex max-h-full max-w-full flex-col items-center"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={photo.src}
          alt={photo.name}
          className="max-h-[78vh] max-w-full rounded-2xl object-contain shadow-2xl shadow-black/60"
        />
        <figcaption className="mt-3 text-center text-[14px] font-bold text-bar-cream">
          {photo.name}
        </figcaption>
      </figure>
    </div>
  )
}
