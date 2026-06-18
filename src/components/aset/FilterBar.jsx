import { Search, SlidersHorizontal } from 'lucide-react'

export function FilterBar({ filters, banjarOptions = [], onChange }) {
  const update = (key, value) => onChange({ ...filters, [key]: value })

  return (
    <section className="sticky top-16 z-30 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr_1fr]">
        <label className="relative">
          <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Cari nama fasilitas"
            value={filters.search}
            onChange={(event) => update('search', event.target.value)}
          />
        </label>
        <label className="relative">
          <SlidersHorizontal aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm" value={filters.kategori} onChange={(event) => update('kategori', event.target.value)}>
            <option value="semua">Semua Kategori</option>
            <option value="desa">Aset Desa/Kelurahan</option>
            {banjarOptions.map((banjar) => (
              <option key={banjar.id} value={banjar.id}>{banjar.nama}</option>
            ))}
          </select>
        </label>
        <select className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm" value={filters.statusBiaya} onChange={(event) => update('statusBiaya', event.target.value)}>
          <option value="semua">Semua Biaya</option>
          <option value="gratis">Gratis</option>
          <option value="berbayar">Berbayar</option>
        </select>
      </div>
    </section>
  )
}
