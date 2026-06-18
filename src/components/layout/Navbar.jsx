import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, Search, X } from 'lucide-react'
import { ButtonPrimary } from '../common/ButtonPrimary'
import { useAppContext } from '../../hooks/useAppContext'

const navLinks = [
  { to: '/', label: 'Katalog' },
  { to: '/laporan-publik', label: 'Laporan Publik' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const {
    state: { currentCitizen, konfigurasi },
  } = useAppContext()

  const namaInstansi = konfigurasi?.namaInstansi ?? 'PINFAS'

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/95 shadow-md backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex min-w-0 flex-col">
          <span className="font-display text-xl font-black leading-none text-primary">
            PINFAS<span className="text-accent">.</span>
          </span>
          <span className="max-w-44 truncate text-xs font-semibold text-slate-500">{namaInstansi}</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-semibold text-slate-600 md:flex">
          {navLinks.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'text-primary' : 'hover:text-primary')}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link
            className="rounded-full border-2 border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
            to="/lacak"
          >
            Lacak Pengajuan
          </Link>
          <Link className="rounded-lg px-2 py-1 text-sm font-semibold text-primary underline underline-offset-4 hover:bg-primary-pale" to={currentCitizen ? '/warga' : '/masuk-warga'}>
            {currentCitizen ? 'Dashboard Warga' : 'Masuk Warga'}
          </Link>
          <Link className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-primary-mid" to="/admin">
            Masuk Admin
          </Link>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <Link className="rounded-lg p-2 text-slate-600 hover:bg-surface" to="/lacak" aria-label="Lacak pengajuan">
            <Search aria-hidden="true" size={20} />
          </Link>
          <ButtonPrimary icon={open ? X : Menu} variant="icon" onClick={() => setOpen((value) => !value)}>
            Menu
          </ButtonPrimary>
        </div>
      </div>
      {open ? (
        <div className="fixed inset-y-0 right-0 z-50 flex w-72 flex-col bg-white p-6 shadow-2xl md:hidden">
          <div className="flex items-center justify-between">
            <span className="font-display text-xl font-black text-primary">PINFAS<span className="text-accent">.</span></span>
            <ButtonPrimary icon={X} variant="icon" onClick={() => setOpen(false)}>Tutup</ButtonPrimary>
          </div>
          <nav className="mt-8 flex flex-col gap-2 text-sm font-semibold text-slate-600">
            {[...navLinks, { to: '/lacak', label: 'Lacak Pengajuan' }, { to: currentCitizen ? '/warga' : '/masuk-warga', label: currentCitizen ? 'Dashboard Warga' : 'Masuk Warga' }].map((item) => (
              <Link key={item.to} className="rounded-xl px-4 py-3 hover:bg-surface hover:text-primary" to={item.to} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
          </nav>
          <Link className="mt-auto rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold text-white" to="/admin" onClick={() => setOpen(false)}>
            Masuk Admin
          </Link>
        </div>
      ) : null}
    </header>
  )
}
