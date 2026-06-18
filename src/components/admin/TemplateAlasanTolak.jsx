export function TemplateAlasanTolak({ templates = [], selectedId, onSelect }) {
  if (templates.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {templates.map((template) => (
        <button
          key={template.id}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            selectedId === template.id
              ? 'border-primary bg-primary text-white'
              : 'border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary'
          }`}
          type="button"
          onClick={() => onSelect(template)}
        >
          {template.teks}
        </button>
      ))}
    </div>
  )
}
