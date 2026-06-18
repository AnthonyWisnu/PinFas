export const pengajuanStatusOptions = [
  { value: 'semua', label: 'Semua Status' },
  { value: 'pending', label: 'Menunggu Verifikasi' },
  { value: 'perlu_cek_bayar', label: 'Perlu Cek Bayar' },
  { value: 'approved', label: 'Disetujui' },
  { value: 'terlambat', label: 'Terlambat' },
  { value: 'selesai', label: 'Selesai' },
  { value: 'rejected', label: 'Ditolak' },
  { value: 'dibatalkan', label: 'Dibatalkan' },
]

export function isPerluCekBayar(item) {
  return (
    (item.status === 'pending' && item.totalBiaya > 0 && item.buktiTransferUrl)
    || item.status === 'menunggu_konfirmasi_bayar'
  )
}
