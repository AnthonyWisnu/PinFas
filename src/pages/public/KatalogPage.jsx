import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart2, Building2, CalendarCheck, Package } from 'lucide-react'
import { AssetCard } from '../../components/aset/AssetCard'
import { FilterBar } from '../../components/aset/FilterBar'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { useAset } from '../../hooks/useAset'

const initialFilters = {
  search: '',
  kategori: 'semua',
  statusBiaya: 'semua',
}

function StatItem({ icon, label, value }) {
  return (
    <div className="rounded-xl bg-white/10 px-4 py-3">
      {icon}
      <p className="mt-2 font-display text-2xl font-black">{value}</p>
      <p className="text-xs text-white/70">{label}</p>
    </div>
  )
}

export function KatalogPage() {
  const { aset, banjarOptions, statistik, tanggalTerpakai, loading, error, fetchAset } = useAset()
  const [filters, setFilters] = useState(initialFilters)

  const filteredAset = useMemo(() => {
    const keyword = filters.search.trim().toLowerCase()

    return aset.filter((item) => {
      const matchSearch = !keyword || item.nama.toLowerCase().includes(keyword) || item.lokasi?.toLowerCase().includes(keyword)
      const matchKategori =
        filters.kategori === 'semua' ||
        (filters.kategori === 'desa' && item.kategoriPemilik === 'desa') ||
        item.banjarId === filters.kategori
      const matchBiaya = filters.statusBiaya === 'semua' || item.statusBiaya === filters.statusBiaya

      return matchSearch && matchKategori && matchBiaya
    })
  }, [aset, filters])

  const currentMonthUsage = useMemo(() => {
    const now = new Date()
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    return tanggalTerpakai.filter((item) => item.tanggalMulai.startsWith(monthKey)).length
  }, [tanggalTerpakai])

  return (
    <>
      <section className="bg-gradient-to-br from-primary via-primary-mid to-accent px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <span className="rounded-full bg-accent/20 px-4 py-2 text-xs font-bold text-accent">Layanan Publik Digital</span>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-black leading-tight">
              Pinjam Fasilitas Desa atau Kelurahan dengan Mudah
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/80">
              Cari aset, cek biaya, lihat ketersediaan, lalu ajukan peminjaman tanpa wajib membuat akun.
            </p>
            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
              <StatItem icon={<Package aria-hidden="true" className="mx-auto text-accent" size={20} />} label="Aset tersedia" value={statistik.tersedia} />
              <StatItem icon={<CalendarCheck aria-hidden="true" className="mx-auto text-accent" size={20} />} label="Penyewaan bulan ini" value={currentMonthUsage} />
              <StatItem icon={<Building2 aria-hidden="true" className="mx-auto text-accent" size={20} />} label="Total aset" value={statistik.total} />
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl space-y-6 px-6 py-10">
        <FilterBar banjarOptions={banjarOptions} filters={filters} onChange={setFilters} />
        {loading ? <LoadingSpinner mode="section" /> : null}
        {error ? (
          <EmptyState
            actionLabel="Coba Lagi"
            description={error}
            icon={BarChart2}
            mode="error"
            onAction={fetchAset}
            title="Gagal Memuat Katalog"
          />
        ) : null}
        {!loading && !error && filteredAset.length === 0 ? (
          <EmptyState
            actionLabel="Reset Filter"
            description="Tidak ada aset yang cocok dengan filter saat ini."
            onAction={() => setFilters(initialFilters)}
            title="Aset Tidak Ditemukan"
          />
        ) : null}
        {!loading && !error && filteredAset.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAset.map((item) => (
              <AssetCard key={item.id} aset={item} />
            ))}
          </div>
        ) : null}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
          Ingin mengecek pengajuan lama?{' '}
          <Link className="font-semibold text-primary underline underline-offset-4" to="/lacak">
            Lacak status pengajuan
          </Link>
        </div>
      </section>
    </>
  )
}
