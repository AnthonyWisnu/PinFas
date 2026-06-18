import { MapPin, Users } from 'lucide-react'

export function AssetInfo({ aset }) {
  return (
    <section className="space-y-5">
      <div>
        <div className="mb-4 h-1 w-24 rounded-full bg-accent" />
        <h1 className="font-display text-3xl font-bold text-primary">{aset.nama}</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          {aset.deskripsi ?? 'Fasilitas publik yang dapat diajukan untuk kegiatan warga sesuai jadwal ketersediaan.'}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-primary">
            <MapPin aria-hidden="true" size={18} />
            Lokasi
          </p>
          <p className="mt-2 text-sm text-slate-600">{aset.lokasi ?? 'Lokasi belum diisi'}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Users aria-hidden="true" size={18} />
            Kapasitas
          </p>
          <p className="mt-2 text-sm text-slate-600">{aset.kapasitas ? `${aset.kapasitas} orang` : 'Menyesuaikan kegiatan'}</p>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-display text-lg font-bold text-primary">Syarat dan Ketentuan</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          {(aset.syaratKetentuan.length ? aset.syaratKetentuan : ['Menjaga kebersihan fasilitas.', 'Mengembalikan aset sesuai jadwal.']).map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
