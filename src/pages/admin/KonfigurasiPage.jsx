import { useEffect, useState } from 'react'
import { Save, Trash2, Upload } from 'lucide-react'
import { ButtonPrimary } from '../../components/common/ButtonPrimary'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { useAppContext } from '../../hooks/useAppContext'
import { useKonfigurasi } from '../../hooks/useKonfigurasi'

const emptyForm = {
  tipeInstansi: 'desa',
  namaInstansi: '',
  alamat: '',
  nomorTelepon: '',
  logoUrl: '',
  rekeningBank: '',
  rekeningNomor: '',
  rekeningAtasNama: '',
  batasHariGratisLokal: 3,
  batasHariGratisLuar: 1,
  minimalHariPengajuan: 3,
  tarifDendaGratis: 50000,
}

export function KonfigurasiPage() {
  const { state } = useAppContext()
  const konfigurasi = useKonfigurasi()
  const [form, setForm] = useState(emptyForm)
  const [blacklist, setBlacklist] = useState({ tanggal: '', keterangan: '' })
  const [template, setTemplate] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (konfigurasi.konfigurasi) setForm({ ...emptyForm, ...konfigurasi.konfigurasi })
  }, [konfigurasi.konfigurasi])

  if (state.currentUser?.role !== 'admin_desa') {
    return <EmptyState mode="error" title="Akses Ditolak" description="Konfigurasi hanya dapat diubah Admin Desa." />
  }

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    const result = await konfigurasi.updateKonfigurasi(form)
    setSaving(false)
    setMessage(result.error ? result.error.message : 'Konfigurasi berhasil disimpan.')
  }

  const handleLogo = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setSaving(true)
    const upload = await konfigurasi.uploadLogo(file)
    setSaving(false)
    if (upload.error) setMessage(upload.error.message)
    else setField('logoUrl', upload.data)
  }

  const tambahBlacklist = async () => {
    if (!blacklist.tanggal) return
    const result = await konfigurasi.tambahBlacklistTanggal({ ...blacklist, createdBy: state.currentUser.id })
    if (!result.error) setBlacklist({ tanggal: '', keterangan: '' })
    setMessage(result.error ? result.error.message : 'Tanggal blacklist ditambahkan.')
  }

  const tambahTemplate = async () => {
    if (!template.trim()) return
    const result = await konfigurasi.tambahTemplateAlasan(template.trim())
    if (!result.error) setTemplate('')
    setMessage(result.error ? result.error.message : 'Template alasan ditambahkan.')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-primary">Konfigurasi</h1>
        <p className="mt-1 text-sm text-slate-600">Profil instansi, rekening, aturan peminjaman, blacklist, dan template alasan.</p>
      </div>
      {konfigurasi.loading ? <LoadingSpinner mode="section" /> : null}
      {message ? <p className="rounded-xl bg-secondary-pale px-4 py-3 text-sm font-semibold text-secondary">{message}</p> : null}
      {!konfigurasi.loading ? (
        <form className="grid gap-6 xl:grid-cols-[1fr_0.8fr]" onSubmit={handleSave}>
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-display text-xl font-bold text-primary">Profil dan Rekening</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-semibold text-primary">
                Tipe Instansi
                <select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={form.tipeInstansi} onChange={(e) => setField('tipeInstansi', e.target.value)}>
                  <option value="desa">Desa</option>
                  <option value="kelurahan">Kelurahan</option>
                </select>
              </label>
              <label className="text-sm font-semibold text-primary">Nama Instansi<input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={form.namaInstansi} onChange={(e) => setField('namaInstansi', e.target.value)} /></label>
              <label className="text-sm font-semibold text-primary">Nomor Telepon<input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={form.nomorTelepon ?? ''} onChange={(e) => setField('nomorTelepon', e.target.value)} /></label>
              <label className="text-sm font-semibold text-primary">Bank<input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={form.rekeningBank ?? ''} onChange={(e) => setField('rekeningBank', e.target.value)} /></label>
              <label className="text-sm font-semibold text-primary">Nomor Rekening<input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={form.rekeningNomor ?? ''} onChange={(e) => setField('rekeningNomor', e.target.value)} /></label>
              <label className="text-sm font-semibold text-primary">Atas Nama<input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={form.rekeningAtasNama ?? ''} onChange={(e) => setField('rekeningAtasNama', e.target.value)} /></label>
            </div>
            <label className="block text-sm font-semibold text-primary">Alamat<textarea className="mt-1 min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2" value={form.alamat ?? ''} onChange={(e) => setField('alamat', e.target.value)} /></label>
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-primary px-5 py-2 text-sm font-semibold text-primary">
                <Upload aria-hidden="true" size={16} />
                Upload Logo
                <input className="sr-only" accept="image/*" type="file" onChange={handleLogo} />
              </label>
              <span className="max-w-xs truncate text-xs text-slate-500">{form.logoUrl || 'Belum ada logo'}</span>
            </div>
            <h2 className="font-display text-xl font-bold text-primary">Aturan Peminjaman</h2>
            <div className="grid gap-4 md:grid-cols-4">
              {[
                ['batasHariGratisLokal', 'Gratis Lokal'],
                ['batasHariGratisLuar', 'Gratis Luar'],
                ['minimalHariPengajuan', 'Minimal H'],
                ['tarifDendaGratis', 'Denda Gratis'],
              ].map(([field, label]) => (
                <label key={field} className="text-sm font-semibold text-primary">{label}<input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" min="0" type="number" value={form[field] ?? 0} onChange={(e) => setField(field, Number(e.target.value))} /></label>
              ))}
            </div>
            <ButtonPrimary icon={Save} loading={saving} type="submit">Simpan Konfigurasi</ButtonPrimary>
          </section>
          <aside className="space-y-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="font-display text-xl font-bold text-primary">Blacklist Tanggal</h2>
              <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" type="date" value={blacklist.tanggal} onChange={(e) => setBlacklist((v) => ({ ...v, tanggal: e.target.value }))} />
                <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Keterangan" value={blacklist.keterangan} onChange={(e) => setBlacklist((v) => ({ ...v, keterangan: e.target.value }))} />
                <ButtonPrimary onClick={tambahBlacklist}>Tambah</ButtonPrimary>
              </div>
              <div className="mt-4 space-y-2">
                {konfigurasi.blacklistTanggal.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-surface p-3 text-sm">
                    <span>{item.tanggal} - {item.keterangan ?? '-'}</span>
                    <ButtonPrimary icon={Trash2} variant="icon" onClick={() => konfigurasi.hapusBlacklistTanggal(item.id)}>Hapus</ButtonPrimary>
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="font-display text-xl font-bold text-primary">Template Alasan Tolak</h2>
              <div className="mt-4 flex gap-2">
                <input className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm" value={template} onChange={(e) => setTemplate(e.target.value)} />
                <ButtonPrimary onClick={tambahTemplate}>Tambah</ButtonPrimary>
              </div>
              <div className="mt-4 space-y-2">
                {konfigurasi.templateAlasanTolak.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-surface p-3 text-sm">
                    <span>{item.teks}</span>
                    <ButtonPrimary icon={Trash2} variant="icon" onClick={() => konfigurasi.hapusTemplateAlasan(item.id)}>Hapus</ButtonPrimary>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </form>
      ) : null}
    </div>
  )
}
