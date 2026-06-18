import { useEffect, useState } from 'react'
import { Edit, Plus, Power } from 'lucide-react'
import { BadgeStatus } from '../../components/common/BadgeStatus'
import { ButtonPrimary } from '../../components/common/ButtonPrimary'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { useAppContext } from '../../hooks/useAppContext'
import { useKonfigurasi } from '../../hooks/useKonfigurasi'

const emptyForm = {
  email: '',
  password: '',
  nama: '',
  jabatan: '',
  role: 'kelian_banjar',
  banjarId: '',
  isActive: true,
}

export function ManajemenAkunPage() {
  const { state } = useAppContext()
  const konfigurasi = useKonfigurasi()
  const { fetchAdminAccounts } = konfigurasi
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    void fetchAdminAccounts()
  }, [fetchAdminAccounts])

  if (state.currentUser?.role !== 'admin_desa') {
    return <EmptyState mode="error" title="Akses Ditolak" description="Manajemen akun hanya dapat dibuka Admin Desa." />
  }

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const openCreate = () => {
    setForm(emptyForm)
    setFormOpen(true)
    setMessage('')
  }

  const openEdit = (account) => {
    setForm({ ...emptyForm, ...account, password: '' })
    setFormOpen(true)
    setMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    const result = await konfigurasi.simpanAdminAccount(form)
    setSaving(false)
    setMessage(result.error ? result.error.message : 'Akun petugas berhasil disimpan.')
    if (!result.error) setFormOpen(false)
  }

  const toggleActive = async (account) => {
    if (account.id === state.currentUser.id) {
      setMessage('Akun yang sedang digunakan tidak boleh dinonaktifkan.')
      return
    }
    const result = await konfigurasi.toggleAdminActive(account)
    setMessage(result.error ? result.error.message : 'Status akun diperbarui.')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">Manajemen Akun</h1>
          <p className="mt-1 text-sm text-slate-600">Kelola akun Kelian Banjar, Admin Desa, dan Lurah.</p>
        </div>
        <ButtonPrimary icon={Plus} onClick={openCreate}>Tambah Akun</ButtonPrimary>
      </div>
      {message ? <p className="rounded-xl bg-secondary-pale px-4 py-3 text-sm font-semibold text-secondary">{message}</p> : null}
      {konfigurasi.loading ? <LoadingSpinner mode="section" /> : null}
      {!konfigurasi.loading ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-surface text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Banjar</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {konfigurasi.adminAccounts.map((account) => (
                  <tr key={account.id}>
                    <td className="px-4 py-4 font-semibold text-primary">{account.nama}</td>
                    <td className="px-4 py-4 text-slate-600">{account.email ?? '-'}</td>
                    <td className="px-4 py-4 text-slate-600">{account.role}</td>
                    <td className="px-4 py-4 text-slate-600">{account.banjar?.nama ?? '-'}</td>
                    <td className="px-4 py-4"><BadgeStatus status={account.isActive ? 'approved' : 'dibatalkan'} label={account.isActive ? 'Aktif' : 'Nonaktif'} /></td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <ButtonPrimary icon={Edit} size="sm" variant="secondary" onClick={() => openEdit(account)}>Edit</ButtonPrimary>
                        <ButtonPrimary disabled={account.id === state.currentUser.id} icon={Power} size="sm" variant="ghost" onClick={() => toggleActive(account)}>
                          {account.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                        </ButtonPrimary>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
      {formOpen ? (
        <form className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
          <h2 className="font-display text-xl font-bold text-primary">{form.id ? 'Edit Akun' : 'Tambah Akun'}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-semibold text-primary">Email<input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" disabled={Boolean(form.id)} required type="email" value={form.email ?? ''} onChange={(e) => setField('email', e.target.value)} /></label>
            {!form.id ? <label className="text-sm font-semibold text-primary">Password Awal<input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" minLength={8} required type="password" value={form.password} onChange={(e) => setField('password', e.target.value)} /></label> : null}
            <label className="text-sm font-semibold text-primary">Nama<input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" required value={form.nama} onChange={(e) => setField('nama', e.target.value)} /></label>
            <label className="text-sm font-semibold text-primary">Jabatan<input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" required value={form.jabatan} onChange={(e) => setField('jabatan', e.target.value)} /></label>
            <label className="text-sm font-semibold text-primary">Role<select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={form.role} onChange={(e) => setField('role', e.target.value)}><option value="kelian_banjar">Kelian Banjar</option><option value="admin_desa">Admin Desa</option><option value="lurah">Lurah/Kades</option></select></label>
            {form.role === 'kelian_banjar' ? (
              <label className="text-sm font-semibold text-primary">Banjar<select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" required value={form.banjarId ?? ''} onChange={(e) => setField('banjarId', e.target.value)}><option value="">Pilih Banjar</option>{konfigurasi.banjarOptions.map((banjar) => <option key={banjar.id} value={banjar.id}>{banjar.nama}</option>)}</select></label>
            ) : null}
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <ButtonPrimary variant="secondary" onClick={() => setFormOpen(false)}>Batal</ButtonPrimary>
            <ButtonPrimary loading={saving} type="submit">Simpan Akun</ButtonPrimary>
          </div>
        </form>
      ) : null}
    </div>
  )
}
