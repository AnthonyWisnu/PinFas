import { useMemo, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { FormAset } from '../../components/admin/FormAset'
import { TabelAset } from '../../components/admin/TabelAset'
import { ButtonPrimary } from '../../components/common/ButtonPrimary'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { useAppContext } from '../../hooks/useAppContext'
import { useAset } from '../../hooks/useAset'

export function ManajemenAsetPage() {
  const { state } = useAppContext()
  const { aset, banjarOptions, loading, error, fetchAset, simpanAset, toggleMaintenance, hapusAset, uploadFotoAset } = useAset()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const readOnly = state.currentUser?.role === 'lurah'
  const visibleAset = useMemo(() => {
    if (state.currentUser?.role !== 'kelian_banjar') return aset
    return aset.filter((item) => item.kategoriPemilik === 'banjar' && item.banjarId === state.currentUser.banjarId)
  }, [aset, state.currentUser])

  const openCreate = () => {
    setMessage('')
    setEditing(state.currentUser?.role === 'kelian_banjar' ? { kategoriPemilik: 'banjar', banjarId: state.currentUser.banjarId } : null)
    setFormOpen(true)
  }

  const handleSubmit = async (input) => {
    setSaving(true)
    const payload =
      state.currentUser?.role === 'kelian_banjar'
        ? { ...input, kategoriPemilik: 'banjar', banjarId: state.currentUser.banjarId }
        : input
    const result = await simpanAset(payload)
    setSaving(false)
    if (result.error) {
      setMessage(result.error.message)
      return
    }
    setFormOpen(false)
    setEditing(null)
    await fetchAset()
  }

  const handleDelete = async (id) => {
    setMessage('')
    const result = await hapusAset(id)
    if (result.error) setMessage(result.error.message)
  }

  const handleUploadFoto = async (file) => {
    const folder = editing?.id ?? 'draft'
    return uploadFotoAset(file, folder)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">Manajemen Aset</h1>
          <p className="mt-1 text-sm text-slate-600">Kelola fasilitas Desa/Kelurahan dan Banjar sesuai hak akses.</p>
        </div>
        <ButtonPrimary disabled={readOnly} icon={Plus} onClick={openCreate}>
          Tambah Aset
        </ButtonPrimary>
      </div>
      {message ? <p className="rounded-xl bg-[#FEE2E2] px-4 py-3 text-sm font-semibold text-[#9B1C1C]">{message}</p> : null}
      {loading ? <LoadingSpinner mode="section" /> : null}
      {error ? <EmptyState mode="error" title="Gagal Memuat Aset" description={error} actionLabel="Coba Lagi" onAction={fetchAset} /> : null}
      {!loading && !error ? (
        <TabelAset
          items={visibleAset}
          readOnly={readOnly}
          onDelete={handleDelete}
          onEdit={(item) => {
            setEditing(item)
            setFormOpen(true)
          }}
          onToggleMaintenance={toggleMaintenance}
        />
      ) : null}
      {formOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 p-4">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="font-display text-xl font-bold text-primary">{editing?.id ? 'Edit Aset' : 'Tambah Aset'}</h2>
              <ButtonPrimary icon={X} variant="icon" onClick={() => setFormOpen(false)}>
                Tutup
              </ButtonPrimary>
            </div>
            <FormAset
              banjarOptions={banjarOptions}
              initialData={editing}
              loading={saving}
              onCancel={() => setFormOpen(false)}
              onSubmit={handleSubmit}
              onUploadFoto={handleUploadFoto}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
