import { CalendarDays } from 'lucide-react'
import { BadgeStatus } from '../common/BadgeStatus'
import { EmptyState } from '../common/EmptyState'
import { formatDate } from '../../utils/formatDate'

export function KalenderGabungan({ className = '', items = [] }) {
  const jadwal = items
    .filter((item) => ['approved', 'terlambat'].includes(item.status))
    .sort((a, b) => a.tanggalMulai.localeCompare(b.tanggalMulai))

  return (
    <section className={`w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Kalender Gabungan</p>
          <h2 className="font-display text-xl font-bold text-primary">Jadwal Aset Terkunci</h2>
        </div>
        <CalendarDays aria-hidden="true" className="text-accent-dark" size={24} />
      </div>
      {jadwal.length === 0 ? (
        <EmptyState className="py-10" title="Belum Ada Jadwal Aktif" description="Pengajuan approved dan terlambat akan mengunci kalender." />
      ) : (
        <div className="space-y-3">
          {jadwal.slice(0, 8).map((item) => (
            <div key={item.id} className="flex w-full flex-col gap-2 rounded-xl bg-surface p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-semibold text-primary">{item.namaAset}</p>
                <p className="text-sm text-slate-600">{formatDate(item.tanggalMulai)} sampai {formatDate(item.tanggalSelesai)}</p>
              </div>
              <BadgeStatus status={item.status} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
