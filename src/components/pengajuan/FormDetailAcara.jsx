import { useEffect, useState } from 'react'
import { Upload } from 'lucide-react'

export function FormDetailAcara({ value, errors = {}, fotoKtpFile, onChange, onFileChange }) {
  const [previewUrl, setPreviewUrl] = useState('')
  const update = (key, nextValue) => onChange({ ...value, [key]: nextValue })

  useEffect(() => {
    if (!fotoKtpFile) {
      setPreviewUrl('')
      return undefined
    }

    const nextUrl = URL.createObjectURL(fotoKtpFile)
    setPreviewUrl(nextUrl)
    return () => URL.revokeObjectURL(nextUrl)
  }, [fotoKtpFile])

  return (
    <div className="space-y-4">
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-primary">
        Keperluan Acara
        <textarea className="min-h-28 rounded-lg border border-slate-200 px-4 py-3 text-sm" value={value.keperluan} onChange={(event) => update('keperluan', event.target.value)} />
        {errors.keperluan ? <span className="text-xs text-[#9B1C1C]">{errors.keperluan}</span> : null}
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-primary">
          Tanggal Mulai
          <input className="rounded-lg border border-slate-200 px-4 py-3 text-sm" type="date" value={value.tanggalMulai} onChange={(event) => update('tanggalMulai', event.target.value)} />
          {errors.tanggalMulai ? <span className="text-xs text-[#9B1C1C]">{errors.tanggalMulai}</span> : null}
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-primary">
          Tanggal Selesai
          <input className="rounded-lg border border-slate-200 px-4 py-3 text-sm" type="date" value={value.tanggalSelesai} onChange={(event) => update('tanggalSelesai', event.target.value)} />
          {errors.tanggalSelesai ? <span className="text-xs text-[#9B1C1C]">{errors.tanggalSelesai}</span> : null}
        </label>
      </div>
      <label className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-slate-300 p-8 text-center hover:border-accent hover:bg-accent-pale">
        {previewUrl ? (
          <img alt="Preview foto KTP" className="h-44 w-full max-w-md rounded-xl border border-slate-200 object-contain bg-white" src={previewUrl} />
        ) : (
          <Upload aria-hidden="true" className="text-slate-500" size={32} />
        )}
        <span className="text-sm font-bold text-primary">{fotoKtpFile ? fotoKtpFile.name : 'Klik untuk unggah foto KTP'}</span>
        <span className="text-xs text-slate-500">Format JPG, PNG, atau WEBP. Maksimal 5MB.</span>
        <input accept="image/jpeg,image/png,image/webp" className="hidden" type="file" onChange={(event) => onFileChange(event.target.files?.[0] ?? null)} />
      </label>
    </div>
  )
}
