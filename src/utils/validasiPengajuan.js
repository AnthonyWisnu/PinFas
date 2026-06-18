import { hitungDurasiHari, parseDateOnly } from './formatDate.js'
import { validasiNIK } from './validasiNIK.js'

const STATUS_AKTIF = ['pending', 'menunggu_pembayaran', 'menunggu_konfirmasi_bayar', 'approved', 'terlambat']

function toDateKey(value) {
  const date = parseDateOnly(value)
  if (!date) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function addDays(value, days) {
  const date = parseDateOnly(value)
  if (!date) return null
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function isDateBetween(target, start, end) {
  const date = parseDateOnly(target)
  const mulai = parseDateOnly(start)
  const selesai = parseDateOnly(end)

  if (!date || !mulai || !selesai) return false

  return date >= mulai && date <= selesai
}

function hasOverlap(tanggalMulai, tanggalSelesai, ranges = []) {
  const mulai = parseDateOnly(tanggalMulai)
  const selesai = parseDateOnly(tanggalSelesai)

  if (!mulai || !selesai) return false

  return ranges.some((range) => {
    const rangeMulai = parseDateOnly(range.tanggalMulai ?? range.tanggal_mulai)
    const rangeSelesai = parseDateOnly(range.tanggalSelesai ?? range.tanggal_selesai)

    if (!rangeMulai || !rangeSelesai) return false

    return mulai <= rangeSelesai && selesai >= rangeMulai
  })
}

/**
 * Validasi data pengajuan sebelum insert ke Supabase.
 * @param {{ pengajuan?: object, aset?: object, konfigurasi?: object, tanggalTerpakai?: object[], blacklistTanggal?: object[], pengajuanAktif?: object[], today?: string|Date }} input
 * @returns {{ valid: boolean, errors: Record<string, string>, durasiHari: number }}
 */
export function validasiPengajuan(input = {}) {
  const pengajuan = input.pengajuan ?? input
  const aset = input.aset ?? {}
  const konfigurasi = input.konfigurasi ?? {}
  const errors = {}

  const nikResult = validasiNIK(pengajuan.nik)
  if (!nikResult.valid) errors.nik = nikResult.message

  if (!String(pengajuan.nama ?? '').trim()) errors.nama = 'Nama lengkap wajib diisi.'
  if (!/^08\d{8,13}$/.test(String(pengajuan.nomorHp ?? '').trim())) {
    errors.nomorHp = 'Nomor HP harus diawali 08 dan terdiri dari 10-15 digit.'
  }
  if (!String(pengajuan.banjarAsal ?? '').trim()) errors.banjarAsal = 'Banjar asal wajib dipilih.'
  if (!String(pengajuan.keperluan ?? '').trim()) errors.keperluan = 'Keperluan acara wajib diisi.'

  const tanggalMulai = parseDateOnly(pengajuan.tanggalMulai)
  const tanggalSelesai = parseDateOnly(pengajuan.tanggalSelesai)
  const durasiHari = hitungDurasiHari(pengajuan.tanggalMulai, pengajuan.tanggalSelesai)

  if (!tanggalMulai) errors.tanggalMulai = 'Tanggal mulai wajib diisi.'
  if (!tanggalSelesai) errors.tanggalSelesai = 'Tanggal selesai wajib diisi.'
  if (tanggalMulai && tanggalSelesai && tanggalSelesai < tanggalMulai) {
    errors.tanggalSelesai = 'Tanggal selesai tidak boleh sebelum tanggal mulai.'
  }

  const minimalHari = Number(konfigurasi.minimalHariPengajuan ?? 3)
  const batasMinimal = addDays(input.today ?? new Date(), minimalHari)
  if (tanggalMulai && batasMinimal && tanggalMulai < batasMinimal) {
    errors.tanggalMulai = `Tanggal mulai minimal H+${minimalHari} dari hari ini.`
  }

  if (aset.kapasitas && Number(pengajuan.estimasiTamu ?? 0) > Number(aset.kapasitas)) {
    errors.estimasiTamu = `Estimasi tamu melebihi kapasitas aset (${aset.kapasitas} orang).`
  }

  if (hasOverlap(pengajuan.tanggalMulai, pengajuan.tanggalSelesai, input.tanggalTerpakai ?? [])) {
    errors.tanggalMulai = 'Tanggal yang dipilih sudah terpakai.'
  }

  const blacklist = input.blacklistTanggal ?? []
  const blocked = blacklist.find((item) => {
    const tanggal = item.tanggal
    return tanggal && isDateBetween(tanggal, pengajuan.tanggalMulai, pengajuan.tanggalSelesai)
  })
  if (blocked) {
    errors.tanggalMulai = `Tanggal ${toDateKey(blocked.tanggal)} tidak tersedia.${blocked.keterangan ? ` ${blocked.keterangan}` : ''}`
  }

  if (aset.statusBiaya === 'gratis' && durasiHari > 0) {
    const batasGratis =
      pengajuan.banjarAsal === 'luar_desa'
        ? Number(konfigurasi.batasHariGratisLuar ?? 1)
        : Number(konfigurasi.batasHariGratisLokal ?? 3)

    if (durasiHari > batasGratis) {
      errors.tanggalSelesai = `Aset gratis hanya dapat dipinjam maksimal ${batasGratis} hari.`
    }
  }

  const aktifCount = (input.pengajuanAktif ?? []).filter((item) => STATUS_AKTIF.includes(item.status)).length
  if (aktifCount >= 2) {
    errors.nik = 'Satu NIK maksimal memiliki 2 pengajuan aktif.'
  }

  return { valid: Object.keys(errors).length === 0, errors, durasiHari }
}
