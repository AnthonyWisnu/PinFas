import { AlertTriangle, Inbox } from 'lucide-react'
import { ButtonPrimary } from './ButtonPrimary'

export function EmptyState({
  icon: Icon,
  title = 'Belum Ada Data',
  description = 'Data akan muncul setelah tersedia.',
  actionLabel,
  onAction,
  mode = 'empty',
  className = '',
}) {
  const FallbackIcon = mode === 'error' ? AlertTriangle : Inbox
  const DisplayIcon = Icon ?? FallbackIcon
  const iconClass = mode === 'error' ? 'bg-[#FEE2E2] text-[#9B1C1C]' : 'bg-surface text-slate-500'

  return (
    <div className={`flex flex-col items-center gap-4 px-8 py-20 text-center ${className}`}>
      <div className={`flex h-20 w-20 items-center justify-center rounded-2xl ${iconClass}`}>
        <DisplayIcon aria-hidden="true" size={40} />
      </div>
      <div className="max-w-sm">
        <h3 className="font-display text-lg font-bold text-primary">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      </div>
      {actionLabel ? (
        <ButtonPrimary variant="secondary" onClick={onAction}>
          {actionLabel}
        </ButtonPrimary>
      ) : null}
    </div>
  )
}
