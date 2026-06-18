import {
  AlertTriangle,
  Ban,
  CalendarX,
  CheckCircle,
  Clock,
  CreditCard,
  Hourglass,
  Info,
  PackageCheck,
  Wrench,
  XCircle,
} from 'lucide-react'
import { getStatusMeta } from '../../utils/statusHelper'

const icons = {
  AlertTriangle,
  Ban,
  CalendarX,
  CheckCircle,
  Clock,
  CreditCard,
  Hourglass,
  Info,
  PackageCheck,
  Wrench,
  XCircle,
}

export function BadgeStatus({ status, label, className = '' }) {
  const meta = getStatusMeta(status)
  const Icon = icons[meta.icon] ?? Info

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-xs font-semibold ${meta.className} ${className}`}
    >
      <Icon aria-hidden="true" size={12} />
      {label ?? meta.label}
    </span>
  )
}
