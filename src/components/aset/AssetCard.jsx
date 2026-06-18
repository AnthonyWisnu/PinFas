import { Link } from 'react-router-dom'
import { Banknote, Building2, Eye, Home, MapPin, Users, Wrench } from 'lucide-react'
import { BadgeStatus } from '../common/BadgeStatus'
import { formatCurrency } from '../../utils/formatCurrency'

export function AssetCard({ aset }) {
  const isBanjar = aset.kategoriPemilik === 'banjar'
  const CategoryIcon = isBanjar ? Home : Building2
  const tarifLabel =
    aset.statusBiaya === 'gratis'
      ? 'Gratis'
      : `Mulai ${formatCurrency(Math.min(...[aset.tarifLokal, aset.tarifAntarBanjar, aset.tarifLuarDesa].filter(Boolean)))}`

  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="absolute bottom-0 left-0 top-0 z-10 w-1 bg-accent" />
      <div className="relative">
        <img src={aset.coverUrl} alt={aset.nama} className="aspect-video w-full object-cover" />
        {aset.statusAset === 'maintenance' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-primary/70 text-white">
            <Wrench aria-hidden="true" size={28} />
            <span className="text-sm font-bold">Sedang Maintenance</span>
          </div>
        ) : null}
      </div>
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white ${isBanjar ? 'bg-secondary' : 'bg-primary'}`}>
            <CategoryIcon aria-hidden="true" size={13} />
            {isBanjar ? aset.banjar?.nama ?? 'Aset Banjar' : 'Aset Desa/Kelurahan'}
          </span>
          <BadgeStatus status={aset.statusAset} />
        </div>
        <h2 className="mt-3 font-display text-lg font-bold leading-snug text-primary">{aset.nama}</h2>
        <div className="mt-3 space-y-2 text-xs text-slate-600">
          <p className="flex items-center gap-1.5">
            <MapPin aria-hidden="true" size={14} />
            <span>{aset.lokasi ?? 'Lokasi belum diisi'}</span>
          </p>
          <p className="flex items-center gap-1.5">
            <Users aria-hidden="true" size={14} />
            <span>{aset.kapasitas ? `${aset.kapasitas} orang` : 'Kapasitas menyesuaikan'}</span>
          </p>
        </div>
        <div className="mt-4 border-t border-slate-200 pt-4">
          <p className={`flex items-center gap-2 text-sm font-semibold ${aset.statusBiaya === 'gratis' ? 'text-secondary' : 'text-primary'}`}>
            <Banknote aria-hidden="true" size={16} />
            {tarifLabel}
          </p>
        </div>
        <Link
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-primary px-6 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          to={`/aset/${aset.id}`}
        >
          <Eye aria-hidden="true" size={16} />
          Lihat Detail
        </Link>
      </div>
    </article>
  )
}
