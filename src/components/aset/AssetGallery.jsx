import { useState } from 'react'

export function AssetGallery({ aset }) {
  const photos = aset?.fotoUrls?.length ? aset.fotoUrls : [aset?.coverUrl].filter(Boolean)
  const [activeIndex, setActiveIndex] = useState(0)
  const activePhoto = photos[activeIndex] ?? photos[0]

  if (!activePhoto) {
    return <div className="aspect-video rounded-2xl bg-primary-pale" />
  }

  return (
    <section className="space-y-3">
      <img src={activePhoto} alt={aset.nama} className="aspect-video w-full rounded-2xl object-cover shadow-md" />
      {photos.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {photos.map((photo, index) => (
            <button
              key={photo}
              type="button"
              className={`overflow-hidden rounded-xl border-2 ${index === activeIndex ? 'border-accent' : 'border-transparent'}`}
              onClick={() => setActiveIndex(index)}
            >
              <img src={photo} alt={`${aset.nama} ${index + 1}`} className="aspect-video w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  )
}
