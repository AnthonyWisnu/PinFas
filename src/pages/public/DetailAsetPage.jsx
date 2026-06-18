import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, FileText } from 'lucide-react'
import { AssetGallery } from '../../components/aset/AssetGallery'
import { AssetInfo } from '../../components/aset/AssetInfo'
import { AvailabilityCalendar } from '../../components/aset/AvailabilityCalendar'
import { ChecklistKondisi } from '../../components/aset/ChecklistKondisi'
import { TarifCard } from '../../components/aset/TarifCard'
import { BadgeStatus } from '../../components/common/BadgeStatus'
import { EmptyState } from '../../components/common/EmptyState'
import { KalkulatorBiaya } from '../../components/common/KalkulatorBiaya'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { useAset } from '../../hooks/useAset'

export function DetailAsetPage() {
  const { id } = useParams()
  const { aset, banjarOptions, tanggalTerpakai, blacklistTanggal, loading, error, fetchAset } = useAset()
  const detail = aset.find((item) => item.id === id)

  if (loading) {
    return <LoadingSpinner mode="section" />
  }

  if (error) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-12">
        <EmptyState actionLabel="Coba Lagi" description={error} mode="error" onAction={fetchAset} title="Gagal Memuat Detail" />
      </section>
    )
  }

  if (!detail) {
    return (
      <section className="mx-auto max-w-5xl px-6 py-12">
        <EmptyState description="Aset yang Anda cari tidak tersedia atau sudah dihapus." title="Aset Tidak Ditemukan" />
      </section>
    )
  }

  const disabled = detail.statusAset === 'maintenance'

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <Link className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary" to="/">
        <ArrowLeft aria-hidden="true" size={16} />
        Kembali ke Katalog
      </Link>
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <AssetGallery aset={detail} />
          <AssetInfo aset={detail} />
          <ChecklistKondisi items={detail.checklistKondisi} />
          <Link
            className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-6 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
            to={`/aset/${detail.id}/riwayat`}
          >
            <FileText aria-hidden="true" size={16} />
            Lihat Riwayat Pemakaian
          </Link>
        </div>
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
            <BadgeStatus status={detail.statusAset} />
            <h2 className="mt-3 font-display text-xl font-bold text-primary">{detail.nama}</h2>
            <p className="mt-2 text-sm text-slate-600">
              {detail.kategoriPemilik === 'banjar' ? detail.banjar?.nama ?? 'Aset Banjar' : 'Aset Desa/Kelurahan'}
            </p>
          </div>
          <TarifCard aset={detail} />
          <KalkulatorBiaya aset={detail} banjarOptions={banjarOptions} />
          <AvailabilityCalendar
            asetId={detail.id}
            blacklistTanggal={blacklistTanggal}
            tanggalTerpakai={tanggalTerpakai}
          />
          {disabled ? (
            <div className="rounded-xl border border-[#FCD34D] bg-[#FEF3C7] p-4 text-sm font-semibold text-[#92400E]">
              Aset sedang maintenance dan belum bisa diajukan.
            </div>
          ) : (
            <Link
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-primary-mid"
              to={`/aset/${detail.id}/ajukan`}
            >
              <Calendar aria-hidden="true" size={16} />
              Ajukan Peminjaman
            </Link>
          )}
        </aside>
      </div>
    </section>
  )
}
