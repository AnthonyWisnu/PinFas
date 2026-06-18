import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { EmptyState } from '../common/EmptyState'
import { formatCurrency } from '../../utils/formatCurrency'

export function GrafikPerBanjar({ data = [], title = 'Pemasukan per Banjar' }) {
  const hasPemasukan = data.some((item) => Number(item.totalPemasukan ?? 0) > 0)

  if (data.length === 0 || !hasPemasukan) {
    return <EmptyState className="rounded-2xl border border-slate-200 bg-white" title="Belum Ada Data Banjar" description="Transaksi selesai akan muncul sebagai perbandingan pemasukan." />
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Grafik</p>
        <h2 className="font-display text-xl font-bold text-primary">{title}</h2>
      </div>
      <div className="h-72 overflow-hidden">
        <ResponsiveContainer height="100%" width="100%">
          <BarChart data={data} layout="vertical" margin={{ left: -8, right: 16, top: 10, bottom: 0 }}>
            <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
            <XAxis tick={{ fontSize: 12 }} tickFormatter={(value) => formatCurrency(value)} type="number" />
            <YAxis dataKey="namaBanjar" tick={{ fontSize: 12 }} type="category" width={112} />
            <Tooltip cursor={{ fill: 'transparent' }} formatter={(value) => formatCurrency(value)} />
            <Bar dataKey="totalPemasukan" fill="#1E6F5C" name="Pemasukan" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
