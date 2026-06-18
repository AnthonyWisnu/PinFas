import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { ButtonPrimary } from '../../components/common/ButtonPrimary'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { useAdmin } from '../../hooks/useAdmin'
import { useAppContext } from '../../hooks/useAppContext'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, loading, error } = useAdmin()
  const {
    state: { authLoading, currentUser },
  } = useAppContext()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  if (authLoading) return <LoadingSpinner mode="fullscreen" />
  if (currentUser) return <Navigate replace to="/admin/dasbor" />

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await login(form)
    if (!result.error) navigate('/admin/dasbor')
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-surface px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
          <Lock aria-hidden="true" size={24} />
        </div>
        <h1 className="font-display text-2xl font-bold text-primary">Masuk ke Dashboard</h1>
        <p className="mt-3 text-sm text-slate-600">Khusus petugas Desa/Kelurahan dan Kelian Banjar.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-primary">
            Email
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              required
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />
          </label>
          <label className="block text-sm font-semibold text-primary">
            Password
            <div className="mt-1 flex rounded-xl border border-slate-200">
              <input
                className="min-w-0 flex-1 rounded-l-xl px-3 py-2 outline-none"
                required
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              />
              <button className="px-3 text-slate-500" type="button" onClick={() => setShowPassword((value) => !value)}>
                {showPassword ? <EyeOff aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
                <span className="sr-only">Tampilkan password</span>
              </button>
            </div>
          </label>
          {error ? <p className="rounded-xl bg-[#FEE2E2] px-3 py-2 text-sm font-semibold text-[#9B1C1C]">{error}</p> : null}
          <ButtonPrimary className="w-full" loading={loading} type="submit">
            Masuk
          </ButtonPrimary>
        </form>
      </div>
    </section>
  )
}
