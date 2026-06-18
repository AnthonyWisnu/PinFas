import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { ButtonPrimary } from '../common/ButtonPrimary'

export function WargaAuthForm({ mode = 'masuk', values, errors = {}, loading, onChange, onSubmit }) {
  const [showPassword, setShowPassword] = useState(false)
  const daftar = mode === 'daftar'
  const update = (key, value) => onChange({ ...values, [key]: value })

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-primary">
        Email
        <input className="rounded-lg border border-slate-200 px-4 py-3 text-sm" type="email" value={values.email} onChange={(event) => update('email', event.target.value)} />
        {errors.email ? <span className="text-xs text-[#9B1C1C]">{errors.email}</span> : null}
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold text-primary">
        Password
        <div className="flex rounded-lg border border-slate-200 bg-white">
          <input className="min-w-0 flex-1 rounded-lg px-4 py-3 text-sm outline-none" type={showPassword ? 'text' : 'password'} value={values.password} onChange={(event) => update('password', event.target.value)} />
          <button className="px-3 text-slate-500" type="button" onClick={() => setShowPassword((value) => !value)}>
            {showPassword ? <EyeOff aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
            <span className="sr-only">Tampilkan password</span>
          </button>
        </div>
      </label>
      {daftar ? (
        <div className="grid gap-4">
          <input className="rounded-lg border border-slate-200 px-4 py-3 text-sm" placeholder="NIK" value={values.nik} onChange={(event) => update('nik', event.target.value)} />
          <input className="rounded-lg border border-slate-200 px-4 py-3 text-sm" placeholder="Nama lengkap" value={values.nama} onChange={(event) => update('nama', event.target.value)} />
          <input className="rounded-lg border border-slate-200 px-4 py-3 text-sm" placeholder="Nomor HP" value={values.nomorHp} onChange={(event) => update('nomorHp', event.target.value)} />
          <input className="rounded-lg border border-slate-200 px-4 py-3 text-sm" placeholder="Banjar asal" value={values.banjarAsal} onChange={(event) => update('banjarAsal', event.target.value)} />
        </div>
      ) : null}
      <ButtonPrimary className="w-full" loading={loading} type="submit">{daftar ? 'Daftar' : 'Masuk'}</ButtonPrimary>
      <Link className="inline-flex w-full justify-center rounded-full border-2 border-primary px-6 py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-white" to="/">
        Lanjut Tanpa Akun
      </Link>
    </form>
  )
}
