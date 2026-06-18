import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck, CreditCard, FileText, Package, TrendingUp } from 'lucide-react'
import { KalenderGabungan } from '../../components/admin/KalenderGabungan'
import { KPICard } from '../../components/admin/KPICard'
import { ModalApprove } from '../../components/admin/ModalApprove'
import { ModalKonfirmasiBayar } from '../../components/admin/ModalKonfirmasiBayar'
import { ModalPaksaBatal } from '../../components/admin/ModalPaksaBatal'
import { ModalPengembalian } from '../../components/admin/ModalPengembalian'
import { ModalReject } from '../../components/admin/ModalReject'
import { TabelPengajuan } from '../../components/admin/TabelPengajuan'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { useAdmin } from '../../hooks/useAdmin'
import { useAppContext } from '../../hooks/useAppContext'
import { formatCurrency } from '../../utils/formatCurrency'

export function DasborPage() {
  const { state } = useAppContext()
  const admin = useAdmin()
  const { fetchDashboard, flagTerlambat } = admin
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function load() {
      await flagTerlambat()
      await fetchDashboard()
    }
    void load()
  }, [fetchDashboard, flagTerlambat])

  const actionItems = useMemo(
    () => admin.pengajuan.filter((item) => ['pending', 'menunggu_konfirmasi_bayar'].includes(item.status)).slice(0, 6),
    [admin.pengajuan],
  )

  const openModal = (type, item) => {
    setMessage('')
    setSelected(item)
    setModal(type)
  }

  const closeModal = () => {
    setModal(null)
    setSelected(null)
  }

  const handleResult = async (callback) => {
    const result = await callback()
    if (result?.error) {
      setMessage(result.error.message)
      return
    }
    await admin.fetchDashboard()
    closeModal()
  }

  const isLurah = state.currentUser?.role === 'lurah'

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">Dashboard Admin</h1>
          <p className="mt-1 text-sm text-slate-600">Ringkasan pengajuan, jadwal, dan status operasional aset.</p>
        </div>
        {isLurah ? (
          <Link className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white" to="/admin/laporan">
            Buka Laporan
          </Link>
        ) : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <KPICard icon={FileText} label="Total Pengajuan" value={admin.kpi.total} />
        <KPICard icon={CalendarCheck} label="Menunggu Verifikasi" tone="accent" value={admin.kpi.pending} />
        <KPICard icon={CreditCard} label="Konfirmasi Bayar" tone="secondary" value={admin.kpi.konfirmasiBayar} />
        <KPICard icon={Package} label="Approved Bulan Ini" value={admin.kpi.approvedBulanIni} />
        <KPICard icon={TrendingUp} label="Pemasukan Bulan Ini" tone="accent" value={formatCurrency(admin.kpi.pemasukanBulanIni)} />
      </div>
      {admin.loading ? <LoadingSpinner mode="section" /> : null}
      {admin.error ? <EmptyState mode="error" title="Gagal Memuat Dashboard" description={admin.error} /> : null}
      {!admin.loading && !admin.error ? (
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.55fr)]">
          <section className="min-w-0 space-y-4">
            <h2 className="font-display text-xl font-bold text-primary">Butuh Tindakan</h2>
            <TabelPengajuan
              canProcess={admin.canProcess}
              items={actionItems}
              readOnly={isLurah}
              onApprove={(item) => openModal('approve', item)}
              onBatal={(item) => openModal('batal', item)}
              onBayar={(item) => openModal('bayar', item)}
              onKembali={(item) => openModal('kembali', item)}
              onReject={(item) => openModal('reject', item)}
            />
          </section>
          <KalenderGabungan className="min-w-0" items={admin.pengajuan} />
        </div>
      ) : null}
      {message ? <p className="rounded-xl bg-[#FEE2E2] px-4 py-3 text-sm font-semibold text-[#9B1C1C]">{message}</p> : null}
      <ModalApprove open={modal === 'approve'} pengajuan={selected} loading={admin.loading} onClose={closeModal} onConfirm={() => handleResult(() => admin.approve(selected))} />
      <ModalReject open={modal === 'reject'} templates={admin.templates} loading={admin.loading} onClose={closeModal} onConfirm={(input) => handleResult(() => admin.reject(selected, input))} />
      <ModalKonfirmasiBayar open={modal === 'bayar'} pengajuan={selected} loading={admin.loading} onClose={closeModal} onConfirm={(input) => handleResult(() => admin.verifikasiBayar(selected, input))} />
      <ModalPaksaBatal open={modal === 'batal'} loading={admin.loading} onClose={closeModal} onConfirm={(alasan) => handleResult(() => admin.paksaBatal(selected, alasan))} />
      <ModalPengembalian open={modal === 'kembali'} pengajuan={selected} konfigurasi={state.konfigurasi} loading={admin.loading} onClose={closeModal} onConfirm={(input) => handleResult(() => admin.konfirmasiPengembalian(selected, input))} />
    </div>
  )
}
