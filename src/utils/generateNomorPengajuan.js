/**
 * Generate nomor pengajuan unik berbasis tanggal dan random id browser.
 * @param {Date} date
 * @returns {string}
 */
export function generateNomorPengajuan(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID().slice(0, 8).toUpperCase()
    : Math.random().toString(36).slice(2, 10).toUpperCase()

  return `PINFAS-${year}${month}${day}-${random}`
}
