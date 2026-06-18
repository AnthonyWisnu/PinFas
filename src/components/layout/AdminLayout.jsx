import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { useAppContext } from '../../hooks/useAppContext'

export function AdminLayout() {
  const location = useLocation()
  const {
    state: { authLoading, currentUser },
  } = useAppContext()

  if (authLoading) {
    return <LoadingSpinner mode="fullscreen" />
  }

  if (!currentUser) {
    return <Navigate replace state={{ from: location }} to="/admin" />
  }

  return (
    <div className="min-h-screen bg-surface text-primary lg:flex">
      <AdminSidebar />
      <div className="flex min-h-screen flex-1 flex-col lg:ml-64">
        <header className="border-b border-slate-200 bg-white px-6 py-5 lg:px-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Dashboard Admin</p>
              <h1 className="font-display text-2xl font-bold text-primary">{currentUser.jabatan}</h1>
            </div>
            <p className="text-sm font-semibold text-slate-600">{currentUser.nama}</p>
          </div>
        </header>
        <main className="flex-1 px-6 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
