import { parseDateOnly } from './formatDate.js'

const MILLISECONDS_PER_DAY = 86400000

/**
 * Hitung jumlah hari keterlambatan pengembalian aset.
 * @param {string|Date} tanggalSelesai
 * @param {string|Date} tanggalKembaliAktual
 * @returns {number}
 */
export function hitungHariTerlambat(tanggalSelesai, tanggalKembaliAktual) {
  const selesai = parseDateOnly(tanggalSelesai)
  const kembali = parseDateOnly(tanggalKembaliAktual)

  if (!selesai || !kembali) return 0

  const end = Date.UTC(selesai.getFullYear(), selesai.getMonth(), selesai.getDate())
  const returned = Date.UTC(kembali.getFullYear(), kembali.getMonth(), kembali.getDate())

  return Math.max(0, Math.floor((returned - end) / MILLISECONDS_PER_DAY))
}

/**
 * Hitung denda keterlambatan pengembalian.
 * @param {{ tanggalSelesai?: string|Date, tanggalKembaliAktual?: string|Date, tarifPerHari?: number, statusBiaya?: string, tarifDendaGratis?: number }} input
 * @returns {{ hariTerlambat: number, tarifDendaPerHari: number, denda: number }}
 */
export function kalkulasiDenda(input = {}) {
  const hariTerlambat = hitungHariTerlambat(input.tanggalSelesai, input.tanggalKembaliAktual)
  const tarifDendaPerHari =
    input.statusBiaya === 'gratis' ? Number(input.tarifDendaGratis ?? 50000) : Number(input.tarifPerHari ?? 0)

  return {
    hariTerlambat,
    tarifDendaPerHari,
    denda: hariTerlambat * tarifDendaPerHari,
  }
}
