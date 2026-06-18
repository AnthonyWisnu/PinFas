import { useEffect, useState } from 'react'
import { Download, FileDown, Receipt, TrendingUp, Wallet } from 'lucide-react'
import { GrafikPerBanjar } from '../../components/admin/GrafikPerBanjar'
import { GrafikTren } from '../../components/admin/GrafikTren'
import { KPICard } from '../../components/admin/KPICard'
import { ButtonPrimary } from '../../components/common/ButtonPrimary'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { useLaporan } from '../../hooks/useLaporan'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'

function currentMonthRange() {
  const now = new Date()
  const start = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return { tanggalMulai: start, tanggalSelesai: end.toISOString().slice(0, 10) }
}

export function LaporanPage() {
  const laporan = useLaporan()
  const { fetchLaporan } = laporan
  const [filters, setFilters] = useState(currentMonthRange)

  useEffect(() => {
    void fetchLaporan(filters)
  }, [fetchLaporan, filters])

  const setField = (field, value) => setFilters((current) => ({ ...current, [field]: value }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">Laporan</h1>
          <p className="mt-1 text-sm text-slate-600">Ringkasan transaksi selesai, pemasukan, denda, dan tren peminjaman.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonPrimary icon={Download} variant="secondary" onClick={() => laporan.exportExcel()}>
            Excel
          </ButtonPrimary>
          <ButtonPrimary icon={FileDown} variant="secondary" onClick={() => window.print()}>
            PDF
          </ButtonPrimary>
        </div>
      </div>
      <form className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_1fr_auto]">
        <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" type="date" value={filters.tanggalMulai} onChange={(e) => setField('tanggalMulai', e.target.value)} />
        <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" type="date" value={filters.tanggalSelesai} onChange={(e) => setField('tanggalSelesai', e.target.value)} />
        <ButtonPrimary type="button" onClick={() => fetchLaporan(filters)}>
          Terapkan
        </ButtonPrimary>
      </form>
      {laporan.loading ? <LoadingSpinner mode="section" /> : null}
      {laporan.error ? <EmptyState mode="error" title="Gagal Memuat Laporan" description={laporan.error} /> : null}
      {!laporan.loading && !laporan.error ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <KPICard icon={Receipt} label="Transaksi Selesai" value={laporan.kpi.totalTransaksi} />
            <KPICard icon={Wallet} label="Total Pemasukan" tone="accent" value={formatCurrency(laporan.kpi.totalPemasukan)} />
            <KPICard icon={TrendingUp} label="Total Denda" tone="secondary" value={formatCurrency(laporan.kpi.totalDenda)} />
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <GrafikTren data={laporan.tren} />
            <GrafikPerBanjar data={laporan.perBanjar} />
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-surface text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Nomor</th>
                    <th className="px-4 py-3">Aset</th>
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3">Biaya</th>
                    <th className="px-4 py-3">Denda</th>
                    <th className="px-4 py-3">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {laporan.transaksi.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-4 font-semibold text-primary">{item.nomorPengajuan}</td>
                      <td className="px-4 py-4 text-slate-600">{item.namaAset}</td>
                      <td className="px-4 py-4 text-slate-600">{formatDate(item.tanggalKembaliAktual)}</td>
                      <td className="px-4 py-4">{formatCurrency(item.totalBiaya)}</td>
                      <td className="px-4 py-4">{formatCurrency(item.dendaKeterlambatan)}</td>
                      <td className="px-4 py-4 font-semibold text-primary">{formatCurrency(item.totalPemasukan)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
