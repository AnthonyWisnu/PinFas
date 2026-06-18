import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, History } from 'lucide-react'
import { BadgeStatus } from '../../components/common/BadgeStatus'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import { useAset } from '../../hooks/useAset'

export function RiwayatAsetPage() {
  const { id } = useParams()
  const { fetchDetailAset, fetchRiwayatAset } = useAset({ autoFetch: false })
  const [aset, setAset] = useState(null)
  const [riwayat, setRiwayat] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    async function loadRiwayat() {
      setLoading(true)
      setError(null)
      const [detailResult, riwayatResult] = await Promise.all([fetchDetailAset(id), fetchRiwayatAset(id)])

      if (!active) return
      if (detailResult.error ?? riwayatResult.error) {
        setError(detailResult.error?.message ?? riwayatResult.error?.message)
      } else {
        setAset(detailResult.data)
        setRiwayat(riwayatResult.data)
      }
      setLoading(false)
    }

    void loadRiwayat()
    return () => {
      active = false
    }
  }, [fetchDetailAset, fetchRiwayatAset, id])

  if (loading) {
    return <LoadingSpinner mode="section" />
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <Link className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary" to={`/aset/${id}`}>
        <ArrowLeft aria-hidden="true" size={16} />
        Kembali ke Detail Aset
      </Link>
      <div className="mb-8">
        <p className="text-sm font-semibold text-accent-dark">Transparansi Pemakaian</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-primary">{aset?.nama ?? 'Riwayat Aset'}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Riwayat ini hanya menampilkan informasi penggunaan aset tanpa NIK, nomor HP, foto KTP, atau data pribadi warga.
        </p>
      </div>
      {error ? <EmptyState description={error} mode="error" title="Gagal Memuat Riwayat" /> : null}
      {!error && riwayat.length === 0 ? (
        <EmptyState icon={History} description="Belum ada pemakaian aset yang disetujui atau selesai." title="Belum Ada Riwayat" />
      ) : null}
      {!error && riwayat.length > 0 ? (
        <div className="space-y-4">
          {riwayat.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-display text-lg font-bold text-primary">{item.keperluan}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {formatDate(item.tanggalMulai)} sampai {formatDate(item.tanggalSelesai)} ({item.durasiHari} hari)
                  </p>
                </div>
                <BadgeStatus status={item.status} />
              </div>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-xl bg-surface p-3">
                  <span className="text-slate-500">Kategori tarif</span>
                  <p className="mt-1 font-semibold capitalize text-primary">{item.kategoriTarif.replace('_', ' ')}</p>
                </div>
                <div className="rounded-xl bg-surface p-3">
                  <span className="text-slate-500">Total biaya</span>
                  <p className="mt-1 font-mono font-semibold text-primary">{formatCurrency(item.totalBiaya)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}
