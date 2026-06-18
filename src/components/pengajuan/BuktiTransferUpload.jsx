import { useEffect, useState } from 'react'
import { Upload } from 'lucide-react'

export function BuktiTransferUpload({ file, onChange }) {
  const [previewUrl, setPreviewUrl] = useState('')

  useEffect(() => {
    if (!file) {
      setPreviewUrl('')
      return undefined
    }

    const nextUrl = URL.createObjectURL(file)
    setPreviewUrl(nextUrl)
    return () => URL.revokeObjectURL(nextUrl)
  }, [file])

  return (
    <label className="mt-4 flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-accent-light bg-white/60 p-6 text-center hover:bg-white">
      {previewUrl ? (
        <img alt="Preview bukti transfer" className="h-44 w-full max-w-md rounded-xl border border-accent-light bg-white object-contain" src={previewUrl} />
      ) : (
        <Upload aria-hidden="true" className="text-accent-dark" size={28} />
      )}
      <span className="text-sm font-bold text-primary">{file ? file.name : 'Unggah Bukti Transfer'}</span>
      <span className="text-xs text-slate-500">JPG, PNG, atau WEBP. Maksimal 5MB.</span>
      <input accept="image/jpeg,image/png,image/webp" className="hidden" type="file" onChange={(event) => onChange(event.target.files?.[0] ?? null)} />
    </label>
  )
}
