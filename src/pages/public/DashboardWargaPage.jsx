import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { WargaDashboardCard } from '../../components/warga/WargaDashboardCard'
import { WargaRiwayatList } from '../../components/warga/WargaRiwayatList'
import { ButtonPrimary } from '../../components/common/ButtonPrimary'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { useAppContext } from '../../hooks/useAppContext'
import { useWargaAuth } from '../../hooks/useWargaAuth'
import { usePengajuan } from '../../hooks/usePengajuan'

export function DashboardWargaPage() {
  const {
    state: { currentCitizen, citizenAuthLoading, konfigurasi },
  } = useAppContext()
  const { fetchRiwayatWarga, keluar, loading } = useWargaAuth()
  const { uploadBuktiTransfer, batalkanPending, fetchDetailSurat } = usePengajuan()
  const [riwayat, setRiwayat] = useState([])
  const [pageLoading, setPageLoading] = useState(true)

  const loadRiwayat = useCallback(async () => {
    if (!currentCitizen) return
    setPageLoading(true)
    const result = await fetchRiwayatWarga(currentCitizen)
    setRiwayat(result.data)
    setPageLoading(false)
  }, [currentCitizen, fetchRiwayatWarga])

  useEffect(() => {
    void loadRiwayat()
  }, [loadRiwayat])

  const stats = useMemo(() => ({
    total: riwayat.length,
    menunggu: riwayat.filter((item) => ['pending', 'menunggu_pembayaran', 'menunggu_konfirmasi_bayar'].includes(item.status)).length,
    disetujui: riwayat.filter((item) => item.status === 'approved').length,
    selesai: riwayat.filter((item) => item.status === 'selesai').length,
  }), [riwayat])

  if (citizenAuthLoading) return <LoadingSpinner mode="fullscreen" />
  if (!currentCitizen) return <Navigate replace to="/masuk-warga" />

  const handleUploadBukti = async (item, file) => {
    if (!file) return
    await uploadBuktiTransfer({ pengajuan: item, identifier: currentCitizen.nik, file })
    await loadRiwayat()
  }

  const handleBatalkan = async (item) => {
    await batalkanPending({ pengajuan: item, identifier: currentCitizen.nik })
    await loadRiwayat()
  }

  const handleMuatSurat = (item) =>
    fetchDetailSurat({
      nomorPengajuan: item.nomorPengajuan,
      identifier: currentCitizen.nik,
    })

  return (
    <>
      <section className="bg-gradient-to-br from-primary via-primary-mid to-accent px-6 py-12 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-display text-3xl font-black">Dashboard Warga</h1>
          <p className="mt-2 text-sm text-white/80">Kelola riwayat pengajuan pribadi Anda.</p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl space-y-6 px-6 py-8">
        <WargaDashboardCard profile={currentCitizen} stats={stats} />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-xl font-bold text-primary">Riwayat Pengajuan Saya</h2>
          <div className="flex gap-3">
            <Link className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white" to="/">Ajukan Peminjaman</Link>
            <ButtonPrimary loading={loading} variant="ghost" onClick={keluar}>Keluar</ButtonPrimary>
          </div>
        </div>
        {pageLoading ? (
          <LoadingSpinner mode="section" />
        ) : (
          <WargaRiwayatList
            items={riwayat}
            konfigurasi={konfigurasi}
            loading={loading}
            verificationBaseUrl={window.location.origin}
            onBatalkan={handleBatalkan}
            onMuatSurat={handleMuatSurat}
            onUploadBukti={handleUploadBukti}
          />
        )}
      </section>
    </>
  )
}
