import { FileText } from 'lucide-react'
import { formatDate } from '../../utils/formatDate'

export function PratinjauSurat({ aset, form, konfigurasi }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="flex items-center gap-2 font-display text-lg font-bold text-primary">
        <FileText aria-hidden="true" size={20} />
        Pratinjau Surat Izin
      </h2>
      <div className="mt-4 rounded-xl bg-surface p-4 text-sm leading-7 text-slate-700">
        <p>
          {konfigurasi?.namaInstansi ?? 'Instansi'} akan memverifikasi pengajuan peminjaman fasilitas
          <strong> {aset?.nama}</strong> untuk keperluan <strong>{form.keperluan || '-'}</strong> pada{' '}
          <strong>{formatDate(form.tanggalMulai)}</strong> sampai <strong>{formatDate(form.tanggalSelesai)}</strong>.
        </p>
        <p className="mt-3">Surat resmi dapat diunduh setelah pengajuan disetujui petugas.</p>
      </div>
    </section>
  )
}
