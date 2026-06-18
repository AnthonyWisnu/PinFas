import { useMemo, useState } from 'react'
import { Calculator } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'
import { kalkulasiTarif } from '../../utils/kalkulasiTarif'
import { ButtonPrimary } from './ButtonPrimary'

export function KalkulatorBiaya({ aset, banjarOptions = [], onAjukan, className = '' }) {
  const [banjarAsal, setBanjarAsal] = useState('')
  const [tanggalMulai, setTanggalMulai] = useState('')
  const [tanggalSelesai, setTanggalSelesai] = useState('')

  const hasil = useMemo(
    () => kalkulasiTarif(aset ?? {}, { banjarAsal, tanggalMulai, tanggalSelesai }),
    [aset, banjarAsal, tanggalMulai, tanggalSelesai],
  )

  const kategoriLabel = {
    lokal: 'Lokal',
    antar_banjar: 'Antar-Banjar',
    luar_desa: 'Luar Desa',
  }

  return (
    <section className={`rounded-2xl border border-accent-light bg-accent-pale p-5 ${className}`}>
      <div className="flex items-center gap-2 font-display text-lg font-bold text-primary">
        <Calculator aria-hidden="true" size={20} />
        Estimasi Biaya
      </div>
      <div className="mt-4 space-y-3 border-t border-accent-light pt-4">
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-primary">
          Banjar Asal
          <select
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={banjarAsal}
            onChange={(event) => setBanjarAsal(event.target.value)}
          >
            <option value="">Pilih Banjar</option>
            {banjarOptions.map((banjar) => (
              <option key={banjar.id} value={banjar.id}>
                {banjar.nama}
              </option>
            ))}
            <option value="luar_desa">Luar Desa/Kelurahan</option>
          </select>
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-primary">
            Tanggal Mulai
            <input className="rounded-lg border border-slate-200 px-4 py-3 text-sm" type="date" value={tanggalMulai} onChange={(event) => setTanggalMulai(event.target.value)} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-primary">
            Tanggal Selesai
            <input className="rounded-lg border border-slate-200 px-4 py-3 text-sm" type="date" value={tanggalSelesai} onChange={(event) => setTanggalSelesai(event.target.value)} />
          </label>
        </div>
      </div>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between gap-4"><dt className="text-slate-600">Durasi</dt><dd className="font-semibold">{hasil.durasiHari} hari</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-slate-600">Kategori Tarif</dt><dd className="font-semibold">{kategoriLabel[hasil.kategoriTarif]}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-slate-600">Tarif per Hari</dt><dd className="font-mono font-semibold">{hasil.tarifPerHari ? formatCurrency(hasil.tarifPerHari) : 'Gratis'}</dd></div>
        <div className="flex justify-between gap-4 border-t border-accent-light pt-3 font-display text-lg font-black text-primary">
          <dt>Total Estimasi</dt><dd className="font-mono">{formatCurrency(hasil.totalBiaya)}</dd>
        </div>
      </dl>
      {onAjukan ? <ButtonPrimary className="mt-5 w-full" variant="accent" onClick={() => onAjukan({ banjarAsal, tanggalMulai, tanggalSelesai, hasil })}>Ajukan Sekarang</ButtonPrimary> : null}
    </section>
  )
}
