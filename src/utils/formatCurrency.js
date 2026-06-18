const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

/**
 * Format angka menjadi Rupiah lengkap untuk tampilan UI.
 * @param {number|string|null|undefined} value
 * @returns {string}
 */
export function formatCurrency(value = 0) {
  const amount = Number(value ?? 0)

  if (Number.isNaN(amount)) {
    return 'Rp 0'
  }

  return rupiahFormatter.format(amount).replace(/\u00a0/g, ' ')
}
