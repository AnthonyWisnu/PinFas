import { Edit, Trash2, Wrench } from 'lucide-react'
import { BadgeStatus } from '../common/BadgeStatus'
import { ButtonPrimary } from '../common/ButtonPrimary'
import { EmptyState } from '../common/EmptyState'
import { formatCurrency } from '../../utils/formatCurrency'

export function TabelAset({ items = [], readOnly = false, onEdit, onToggleMaintenance, onDelete }) {
  if (items.length === 0) {
    return <EmptyState title="Belum Ada Aset" description="Aset yang bisa dikelola akan tampil di sini." />
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Aset</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Kapasitas</th>
              <th className="px-4 py-3">Tarif</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-4">
                  <p className="font-semibold text-primary">{item.nama}</p>
                  <p className="text-xs text-slate-500">{item.lokasi ?? '-'}</p>
                </td>
                <td className="px-4 py-4 text-slate-600">
                  {item.kategoriPemilik === 'desa' ? 'Desa/Kelurahan' : item.banjar?.nama ?? 'Banjar'}
                </td>
                <td className="px-4 py-4 text-slate-600">{item.kapasitas ?? '-'} orang</td>
                <td className="px-4 py-4 text-slate-600">
                  {item.statusBiaya === 'gratis' ? 'Gratis' : formatCurrency(item.tarifLokal)}
                </td>
                <td className="px-4 py-4">
                  <BadgeStatus status={item.statusAset} />
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap justify-end gap-2">
                    <ButtonPrimary disabled={readOnly} icon={Edit} size="sm" variant="secondary" onClick={() => onEdit(item)}>
                      Edit
                    </ButtonPrimary>
                    <ButtonPrimary disabled={readOnly} icon={Wrench} size="sm" variant="ghost" onClick={() => onToggleMaintenance(item)}>
                      Maintenance
                    </ButtonPrimary>
                    <ButtonPrimary disabled={readOnly} icon={Trash2} size="sm" variant="danger" onClick={() => onDelete(item.id)}>
                      Hapus
                    </ButtonPrimary>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
