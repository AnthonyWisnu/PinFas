import { useEffect } from 'react'
import { Building2, CalendarCheck, Wallet } from 'lucide-react'
import { GrafikPerBanjar } from '../../components/admin/GrafikPerBanjar'
import { GrafikTren } from '../../components/admin/GrafikTren'
import { KPICard } from '../../components/admin/KPICard'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { useLaporan } from '../../hooks/useLaporan'
import { formatCurrency } from '../../utils/formatCurrency'

export function LaporanPublikPage() {
  const laporan = useLaporan()
  const { fetchLaporanPublik } = laporan

  useEffect(() => {
    void fetchLaporanPublik()
  }, [fetchLaporanPublik])

  const data = laporan.laporanPublik

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-6 py-12">
      <div>
        <h1 className="font-display text-3xl font-bold text-primary">Laporan Publik</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Transparansi penggunaan fasilitas publik dalam bentuk agregat tanpa data pribadi warga.
        </p>
      </div>
      {laporan.loading ? <LoadingSpinner mode="section" /> : null}
      {laporan.error ? <EmptyState mode="error" title="Gagal Memuat Laporan Publik" description={laporan.error} /> : null}
      {data ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <KPICard icon={Wallet} label="Total Pemasukan" tone="accent" value={formatCurrency(data.kpi.totalPemasukan)} />
            <KPICard icon={CalendarCheck} label="Total Penyewaan" value={data.kpi.totalPenyewaan ?? 0} />
            <KPICard icon={Building2} label="Pemasukan Bulan Ini" tone="secondary" value={formatCurrency(data.kpi.pemasukanBulanIni)} />
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <GrafikTren data={data.tren} title="Tren Penyewaan Publik" />
            <GrafikPerBanjar data={data.perBanjar} title="Pemasukan per Wilayah" />
          </div>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-display text-xl font-bold text-primary">Aset Paling Sering Dipinjam</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-surface text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Aset</th>
                    <th className="px-4 py-3">Total Penyewaan</th>
                    <th className="px-4 py-3">Total Pemasukan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.perAset.map((item) => (
                    <tr key={item.aset_id}>
                      <td className="px-4 py-4 font-semibold text-primary">{item.nama_aset}</td>
                      <td className="px-4 py-4 text-slate-600">{item.total_penyewaan}</td>
                      <td className="px-4 py-4 text-slate-600">{formatCurrency(item.total_pemasukan)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}
    </section>
  )
}
