import { Banknote } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'

export function TarifCard({ aset }) {
  const rows = [
    { label: 'Warga lokal', value: aset.tarifLokal },
    { label: 'Antar-Banjar', value: aset.tarifAntarBanjar },
    { label: 'Luar Desa/Kelurahan', value: aset.tarifLuarDesa },
  ]

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
      <h2 className="flex items-center gap-2 font-display text-lg font-bold text-primary">
        <Banknote aria-hidden="true" size={20} />
        Tarif Peminjaman
      </h2>
      {aset.statusBiaya === 'gratis' ? (
        <p className="mt-4 rounded-xl bg-secondary-pale p-4 text-sm font-semibold text-secondary">
          Fasilitas ini gratis sesuai batas hari peminjaman yang berlaku.
        </p>
      ) : (
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3 last:border-b-0">
              <span className="text-sm text-slate-600">{row.label}</span>
              <span className="font-mono text-sm font-semibold text-primary">{formatCurrency(row.value)}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
