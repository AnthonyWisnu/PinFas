import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ButtonPrimary } from '../common/ButtonPrimary'
import { parseDateOnly } from '../../utils/formatDate'

const dayNames = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function isInRange(date, range) {
  const start = parseDateOnly(range.tanggalMulai)
  const end = parseDateOnly(range.tanggalSelesai)
  return start && end && date >= start && date <= end
}

function getCalendarDays(monthDate) {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const first = new Date(year, month, 1)
  const offset = (first.getDay() + 6) % 7
  const start = new Date(year, month, 1 - offset)

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return date
  })
}

export function AvailabilityCalendar({ asetId, tanggalTerpakai = [], blacklistTanggal = [], selectedRange }) {
  const [monthDate, setMonthDate] = useState(new Date())
  const todayKey = toDateKey(new Date())
  const days = useMemo(() => getCalendarDays(monthDate), [monthDate])

  const moveMonth = (direction) => {
    setMonthDate((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1))
  }

  const getDayState = (date) => {
    const key = toDateKey(date)
    const isOutsideMonth = date.getMonth() !== monthDate.getMonth()
    const isPast = key < todayKey
    const isBooked = tanggalTerpakai.some((item) => item.asetId === asetId && isInRange(date, item))
    const blocked = blacklistTanggal.find((item) => item.tanggal === key)
    const isSelected = selectedRange && isInRange(date, selectedRange)

    if (isOutsideMonth) return 'text-slate-300'
    if (isPast) return 'cursor-not-allowed opacity-30'
    if (blocked) return 'cursor-not-allowed bg-[#FEE2E2] text-[#9B1C1C]'
    if (isBooked) return 'cursor-not-allowed bg-slate-100 text-slate-400 line-through'
    if (isSelected) return 'bg-primary text-white'
    if (key === todayKey) return 'bg-secondary-pale text-secondary ring-2 ring-accent ring-offset-1'
    return 'bg-secondary-pale text-secondary hover:bg-secondary hover:text-white'
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <ButtonPrimary icon={ChevronLeft} variant="icon" onClick={() => moveMonth(-1)}>Bulan sebelumnya</ButtonPrimary>
        <h2 className="font-display text-sm font-bold text-primary">
          {monthDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
        </h2>
        <ButtonPrimary icon={ChevronRight} variant="icon" onClick={() => moveMonth(1)}>Bulan berikutnya</ButtonPrimary>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {dayNames.map((day) => (
          <div key={day} className="py-1 text-xs font-semibold text-slate-500">{day}</div>
        ))}
        {days.map((date) => (
          <div key={toDateKey(date)} className={`flex aspect-square items-center justify-center rounded-full text-xs font-semibold transition-all ${getDayState(date)}`}>
            {date.getDate()}
          </div>
        ))}
      </div>
    </section>
  )
}
