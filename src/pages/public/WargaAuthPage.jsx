import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { WargaAuthForm } from '../../components/warga/WargaAuthForm'
import { EmptyState } from '../../components/common/EmptyState'
import { useWargaAuth } from '../../hooks/useWargaAuth'

const initialValues = {
  email: '',
  password: '',
  nik: '',
  nama: '',
  nomorHp: '',
  banjarAsal: '',
}

export function WargaAuthPage({ mode = 'masuk' }) {
  const navigate = useNavigate()
  const { daftar, masuk, loading, error } = useWargaAuth()
  const [values, setValues] = useState(initialValues)
  const title = mode === 'daftar' ? 'Daftar Akun Warga' : 'Masuk sebagai Warga'

  const submit = async (event) => {
    event.preventDefault()
    const result = mode === 'daftar' ? await daftar(values) : await masuk(values)
    if (result.data?.redirectToAdmin) navigate('/admin/dasbor')
    if (result.data && !result.data.redirectToAdmin) navigate('/warga')
  }

  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-surface px-6 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6">
          <div className="font-display text-2xl font-black text-primary">PINFAS<span className="text-accent">.</span></div>
          <h1 className="mt-4 font-display text-2xl font-bold text-primary">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Akun warga bersifat opsional. Anda tetap bisa mengajukan peminjaman tanpa akun.
          </p>
        </div>
        {error ? <EmptyState className="py-6" description={error} mode="error" title="Gagal Masuk" /> : null}
        <WargaAuthForm loading={loading} mode={mode} values={values} onChange={setValues} onSubmit={submit} />
        <p className="mt-5 text-center text-sm text-slate-600">
          {mode === 'daftar' ? 'Sudah punya akun?' : 'Belum punya akun?'}{' '}
          <Link className="font-semibold text-primary underline underline-offset-4" to={mode === 'daftar' ? '/masuk-warga' : '/daftar-warga'}>
            {mode === 'daftar' ? 'Masuk' : 'Daftar'}
          </Link>
        </p>
      </div>
    </section>
  )
}
