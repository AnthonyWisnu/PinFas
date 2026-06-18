import { AlertTriangle, CheckCircle, CreditCard, PackageCheck, X, XCircle } from 'lucide-react'
import { ButtonPrimary } from './ButtonPrimary'

const typeMeta = {
  approve: { icon: CheckCircle, bg: 'bg-secondary-pale', color: 'text-secondary' },
  reject: { icon: XCircle, bg: 'bg-[#FEE2E2]', color: 'text-[#9B1C1C]' },
  bayar: { icon: CreditCard, bg: 'bg-accent-pale', color: 'text-accent-dark' },
  batal: { icon: AlertTriangle, bg: 'bg-[#FEE2E2]', color: 'text-[#9B1C1C]' },
  kembali: { icon: PackageCheck, bg: 'bg-primary-pale', color: 'text-primary-mid' },
}

export function Modal({
  open = false,
  title,
  description,
  children,
  type = 'approve',
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  confirmVariant = 'primary',
  loading = false,
  size = 'md',
  onClose,
  onConfirm,
}) {
  if (!open) return null

  const meta = typeMeta[type] ?? typeMeta.approve
  const Icon = meta.icon
  const handleConfirm = onConfirm ?? onClose
  const sizeClass = size === 'lg' ? 'max-w-2xl' : 'max-w-md'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button className="absolute inset-0 bg-primary/60 backdrop-blur-sm" type="button" onClick={onClose}>
        <span className="sr-only">Tutup modal</span>
      </button>
      <div className={`relative flex max-h-[92vh] w-full ${sizeClass} flex-col gap-5 overflow-y-auto rounded-[20px] bg-white p-6 shadow-2xl`}>
        <ButtonPrimary className="absolute right-4 top-4" icon={X} variant="icon" onClick={onClose}>
          Tutup
        </ButtonPrimary>
        <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${meta.bg}`}>
          <Icon aria-hidden="true" className={meta.color} size={28} />
        </div>
        <div className="text-center">
          <h2 className="font-display text-xl font-bold text-primary">{title}</h2>
          {description ? <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p> : null}
        </div>
        {children ? <div>{children}</div> : null}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <ButtonPrimary className="w-full sm:w-auto" variant="secondary" onClick={onClose}>
            {cancelLabel}
          </ButtonPrimary>
          <ButtonPrimary className="w-full sm:w-auto" variant={confirmVariant} loading={loading} onClick={handleConfirm}>
            {confirmLabel}
          </ButtonPrimary>
        </div>
      </div>
    </div>
  )
}
