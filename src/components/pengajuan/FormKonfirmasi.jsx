import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import { BuktiTransferUpload } from './BuktiTransferUpload'
import { PratinjauSurat } from './PratinjauSurat'

export function FormKonfirmasi({ aset, form, biaya, konfigurasi, buktiTransferFile, onBuktiChange, agreed, onAgreeChange }) {
  return (
    <div className="space-y-5">
      <PratinjauSurat aset={aset} form={form} konfigurasi={konfigurasi} />
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="font-display text-lg font-bold text-primary">Ringkasan Pengajuan</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-500">Nama</dt><dd className="font-semibold text-primary">{form.nama}</dd></div>
          <div><dt className="text-slate-500">Aset</dt><dd className="font-semibold text-primary">{aset.nama}</dd></div>
          <div><dt className="text-slate-500">Tanggal</dt><dd>{formatDate(form.tanggalMulai)} - {formatDate(form.tanggalSelesai)}</dd></div>
          <div><dt className="text-slate-500">Total Biaya</dt><dd className="font-mono font-bold text-primary">{formatCurrency(biaya.totalBiaya)}</dd></div>
        </dl>
      </div>
      {biaya.totalBiaya > 0 ? (
        <div className="rounded-2xl border border-accent-light bg-accent-pale p-5">
          <h3 className="font-display text-base font-bold text-primary">Pembayaran Awal</h3>
          <p className="mt-2 text-sm text-slate-700">
            Transfer ke {konfigurasi?.rekeningBank ?? 'rekening instansi'} {konfigurasi?.rekeningNomor ?? ''} a.n. {konfigurasi?.rekeningAtasNama ?? '-'}
          </p>
          <BuktiTransferUpload file={buktiTransferFile} onChange={onBuktiChange} />
        </div>
      ) : null}
      <label className="flex items-start gap-3 rounded-xl bg-surface p-4 text-sm text-slate-700">
        <input checked={agreed} className="mt-1 h-4 w-4 accent-primary" type="checkbox" onChange={(event) => onAgreeChange(event.target.checked)} />
        <span>Saya menyetujui syarat dan ketentuan peminjaman fasilitas.</span>
      </label>
    </div>
  )
}
