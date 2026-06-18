import { hitungDurasiHari } from './formatDate.js'

/**
 * Tentukan kategori tarif berdasarkan pemilik aset dan domisili peminjam.
 * @param {{ kategoriPemilik?: string, banjarId?: string|null }} aset
 * @param {string} banjarAsal
 * @returns {'lokal'|'antar_banjar'|'luar_desa'}
 */
export function tentukanKategoriTarif(aset = {}, banjarAsal = '') {
  if (banjarAsal === 'luar_desa') {
    return 'luar_desa'
  }

  if (aset.kategoriPemilik === 'banjar' && aset.banjarId && banjarAsal !== aset.banjarId) {
    return 'antar_banjar'
  }

  return 'lokal'
}

/**
 * Hitung tarif peminjaman aset per hari dan total biaya.
 * @param {{ statusBiaya?: string, kategoriPemilik?: string, banjarId?: string|null, tarifLokal?: number, tarifAntarBanjar?: number, tarifLuarDesa?: number }} aset
 * @param {{ banjarAsal?: string, durasiHari?: number, tanggalMulai?: string|Date, tanggalSelesai?: string|Date }} input
 * @returns {{ kategoriTarif: 'lokal'|'antar_banjar'|'luar_desa', tarifPerHari: number, durasiHari: number, totalBiaya: number }}
 */
export function kalkulasiTarif(aset = {}, input = {}) {
  const kategoriTarif = tentukanKategoriTarif(aset, input.banjarAsal)
  const durasiHari = Number(input.durasiHari ?? hitungDurasiHari(input.tanggalMulai, input.tanggalSelesai))
  const durasiValid = Number.isFinite(durasiHari) && durasiHari > 0 ? durasiHari : 0

  if (aset.statusBiaya !== 'berbayar') {
    return { kategoriTarif, tarifPerHari: 0, durasiHari: durasiValid, totalBiaya: 0 }
  }

  const tarifMap = {
    lokal: Number(aset.tarifLokal ?? 0),
    antar_banjar: Number(aset.tarifAntarBanjar ?? 0),
    luar_desa: Number(aset.tarifLuarDesa ?? 0),
  }
  const tarifPerHari = tarifMap[kategoriTarif] ?? 0

  return {
    kategoriTarif,
    tarifPerHari,
    durasiHari: durasiValid,
    totalBiaya: tarifPerHari * durasiValid,
  }
}
