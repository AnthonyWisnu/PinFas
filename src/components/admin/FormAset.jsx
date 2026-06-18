import { useEffect, useState } from 'react'
import { FotoAsetUpload } from './FotoAsetUpload'
import { ButtonPrimary } from '../common/ButtonPrimary'

const emptyForm = {
  nama: '',
  kategoriPemilik: 'desa',
  banjarId: '',
  deskripsi: '',
  lokasi: '',
  kapasitas: '',
  statusBiaya: 'gratis',
  tarifLokal: 0,
  tarifAntarBanjar: 0,
  tarifLuarDesa: 0,
  statusAset: 'tersedia',
  syaratKetentuan: [],
  checklistKondisi: [],
  fotoUrls: [],
}

function textToList(value) {
  return value.split('\n').map((item) => item.trim()).filter(Boolean)
}

export function FormAset({ initialData, banjarOptions = [], loading = false, onSubmit, onCancel, onUploadFoto }) {
  const [form, setForm] = useState(emptyForm)
  const [listText, setListText] = useState({ syarat: '', checklist: '', foto: '' })

  useEffect(() => {
    const next = initialData ?? emptyForm
    setForm({ ...emptyForm, ...next })
    setListText({
      syarat: (next.syaratKetentuan ?? []).join('\n'),
      checklist: (next.checklistKondisi ?? []).join('\n'),
      foto: (next.fotoUrls ?? []).join('\n'),
    })
  }, [initialData])

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({
      ...form,
      syaratKetentuan: textToList(listText.syarat),
      checklistKondisi: textToList(listText.checklist),
      fotoUrls: textToList(listText.foto),
    })
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-primary">
          Nama Aset
          <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" required value={form.nama} onChange={(e) => setField('nama', e.target.value)} />
        </label>
        <label className="text-sm font-semibold text-primary">
          Kategori
          <select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={form.kategoriPemilik} onChange={(e) => setField('kategoriPemilik', e.target.value)}>
            <option value="desa">Desa/Kelurahan</option>
            <option value="banjar">Banjar</option>
          </select>
        </label>
        {form.kategoriPemilik === 'banjar' ? (
          <label className="text-sm font-semibold text-primary">
            Banjar
            <select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" required value={form.banjarId ?? ''} onChange={(e) => setField('banjarId', e.target.value)}>
              <option value="">Pilih Banjar</option>
              {banjarOptions.map((banjar) => (
                <option key={banjar.id} value={banjar.id}>{banjar.nama}</option>
              ))}
            </select>
          </label>
        ) : null}
        <label className="text-sm font-semibold text-primary">
          Kapasitas
          <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" min="0" type="number" value={form.kapasitas ?? ''} onChange={(e) => setField('kapasitas', e.target.value)} />
        </label>
        <label className="text-sm font-semibold text-primary">
          Status Biaya
          <select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={form.statusBiaya} onChange={(e) => setField('statusBiaya', e.target.value)}>
            <option value="gratis">Gratis</option>
            <option value="berbayar">Berbayar</option>
          </select>
        </label>
        {['tarifLokal', 'tarifAntarBanjar', 'tarifLuarDesa'].map((field) => (
          <label key={field} className="text-sm font-semibold text-primary">
            {field === 'tarifLokal' ? 'Tarif Lokal' : field === 'tarifAntarBanjar' ? 'Tarif Antar Banjar' : 'Tarif Luar Desa'}
            <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" min="0" type="number" value={form[field] ?? 0} onChange={(e) => setField(field, e.target.value)} />
          </label>
        ))}
      </div>
      <label className="block text-sm font-semibold text-primary">
        Deskripsi
        <textarea className="mt-1 min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2" value={form.deskripsi ?? ''} onChange={(e) => setField('deskripsi', e.target.value)} />
      </label>
      <label className="block text-sm font-semibold text-primary">
        Lokasi
        <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={form.lokasi ?? ''} onChange={(e) => setField('lokasi', e.target.value)} />
      </label>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="text-sm font-semibold text-primary">Syarat per Baris<textarea className="mt-1 min-h-28 w-full rounded-xl border border-slate-200 px-3 py-2" value={listText.syarat} onChange={(e) => setListText((v) => ({ ...v, syarat: e.target.value }))} /></label>
        <label className="text-sm font-semibold text-primary">Checklist per Baris<textarea className="mt-1 min-h-28 w-full rounded-xl border border-slate-200 px-3 py-2" value={listText.checklist} onChange={(e) => setListText((v) => ({ ...v, checklist: e.target.value }))} /></label>
        <label className="text-sm font-semibold text-primary">URL Foto per Baris<textarea className="mt-1 min-h-28 w-full rounded-xl border border-slate-200 px-3 py-2" value={listText.foto} onChange={(e) => setListText((v) => ({ ...v, foto: e.target.value }))} /></label>
      </div>
      <FotoAsetUpload
        disabled={!onUploadFoto}
        fotoUrls={textToList(listText.foto)}
        onChange={(urls) => setListText((v) => ({ ...v, foto: urls.join('\n') }))}
        onUpload={onUploadFoto}
      />
      <div className="flex justify-end gap-3">
        <ButtonPrimary variant="secondary" onClick={onCancel}>Batal</ButtonPrimary>
        <ButtonPrimary loading={loading} type="submit">Simpan Aset</ButtonPrimary>
      </div>
    </form>
  )
}
