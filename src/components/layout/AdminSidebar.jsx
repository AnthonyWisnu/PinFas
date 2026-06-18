import { NavLink, useNavigate } from 'react-router-dom'
import {
  BarChart2,
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShieldCheck,
  UserCheck,
  Users,
} from 'lucide-react'
import { useAppContext } from '../../hooks/useAppContext'
import { useAdmin } from '../../hooks/useAdmin'

const menuByRole = {
  kelian_banjar: [
    { to: '/admin/dasbor', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/pengajuan', label: 'Pengajuan', icon: FileText },
    { to: '/admin/aset', label: 'Aset Banjar', icon: Package },
    { to: '/admin/laporan', label: 'Laporan', icon: BarChart2 },
  ],
  admin_desa: [
    { to: '/admin/dasbor', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/pengajuan', label: 'Pengajuan', icon: FileText },
    { to: '/admin/aset', label: 'Aset', icon: Package },
    { to: '/admin/laporan', label: 'Laporan', icon: BarChart2 },
    { to: '/admin/konfigurasi', label: 'Konfigurasi', icon: Settings },
    { to: '/admin/akun', label: 'Manajemen Akun', icon: Users },
  ],
  lurah: [
    { to: '/admin/dasbor', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/laporan', label: 'Laporan', icon: BarChart2 },
  ],
}

const roleIcon = {
  kelian_banjar: UserCheck,
  admin_desa: ShieldCheck,
  lurah: ShieldCheck,
}

export function AdminSidebar() {
  const navigate = useNavigate()
  const {
    state: { currentUser, konfigurasi },
  } = useAppContext()
  const { logout } = useAdmin()
  const menu = menuByRole[currentUser?.role] ?? menuByRole.kelian_banjar
  const RoleIcon = roleIcon[currentUser?.role] ?? UserCheck

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <aside className="hidden h-screen w-64 flex-col bg-primary text-white lg:fixed lg:flex">
      <div className="p-6">
        <div className="font-display text-xl font-black">
          PINFAS<span className="text-accent">.</span>
        </div>
        <p className="mt-1 truncate text-xs font-semibold text-white/60">{konfigurasi?.namaInstansi ?? 'Admin'}</p>
      </div>
      <div className="h-px bg-accent/30" />
      <div className="flex items-center gap-3 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
          <RoleIcon aria-hidden="true" size={20} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{currentUser?.nama ?? 'Petugas'}</p>
          <p className="truncate text-xs text-white/60">{currentUser?.jabatan ?? 'Petugas Desa'}</p>
        </div>
      </div>
      <div className="h-px bg-accent/30" />
      <nav className="flex-1 overflow-y-auto py-4">
        {menu.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              className={({ isActive }) =>
                `mx-2 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all ${
                  isActive ? 'bg-accent/20 font-semibold text-accent' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
              to={item.to}
            >
              <Icon aria-hidden="true" size={18} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white" type="button" onClick={handleLogout}>
          <LogOut aria-hidden="true" size={18} />
          Keluar
        </button>
      </div>
    </aside>
  )
}
