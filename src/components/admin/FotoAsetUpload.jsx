import { useRef, useState } from 'react'
import { ImagePlus, Trash2 } from 'lucide-react'
import { ButtonPrimary } from '../common/ButtonPrimary'

const MAX_FILE_SIZE = 5 * 1024 * 1024

export function FotoAsetUpload({ disabled = false, fotoUrls = [], onChange, onUpload }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const removeUrl = (url) => {
    onChange(fotoUrls.filter((item) => item !== url))
  }

  const handleFile = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setMessage('File harus berupa gambar.')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setMessage('Ukuran foto maksimal 5 MB.')
      return
    }

    setUploading(true)
    setMessage('')
    const result = await onUpload(file)
    setUploading(false)

    if (result.error) {
      setMessage(result.error.message)
      return
    }

    onChange([...fotoUrls, result.data])
  }

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Foto Aset</p>
          <p className="text-xs text-slate-500">Unggah JPG, PNG, atau WebP. Foto tersimpan di bucket pinfas-aset.</p>
        </div>
        <ButtonPrimary disabled={disabled || uploading} icon={ImagePlus} loading={uploading} type="button" onClick={() => inputRef.current?.click()}>
          Unggah
        </ButtonPrimary>
      </div>
      <input ref={inputRef} accept="image/jpeg,image/png,image/webp" className="hidden" type="file" onChange={handleFile} />
      {message ? <p className="text-sm font-semibold text-[#9B1C1C]">{message}</p> : null}
      {fotoUrls.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {fotoUrls.map((url) => (
            <div key={url} className="overflow-hidden rounded-xl border border-slate-200">
              <img alt="Pratinjau aset" className="h-28 w-full object-cover" src={url} />
              <div className="flex items-center justify-between gap-2 p-2">
                <span className="truncate text-xs text-slate-500">{url}</span>
                <ButtonPrimary disabled={disabled} icon={Trash2} type="button" variant="icon" onClick={() => removeUrl(url)}>
                  Hapus
                </ButtonPrimary>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500">Belum ada foto aset.</p>
      )}
    </div>
  )
}
