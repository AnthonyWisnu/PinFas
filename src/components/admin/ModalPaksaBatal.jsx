import { useEffect, useState } from 'react'
import { Modal } from '../common/Modal'

export function ModalPaksaBatal({ open, loading, onClose, onConfirm }) {
  const [alasan, setAlasan] = useState('')

  useEffect(() => {
    if (open) setAlasan('')
  }, [open])

  return (
    <Modal
      confirmLabel="Batalkan Pengajuan"
      confirmVariant="danger"
      description="Aksi ini wajib memiliki alasan karena berdampak pada jadwal warga."
      loading={loading}
      open={open}
      title="Paksa Batal"
      type="batal"
      onClose={onClose}
      onConfirm={() => onConfirm(alasan)}
    >
      <label className="block text-sm font-semibold text-primary">
        Alasan pembatalan
        <textarea
          className="mt-1 min-h-28 w-full rounded-xl border border-slate-200 px-3 py-2"
          required
          value={alasan}
          onChange={(event) => setAlasan(event.target.value)}
        />
      </label>
    </Modal>
  )
}
