export function KPICard({ icon: Icon, label, value, helper, tone = 'primary' }) {
  const toneClass = {
    primary: 'bg-primary text-white',
    accent: 'bg-accent text-primary',
    secondary: 'bg-secondary text-white',
    danger: 'bg-[#9B1C1C] text-white',
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-2 font-display text-3xl font-black text-primary">{value}</p>
          {helper ? <p className="mt-1 text-xs text-slate-500">{helper}</p> : null}
        </div>
        {Icon ? (
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneClass[tone] ?? toneClass.primary}`}>
            <Icon aria-hidden="true" size={22} />
          </div>
        ) : null}
      </div>
    </div>
  )
}
