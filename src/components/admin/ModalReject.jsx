import { useEffect, useState } from 'react'
import { Modal } from '../common/Modal'
import { TemplateAlasanTolak } from './TemplateAlasanTolak'

export function ModalReject({ open, templates = [], loading, onClose, onConfirm }) {
  const [alasan, setAlasan] = useState('')
  const [templateId, setTemplateId] = useState('')

  useEffect(() => {
    if (open) {
      setAlasan('')
      setTemplateId('')
    }
  }, [open])

  return (
    <Modal
      confirmLabel="Tolak Pengajuan"
      confirmVariant="danger"
      description="Alasan penolakan wajib diisi agar warga tahu hal yang perlu diperbaiki."
      loading={loading}
      open={open}
      title="Tolak Pengajuan"
      type="reject"
      onClose={onClose}
      onConfirm={() => onConfirm({ alasan, templateId })}
    >
      <div className="space-y-3">
        <TemplateAlasanTolak
          selectedId={templateId}
          templates={templates}
          onSelect={(template) => {
            setTemplateId(template.id)
            setAlasan(template.teks)
          }}
        />
        <label className="block text-sm font-semibold text-primary">
          Alasan
          <textarea
            className="mt-1 min-h-28 w-full rounded-xl border border-slate-200 px-3 py-2"
            required
            value={alasan}
            onChange={(event) => setAlasan(event.target.value)}
          />
        </label>
      </div>
    </Modal>
  )
}
