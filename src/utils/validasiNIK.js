/**
 * Validasi NIK 16 digit sesuai pola dasar Dukcapil.
 * @param {string|number} nik
 * @returns {{ valid: boolean, message: string, value: string }}
 */
export function validasiNIK(nik = '') {
  const value = String(nik ?? '').trim()

  if (!/^\d+$/.test(value)) {
    return { valid: false, message: 'NIK harus terdiri dari angka.', value }
  }

  if (value.length !== 16) {
    return { valid: false, message: 'NIK harus terdiri dari 16 digit angka.', value }
  }

  const kodeWilayah = value.slice(0, 6)
  const tanggalLahir = Number(value.slice(6, 8))
  const bulanLahir = Number(value.slice(8, 10))
  const nomorUrut = value.slice(12, 16)

  if (kodeWilayah === '000000') {
    return { valid: false, message: 'Kode wilayah pada NIK tidak valid.', value }
  }

  if (tanggalLahir < 1 || tanggalLahir > 71) {
    return { valid: false, message: 'Tanggal lahir pada NIK tidak valid.', value }
  }

  const tanggalNormal = tanggalLahir > 40 ? tanggalLahir - 40 : tanggalLahir

  if (tanggalNormal < 1 || tanggalNormal > 31 || bulanLahir < 1 || bulanLahir > 12) {
    return { valid: false, message: 'Tanggal lahir pada NIK tidak valid.', value }
  }

  if (nomorUrut === '0000') {
    return { valid: false, message: 'Nomor urut pada NIK tidak valid.', value }
  }

  return { valid: true, message: '', value }
}

/**
 * Shortcut boolean untuk validasi NIK.
 * @param {string|number} nik
 * @returns {boolean}
 */
export function isNIKValid(nik = '') {
  return validasiNIK(nik).valid
}
