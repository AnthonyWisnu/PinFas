import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'

export function SearchableSelect({ options = [], value, onChange, placeholder = 'Cari data', allLabel = 'Semua' }) {
  const wrapperRef = useRef(null)
  const selected = options.find((item) => item.value === value)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(selected?.label ?? allLabel)

  useEffect(() => {
    setQuery(selected?.label ?? allLabel)
  }, [allLabel, selected?.label])

  useEffect(() => {
    const handleClick = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false)
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filteredOptions = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword || query === allLabel) return options
    return options.filter((item) => item.label.toLowerCase().includes(keyword))
  }, [allLabel, options, query])

  const choose = (option) => {
    onChange(option.value)
    setQuery(option.label)
    setOpen(false)
  }

  const clear = () => {
    onChange('semua')
    setQuery('')
    setOpen(true)
  }

  return (
    <div ref={wrapperRef} className="relative">
      <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
      <input
        className="h-full min-h-[42px] w-full rounded-xl border border-slate-200 px-9 py-2 text-sm outline-none focus:border-primary"
        placeholder={placeholder}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
      />
      {value !== 'semua' ? (
        <button className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary" type="button" onClick={clear}>
          <X aria-hidden="true" size={16} />
          <span className="sr-only">Reset pilihan</span>
        </button>
      ) : null}
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
      {open ? (
        <div className="absolute z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 text-sm shadow-lg">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={option.value}
                className={`block w-full px-3 py-2 text-left hover:bg-surface ${option.value === value ? 'font-semibold text-primary' : ''}`}
                type="button"
                onClick={() => choose(option)}
              >
                {option.label}
              </button>
            ))
          ) : (
            <p className="px-3 py-2 text-slate-500">Aset tidak ditemukan.</p>
          )}
        </div>
      ) : null}
    </div>
  )
}
