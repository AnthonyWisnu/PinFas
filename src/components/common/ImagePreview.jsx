import { useEffect, useState } from 'react'
import { ImageOff, X, ZoomIn } from 'lucide-react'
import { ButtonPrimary } from './ButtonPrimary'

export function ImagePreview({ src, alt = 'Preview gambar', label, className = '' }) {
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false

    setLoaded(false)
    setFailed(false)

    if (!src) {
      return undefined
    }

    const image = new Image()

    image.decoding = 'async'
    image.onload = () => {
      if (!cancelled) setLoaded(true)
    }
    image.onerror = () => {
      if (!cancelled) setFailed(true)
    }
    image.src = src

    if (image.complete && image.naturalWidth > 0) {
      setLoaded(true)
    }

    return () => {
      cancelled = true
    }
  }, [src])

  if (!src || failed) {
    return (
      <div className={`flex h-16 w-16 items-center justify-center rounded-lg border border-slate-200 bg-surface ${className}`}>
        <div className="flex flex-col items-center gap-1 text-slate-400">
          <ImageOff aria-hidden="true" size={20} />
          <span className="text-xs font-semibold">{failed ? 'Gagal' : 'IMG'}</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        className={`group relative h-16 w-16 overflow-hidden rounded-lg border border-slate-200 bg-surface ${className}`}
        onClick={() => setOpen(true)}
      >
        {!loaded ? (
          <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-slate-400">Memuat</span>
        ) : null}
        <img
          src={src}
          alt={alt}
          className={`h-full w-full object-cover transition-opacity ${loaded ? 'opacity-100' : 'opacity-0'}`}
          decoding="async"
          fetchPriority="high"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-primary/50 opacity-0 transition-opacity group-hover:opacity-100">
          <ZoomIn aria-hidden="true" className="text-white" size={20} />
        </span>
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/90 p-4">
          <img src={src} alt={alt} className="max-h-[90vh] max-w-full rounded-xl object-contain shadow-2xl" decoding="async" />
          <ButtonPrimary
            className="absolute right-4 top-4 text-white hover:bg-white/10"
            icon={X}
            variant="icon"
            onClick={() => setOpen(false)}
          >
            Tutup
          </ButtonPrimary>
          {label ? <p className="absolute bottom-4 text-sm font-medium text-white">{label}</p> : null}
        </div>
      ) : null}
    </>
  )
}
