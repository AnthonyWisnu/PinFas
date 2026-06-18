import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { EmptyState } from '../common/EmptyState'
import { formatCurrency } from '../../utils/formatCurrency'

function formatMonth(value) {
  const [year, month] = String(value).split('-')
  return `${month}/${year}`
}

export function GrafikTren({ data = [], title = 'Tren Peminjaman' }) {
  if (data.length === 0) {
    return <EmptyState className="rounded-2xl border border-slate-200 bg-white" title="Belum Ada Tren" description="Data selesai akan membentuk grafik bulanan." />
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Grafik</p>
        <h2 className="font-display text-xl font-bold text-primary">{title}</h2>
      </div>
      <div className="h-72 overflow-hidden">
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart data={data} margin={{ left: -12, right: 16, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="trenPemasukan" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#D4A017" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#D4A017" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
            <XAxis dataKey="bulan" tickFormatter={formatMonth} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} width={44} />
            <Tooltip
              formatter={(value, name) => (name === 'totalPemasukan' ? formatCurrency(value) : value)}
              labelFormatter={(value) => `Bulan ${formatMonth(value)}`}
            />
            <Area dataKey="totalPemasukan" fill="url(#trenPemasukan)" name="totalPemasukan" stroke="#D4A017" strokeWidth={3} type="monotone" />
            <Area dataKey="totalPenyewaan" fill="#1E6F5C22" name="totalPenyewaan" stroke="#1E6F5C" strokeWidth={2} type="monotone" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
