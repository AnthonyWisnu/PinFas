import { Link } from 'react-router-dom'
import { MapPin, Phone } from 'lucide-react'
import { useAppContext } from '../../hooks/useAppContext'

export function Footer() {
  const {
    state: { konfigurasi },
  } = useAppContext()

  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-3">
        <div>
          <div className="font-display text-2xl font-black">
            PINFAS<span className="text-accent">.</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-white/70">Pelayanan aset publik yang transparan.</p>
        </div>
        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-wide text-accent">Informasi Instansi</h2>
          <div className="mt-4 space-y-3 text-sm text-white/70">
            <p className="font-semibold text-white">{konfigurasi?.namaInstansi ?? 'Desa/Kelurahan'}</p>
            {konfigurasi?.alamat ? (
              <p className="flex gap-2">
                <MapPin aria-hidden="true" className="mt-0.5 shrink-0" size={16} />
                <span>{konfigurasi.alamat}</span>
              </p>
            ) : null}
            {konfigurasi?.nomorTelepon ? (
              <p className="flex items-center gap-2">
                <Phone aria-hidden="true" size={16} />
                <span>{konfigurasi.nomorTelepon}</span>
              </p>
            ) : null}
          </div>
        </div>
        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-wide text-accent">Link Cepat</h2>
          <nav className="mt-4 flex flex-col gap-3 text-sm font-semibold text-white/70">
            <Link className="hover:text-white" to="/">Katalog</Link>
            <Link className="hover:text-white" to="/lacak">Lacak Pengajuan</Link>
            <Link className="hover:text-white" to="/laporan-publik">Laporan Publik</Link>
            <Link className="hover:text-white" to="/masuk-warga">Masuk Warga</Link>
          </nav>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-4 text-center text-xs text-white/60">
        PINFAS, layanan peminjaman fasilitas publik.
      </div>
    </footer>
  )
}
