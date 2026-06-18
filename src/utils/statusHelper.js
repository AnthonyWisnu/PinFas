export const STATUS_META = {
  pending: {
    label: 'Menunggu Verifikasi',
    icon: 'Clock',
    className: 'bg-[#FEF3C7] text-[#92400E] border-[#FCD34D]',
  },
  menunggu_pembayaran: {
    label: 'Menunggu Pembayaran',
    icon: 'CreditCard',
    className: 'bg-[#FDF6E3] text-[#9A7A2E] border-[#E8C96A]',
  },
  menunggu_konfirmasi_bayar: {
    label: 'Menunggu Konfirmasi',
    icon: 'Hourglass',
    className: 'bg-[#E8F0F8] text-[#1A3A5C] border-[#2E6DA4]',
  },
  approved: {
    label: 'Disetujui',
    icon: 'CheckCircle',
    className: 'bg-[#E6F4F0] text-[#0A5C46] border-[#138A68]',
  },
  rejected: {
    label: 'Ditolak',
    icon: 'XCircle',
    className: 'bg-[#FEE2E2] text-[#9B1C1C] border-[#FCA5A5]',
  },
  dibatalkan: {
    label: 'Dibatalkan',
    icon: 'Ban',
    className: 'bg-[#F3F4F6] text-[#4A5568] border-[#CBD5E0]',
  },
  terlambat: {
    label: 'Terlambat',
    icon: 'AlertTriangle',
    className: 'bg-[#FEE2E2] text-[#9B1C1C] border-[#FCA5A5]',
  },
  selesai: {
    label: 'Selesai',
    icon: 'PackageCheck',
    className: 'bg-[#E6F4F0] text-[#0A5C46] border-[#138A68]',
  },
  tersedia: {
    label: 'Tersedia',
    icon: 'CheckCircle',
    className: 'bg-[#E6F4F0] text-[#0A5C46] border-[#138A68]',
  },
  maintenance: {
    label: 'Maintenance',
    icon: 'Wrench',
    className: 'bg-[#FEF3C7] text-[#92400E] border-[#FCD34D]',
  },
  terpakai: {
    label: 'Terpakai',
    icon: 'CalendarX',
    className: 'bg-[#F3F4F6] text-[#4A5568] border-[#CBD5E0]',
  },
}

/**
 * Ambil label, ikon, dan class Tailwind untuk status pengajuan/aset.
 * @param {string} status
 * @returns {{ label: string, icon: string, className: string }}
 */
export function getStatusMeta(status) {
  return (
    STATUS_META[status] ?? {
      label: status || 'Tidak Diketahui',
      icon: 'Info',
      className: 'bg-[#F3F4F6] text-[#4A5568] border-[#CBD5E0]',
    }
  )
}
