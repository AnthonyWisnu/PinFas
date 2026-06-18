const sizeClass = {
  xs: 'h-4 w-4 border-2',
  sm: 'h-6 w-6 border-2',
  md: 'h-10 w-10 border-4',
  lg: 'h-14 w-14 border-4',
}

const modeClass = {
  inline: 'inline-flex items-center justify-center',
  section: 'flex min-h-48 items-center justify-center',
  fullscreen: 'fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm',
}

export function LoadingSpinner({ size = 'md', mode = 'inline', label = 'Memuat data' }) {
  return (
    <div className={modeClass[mode] ?? modeClass.inline} role="status" aria-label={label}>
      <span
        className={`${sizeClass[size] ?? sizeClass.md} animate-spin rounded-full border-primary-pale border-t-primary`}
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}
