export function FormDataDiri({ value, errors = {}, banjarOptions = [], currentCitizen, onChange }) {
  const update = (key, nextValue) => onChange({ ...value, [key]: nextValue })

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {currentCitizen ? (
        <div className="rounded-xl bg-secondary-pale p-4 text-sm font-semibold text-secondary sm:col-span-2">
          Data awal diisi dari profil warga. Nomor HP tetap bisa disesuaikan untuk pengajuan ini.
        </div>
      ) : null}
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-primary">
        NIK
        <input className="rounded-lg border border-slate-200 px-4 py-3 font-mono text-sm" maxLength={16} value={value.nik} onChange={(event) => update('nik', event.target.value)} />
        {errors.nik ? <span className="text-xs text-[#9B1C1C]">{errors.nik}</span> : null}
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-primary">
        Nama Lengkap
        <input className="rounded-lg border border-slate-200 px-4 py-3 text-sm" value={value.nama} onChange={(event) => update('nama', event.target.value)} />
        {errors.nama ? <span className="text-xs text-[#9B1C1C]">{errors.nama}</span> : null}
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-primary">
        Nomor HP
        <input className="rounded-lg border border-slate-200 px-4 py-3 font-mono text-sm" value={value.nomorHp} onChange={(event) => update('nomorHp', event.target.value)} />
        {errors.nomorHp ? <span className="text-xs text-[#9B1C1C]">{errors.nomorHp}</span> : null}
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-primary">
        Banjar Asal
        <select className="rounded-lg border border-slate-200 px-4 py-3 text-sm" value={value.banjarAsal} onChange={(event) => update('banjarAsal', event.target.value)}>
          <option value="">Pilih Banjar</option>
          {banjarOptions.map((banjar) => <option key={banjar.id} value={banjar.id}>{banjar.nama}</option>)}
          <option value="luar_desa">Luar Desa/Kelurahan</option>
        </select>
        {errors.banjarAsal ? <span className="text-xs text-[#9B1C1C]">{errors.banjarAsal}</span> : null}
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-primary sm:col-span-2">
        Estimasi Jumlah Tamu
        <input className="rounded-lg border border-slate-200 px-4 py-3 text-sm" min="1" type="number" value={value.estimasiTamu} onChange={(event) => update('estimasiTamu', event.target.value)} />
        {errors.estimasiTamu ? <span className="text-xs text-[#9B1C1C]">{errors.estimasiTamu}</span> : null}
      </label>
    </div>
  )
}
