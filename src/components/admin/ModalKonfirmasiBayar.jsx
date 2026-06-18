import { useEffect, useState } from 'react'
import { PencocokkanData } from './PencocokkanData'
import { ImagePreview } from '../common/ImagePreview'
import { Modal } from '../common/Modal'
import { formatCurrency } from '../../utils/formatCurrency'

export function ModalKonfirmasiBayar({ open, pengajuan, loading, onClose, onConfirm }) {
  const [valid, setValid] = useState(true)
  const [catatan, setCatatan] = useState('')

  useEffect(() => {
    if (open) {
      setValid(true)
      setCatatan('')
    }
  }, [open])

  return (
    <Modal
      confirmLabel={valid ? 'Pembayaran Valid' : 'Minta Upload Ulang'}
      description="Cocokkan nominal dan bukti transfer sebelum menyetujui pengajuan."
      loading={loading}
      open={open}
      title="Verifikasi Pembayaran"
      type="bayar"
      size="lg"
      onClose={onClose}
      onConfirm={() => onConfirm({ valid, catatan })}
    >
      {pengajuan ? (
        <div className="space-y-4">
          <PencocokkanData pengajuan={pengajuan} />
          <div className="flex items-center gap-3 rounded-xl bg-surface p-3">
            <ImagePreview className="h-28 w-40" src={pengajuan.buktiTransferSignedUrl} alt="Bukti transfer" label="Bukti transfer" />
            <div className="text-sm">
              <p className="font-semibold text-primary">Bukti Transfer</p>
              <p className="text-slate-600">{pengajuan.nomorPengajuan}</p>
              <p className="font-semibold text-primary">{formatCurrency(pengajuan.totalBiaya)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className={`rounded-xl border px-3 py-2 text-sm font-semibold ${valid ? 'border-secondary bg-secondary-pale text-secondary' : 'border-slate-200'}`} type="button" onClick={() => setValid(true)}>
              Valid
            </button>
            <button className={`rounded-xl border px-3 py-2 text-sm font-semibold ${!valid ? 'border-[#9B1C1C] bg-[#FEE2E2] text-[#9B1C1C]' : 'border-slate-200'}`} type="button" onClick={() => setValid(false)}>
              Tidak Valid
            </button>
          </div>
          {!valid ? (
            <label className="block text-sm font-semibold text-primary">
              Catatan untuk warga
              <textarea className="mt-1 min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2" value={catatan} onChange={(e) => setCatatan(e.target.value)} />
            </label>
          ) : null}
        </div>
      ) : null}
    </Modal>
  )
}
