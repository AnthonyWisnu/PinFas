import { Check, CreditCard, PackageCheck, X, XCircle } from 'lucide-react'
import { BadgeStatus } from '../common/BadgeStatus'
import { ButtonPrimary } from '../common/ButtonPrimary'
import { EmptyState } from '../common/EmptyState'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'

function ActionButtons({ item, readOnly, canProcess, onApprove, onReject, onBayar, onBatal, onKembali }) {
  if (readOnly || !canProcess(item)) return <span className="text-xs font-semibold text-slate-400">Read-only</span>

  return (
    <div className="flex flex-wrap justify-end gap-2">
      {item.status === 'pending' ? (
        <>
          <ButtonPrimary icon={Check} size="sm" variant="secondary" onClick={() => onApprove(item)}>
            Proses
          </ButtonPrimary>
          <ButtonPrimary icon={XCircle} size="sm" variant="danger" onClick={() => onReject(item)}>
            Tolak
          </ButtonPrimary>
        </>
      ) : null}
      {item.status === 'menunggu_konfirmasi_bayar' ? (
        <ButtonPrimary icon={CreditCard} size="sm" variant="secondary" onClick={() => onBayar(item)}>
          Bayar
        </ButtonPrimary>
      ) : null}
      {['approved', 'terlambat'].includes(item.status) ? (
        <ButtonPrimary icon={PackageCheck} size="sm" variant="secondary" onClick={() => onKembali(item)}>
          Kembali
        </ButtonPrimary>
      ) : null}
      {!['rejected', 'dibatalkan', 'selesai'].includes(item.status) ? (
        <ButtonPrimary icon={X} size="sm" variant="ghost" onClick={() => onBatal(item)}>
          Batal
        </ButtonPrimary>
      ) : null}
    </div>
  )
}

export function TabelPengajuan({ items = [], readOnly = false, canProcess = () => false, onApprove, onReject, onBayar, onBatal, onKembali }) {
  if (items.length === 0) {
    return <EmptyState title="Tidak Ada Pengajuan" description="Pengajuan sesuai filter akan tampil di sini." />
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Pengajuan</th>
              <th className="px-4 py-3">Pemohon</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Biaya</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="align-top">
                <td className="px-4 py-4">
                  <p className="font-semibold text-primary">{item.nomorPengajuan}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.namaAset}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="font-semibold text-slate-800">{item.nama}</p>
                  <p className="text-xs text-slate-500">{item.nik}</p>
                  <p className="text-xs text-slate-500">{item.banjarAsal}</p>
                </td>
                <td className="px-4 py-4 text-slate-600">
                  {formatDate(item.tanggalMulai)} sampai {formatDate(item.tanggalSelesai)}
                </td>
                <td className="px-4 py-4 font-semibold text-primary">{formatCurrency(item.totalBiaya)}</td>
                <td className="px-4 py-4">
                  <BadgeStatus status={item.status} />
                </td>
                <td className="px-4 py-4 text-right">
                  <ActionButtons
                    canProcess={canProcess}
                    item={item}
                    readOnly={readOnly}
                    onApprove={onApprove}
                    onBatal={onBatal}
                    onBayar={onBayar}
                    onKembali={onKembali}
                    onReject={onReject}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
