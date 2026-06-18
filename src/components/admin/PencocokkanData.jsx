import { ImagePreview } from '../common/ImagePreview'

export function PencocokkanData({ pengajuan }) {
  if (!pengajuan) return null

  const fields = [
    ['NIK', pengajuan.nik],
    ['Nama', pengajuan.nama],
    ['Nomor HP', pengajuan.nomorHp],
    ['Banjar Asal', pengajuan.banjarAsal],
  ]

  return (
    <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 lg:grid-cols-[240px_1fr]">
      <div className="min-w-0">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Foto KTP</p>
        <ImagePreview className="h-40 w-full" src={pengajuan.fotoKtpSignedUrl} alt="Foto KTP pemohon" label="Foto KTP" />
      </div>
      <div className="min-w-0">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Data Input Warga</p>
        <dl className="grid gap-2">
          {fields.map(([label, value]) => (
            <div key={label} className="grid gap-1 rounded-xl bg-surface p-3 sm:grid-cols-[110px_1fr]">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
              <dd className="min-w-0 break-words text-sm font-semibold text-primary">{value ?? '-'}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
