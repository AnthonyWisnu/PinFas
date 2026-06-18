import { Modal } from '../common/Modal'
import { ImagePreview } from '../common/ImagePreview'
import { PencocokkanData } from './PencocokkanData'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'

export function ModalApprove({ open, pengajuan, loading, onClose, onConfirm }) {
  const berbayar = Number(pengajuan?.totalBiaya ?? 0) > 0
  const nextStatus = berbayar && !pengajuan?.buktiTransferUrl ? 'menunggu pembayaran' : 'disetujui'

  return (
    <Modal
      confirmLabel="Proses Pengajuan"
      description={`Pengajuan akan diproses menjadi ${nextStatus}.`}
      loading={loading}
      open={open}
      title="Proses Pengajuan"
      type="approve"
      size="lg"
      onClose={onClose}
      onConfirm={onConfirm}
    >
      {pengajuan ? (
        <div className="space-y-4">
          <PencocokkanData pengajuan={pengajuan} />
          <div className="rounded-xl bg-surface p-4 text-sm text-slate-600">
            <p className="font-semibold text-primary">{pengajuan.namaAset}</p>
            <p>{formatDate(pengajuan.tanggalMulai)} sampai {formatDate(pengajuan.tanggalSelesai)}</p>
            <p className="mt-2 font-semibold text-primary">{formatCurrency(pengajuan.totalBiaya)}</p>
          </div>
          {pengajuan.buktiTransferSignedUrl ? (
            <div className="flex items-center gap-3 rounded-xl border border-accent-light bg-accent-pale p-3">
              <ImagePreview className="h-32 w-48" src={pengajuan.buktiTransferSignedUrl} alt="Bukti transfer" label="Bukti transfer" />
              <div className="text-sm">
                <p className="font-semibold text-primary">Bukti Transfer</p>
                <p className="text-slate-600">Sudah diunggah warga.</p>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </Modal>
  )
}
