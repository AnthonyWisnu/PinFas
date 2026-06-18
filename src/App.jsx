import { createBrowserRouter } from 'react-router-dom'
import { PublicLayout } from './components/layout/PublicLayout'
import { AdminLayout } from './components/layout/AdminLayout'
import { KatalogPage } from './pages/public/KatalogPage'
import { DetailAsetPage } from './pages/public/DetailAsetPage'
import { FormPengajuanPage } from './pages/public/FormPengajuanPage'
import { LacakStatusPage } from './pages/public/LacakStatusPage'
import { VerifikasiSuratPage } from './pages/public/VerifikasiSuratPage'
import { LaporanPublikPage } from './pages/public/LaporanPublikPage'
import { RiwayatAsetPage } from './pages/public/RiwayatAsetPage'
import { WargaAuthPage } from './pages/public/WargaAuthPage'
import { DashboardWargaPage } from './pages/public/DashboardWargaPage'
import { LoginPage } from './pages/admin/LoginPage'
import { DasborPage } from './pages/admin/DasborPage'
import { ManajemenAsetPage } from './pages/admin/ManajemenAsetPage'
import { ManajemenPengajuanPage } from './pages/admin/ManajemenPengajuanPage'
import { LaporanPage } from './pages/admin/LaporanPage'
import { KonfigurasiPage } from './pages/admin/KonfigurasiPage'
import { ManajemenAkunPage } from './pages/admin/ManajemenAkunPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <KatalogPage /> },
      { path: 'aset/:id', element: <DetailAsetPage /> },
      { path: 'aset/:id/ajukan', element: <FormPengajuanPage /> },
      { path: 'aset/:id/riwayat', element: <RiwayatAsetPage /> },
      { path: 'lacak', element: <LacakStatusPage /> },
      { path: 'verifikasi/:nomorPengajuan', element: <VerifikasiSuratPage /> },
      { path: 'laporan-publik', element: <LaporanPublikPage /> },
      { path: 'masuk-warga', element: <WargaAuthPage mode="masuk" /> },
      { path: 'daftar-warga', element: <WargaAuthPage mode="daftar" /> },
      { path: 'warga', element: <DashboardWargaPage /> },
    ],
  },
  { path: '/admin', element: <LoginPage /> },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: 'dasbor', element: <DasborPage /> },
      { path: 'pengajuan', element: <ManajemenPengajuanPage /> },
      { path: 'aset', element: <ManajemenAsetPage /> },
      { path: 'laporan', element: <LaporanPage /> },
      { path: 'konfigurasi', element: <KonfigurasiPage /> },
      { path: 'akun', element: <ManajemenAkunPage /> },
    ],
  },
])
