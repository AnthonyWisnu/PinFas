import { ClipboardCheck } from 'lucide-react'

export function ChecklistKondisi({ items = [], readonly = true }) {
  const checklist = items.length ? items : ['Area bersih', 'Lampu dan listrik berfungsi', 'Perlengkapan utama tersedia']

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="flex items-center gap-2 font-display text-lg font-bold text-primary">
        <ClipboardCheck aria-hidden="true" size={20} />
        Checklist Kondisi
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {checklist.map((item) => (
          <label key={item} className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3 text-sm font-semibold text-slate-700">
            <input checked={readonly} className="h-4 w-4 accent-secondary" disabled={readonly} readOnly={readonly} type="checkbox" />
            {item}
          </label>
        ))}
      </div>
    </section>
  )
}
