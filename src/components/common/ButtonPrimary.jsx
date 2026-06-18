import { LoadingSpinner } from './LoadingSpinner'

const variantClass = {
  primary: 'rounded-full bg-primary px-6 py-2.5 text-white shadow-md hover:bg-primary-mid hover:shadow-lg hover:scale-[1.02]',
  secondary: 'rounded-full border-2 border-primary px-6 py-2.5 text-primary hover:bg-primary hover:text-white',
  accent: 'rounded-full bg-accent px-6 py-2.5 font-bold text-primary shadow-md hover:bg-accent-light hover:shadow-lg',
  danger: 'rounded-full bg-[#9B1C1C] px-6 py-2.5 text-white shadow-md hover:bg-[#7F1D1D] hover:shadow-lg',
  ghost: 'rounded-lg px-2 py-1 text-primary underline underline-offset-4 hover:bg-primary-pale',
  icon: 'rounded-lg p-2 text-slate-600 hover:bg-surface hover:text-primary',
}

const sizeClass = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

export function ButtonPrimary({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) {
  const isIconOnly = variant === 'icon'

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 ${
        variantClass[variant] ?? variantClass.primary
      } ${sizeClass[size] ?? sizeClass.md} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <LoadingSpinner size="xs" /> : Icon ? <Icon aria-hidden="true" size={isIconOnly ? 18 : 16} /> : null}
      {isIconOnly ? <span className={children ? 'sr-only' : ''}>{children}</span> : children}
    </button>
  )
}
