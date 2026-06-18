const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const dateTimeFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

/**
 * Parse tanggal YYYY-MM-DD tanpa pergeseran timezone browser.
 * @param {string|Date|null|undefined} value
 * @returns {Date|null}
 */
export function parseDateOnly(value) {
  if (!value) return null
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null
    return new Date(value.getFullYear(), value.getMonth(), value.getDate())
  }

  const [datePart] = String(value).split('T')
  const parts = datePart.split('-').map(Number)

  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  const [year, month, day] = parts
  return new Date(year, month - 1, day)
}

/**
 * Format tanggal ke format Indonesia panjang.
 * @param {string|Date|null|undefined} value
 * @param {{ withTime?: boolean, fallback?: string }} options
 * @returns {string}
 */
export function formatDate(value = '', options = {}) {
  const date = options.withTime ? new Date(value) : parseDateOnly(value)
  const fallback = options.fallback ?? '-'

  if (!date || Number.isNaN(date.getTime())) return fallback

  return options.withTime ? dateTimeFormatter.format(date) : dateFormatter.format(date)
}

/**
 * Hitung selisih hari inklusif antar tanggal.
 * @param {string|Date} tanggalMulai
 * @param {string|Date} tanggalSelesai
 * @returns {number}
 */
export function hitungDurasiHari(tanggalMulai, tanggalSelesai) {
  const mulai = parseDateOnly(tanggalMulai)
  const selesai = parseDateOnly(tanggalSelesai)

  if (!mulai || !selesai) return 0

  const start = Date.UTC(mulai.getFullYear(), mulai.getMonth(), mulai.getDate())
  const end = Date.UTC(selesai.getFullYear(), selesai.getMonth(), selesai.getDate())

  return Math.floor((end - start) / 86400000) + 1
}
