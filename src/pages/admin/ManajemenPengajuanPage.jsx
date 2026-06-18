import { useEffect, useMemo, useState } from 'react'
import { Filter } from 'lucide-react'
import { ModalApprove } from '../../components/admin/ModalApprove'
import { ModalKonfirmasiBayar } from '../../components/admin/ModalKonfirmasiBayar'
import { ModalPaksaBatal } from '../../components/admin/ModalPaksaBatal'
import { ModalPengembalian } from '../../components/admin/ModalPengembalian'
import { ModalReject } from '../../components/admin/ModalReject'
import { PencocokkanData } from '../../components/admin/PencocokkanData'
import { TabelPengajuan } from '../../components/admin/TabelPengajuan'
import { ButtonPrimary } from '../../components/common/ButtonPrimary'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { useAdmin } from '../../hooks/useAdmin'
import { useAppContext } from '../../hooks/useAppContext'
import { useAset } from '../../hooks/useAset'

const initialFilters = {
  status: 'semua',
  asetId: 'semua',
  tanggalMulai: '',
  tanggalSelesai: '',
  keyword: '',
  banjarAsal: '',
}

const statusOptions = ['semua', 'pending', 'menunggu_pembayaran', 'menunggu_konfirmasi_bayar', 'approved', 'terlambat', 'selesai', 'rejected', 'dibatalkan']

export function ManajemenPengajuanPage() {
  const { state } = useAppContext()
  const { aset } = useAset()
  const admin = useAdmin()
  const { fetchPengajuan, fetchTemplates, flagTerlambat } = admin
  const [filters, setFilters] = useState(initialFilters)
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function load() {
      await flagTerlambat()
      await fetchTemplates()
      await fetchPengajuan(initialFilters)
    }
    void load()
  }, [fetchPengajuan, fetchTemplates, flagTerlambat])

  const readOnly = state.currentUser?.role === 'lurah'
  const visibleAset = useMemo(() => {
    if (state.currentUser?.role !== 'kelian_banjar') return aset
    return aset.filter((item) => item.kategoriPemilik === 'banjar' && item.banjarId === state.currentUser.banjarId)
  }, [aset, state.currentUser])

  const setField = (field, value) => setFilters((current) => ({ ...current, [field]: value }))

  const refresh = () => fetchPengajuan(filters)

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
    await refresh()
    closeModal()
  }

  const handleFilter = async (event) => {
    event.preventDefault()
    await refresh()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-primary">Manajemen Pengajuan</h1>
        <p className="mt-1 text-sm text-slate-600">Filter, cocokkan data, dan proses status pengajuan fasilitas.</p>
      </div>
      <form className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-3 xl:grid-cols-6" onSubmit={handleFilter}>
        <select className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={filters.status} onChange={(e) => setField('status', e.target.value)}>
          {statusOptions.map((status) => (
            <option key={status} value={status}>{status === 'semua' ? 'Semua Status' : status}</option>
          ))}
        </select>
        <select className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={filters.asetId} onChange={(e) => setField('asetId', e.target.value)}>
          <option value="semua">Semua Aset</option>
          {visibleAset.map((item) => (
            <option key={item.id} value={item.id}>{item.nama}</option>
          ))}
        </select>
        <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" type="date" value={filters.tanggalMulai} onChange={(e) => setField('tanggalMulai', e.target.value)} />
        <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" type="date" value={filters.tanggalSelesai} onChange={(e) => setField('tanggalSelesai', e.target.value)} />
        <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Nama atau NIK" value={filters.keyword} onChange={(e) => setField('keyword', e.target.value)} />
        <ButtonPrimary icon={Filter} type="submit">Filter</ButtonPrimary>
      </form>
      {message ? <p className="rounded-xl bg-[#FEE2E2] px-4 py-3 text-sm font-semibold text-[#9B1C1C]">{message}</p> : null}
      {selected ? <PencocokkanData pengajuan={selected} /> : null}
      {admin.loading ? <LoadingSpinner mode="section" /> : null}
      {admin.error ? <EmptyState mode="error" title="Gagal Memuat Pengajuan" description={admin.error} /> : null}
      {!admin.loading && !admin.error ? (
        <TabelPengajuan
          canProcess={admin.canProcess}
          items={admin.pengajuan}
          readOnly={readOnly}
          onApprove={(item) => openModal('approve', item)}
          onBatal={(item) => openModal('batal', item)}
          onBayar={(item) => openModal('bayar', item)}
          onKembali={(item) => openModal('kembali', item)}
          onReject={(item) => openModal('reject', item)}
        />
      ) : null}
      <ModalApprove open={modal === 'approve'} pengajuan={selected} loading={admin.loading} onClose={closeModal} onConfirm={() => handleResult(() => admin.approve(selected))} />
      <ModalReject open={modal === 'reject'} templates={admin.templates} loading={admin.loading} onClose={closeModal} onConfirm={(input) => handleResult(() => admin.reject(selected, input))} />
      <ModalKonfirmasiBayar open={modal === 'bayar'} pengajuan={selected} loading={admin.loading} onClose={closeModal} onConfirm={(input) => handleResult(() => admin.verifikasiBayar(selected, input))} />
      <ModalPaksaBatal open={modal === 'batal'} loading={admin.loading} onClose={closeModal} onConfirm={(alasan) => handleResult(() => admin.paksaBatal(selected, alasan))} />
      <ModalPengembalian open={modal === 'kembali'} pengajuan={selected} konfigurasi={state.konfigurasi} loading={admin.loading} onClose={closeModal} onConfirm={(input) => handleResult(() => admin.konfirmasiPengembalian(selected, input))} />
    </div>
  )
}
