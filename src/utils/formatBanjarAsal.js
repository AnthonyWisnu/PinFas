/**
 * Format nilai banjar_asal agar UUID banjar tidak tampil di UI.
 * @param {string|null|undefined} value
 * @param {{ id: string, nama: string }[]} banjarOptions
 * @returns {string}
 */
export function formatBanjarAsal(value, banjarOptions = []) {
  if (!value) return '-'
  if (value === 'luar_desa') return 'Luar Desa/Kelurahan'

  const found = banjarOptions.find((banjar) => banjar.id === value || banjar.nama === value)
  return found?.nama ?? value
}
