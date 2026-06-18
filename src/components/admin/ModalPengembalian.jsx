import { useEffect, useMemo, useState } from 'react'
import { Modal } from '../common/Modal'
import { formatCurrency } from '../../utils/formatCurrency'
import { kalkulasiDenda } from '../../utils/kalkulasiDenda'

export function ModalPengembalian({ open, pengajuan, konfigurasi, loading, onClose, onConfirm }) {
  const [tanggalKembaliAktual, setTanggalKembaliAktual] = useState('')
  const [kondisiKembali, setKondisiKembali] = useState('baik')
  const [catatanPengembalian, setCatatanPengembalian] = useState('')
  const [checklistSesudah, setChecklistSesudah] = useState({})

  useEffect(() => {
    if (!open) return
    const today = new Date()
    setTanggalKembaliAktual(today.toISOString().slice(0, 10))
    setKondisiKembali('baik')
    setCatatanPengembalian('')
    setChecklistSesudah({})
  }, [open])

  const denda = useMemo(
    () =>
      kalkulasiDenda({
        tanggalSelesai: pengajuan?.tanggalSelesai,
        tanggalKembaliAktual,
        tarifPerHari: pengajuan?.tarifPerHari,
        statusBiaya: pengajuan?.aset?.statusBiaya,
        tarifDendaGratis: konfigurasi?.tarifDendaGratis,
      }),
    [konfigurasi?.tarifDendaGratis, pengajuan, tanggalKembaliAktual],
  )

  const checklist = pengajuan?.aset?.checklistKondisi ?? []

  return (
    <Modal
      confirmLabel="Selesaikan Pengajuan"
      description="Isi kondisi aset setelah digunakan warga."
      loading={loading}
      open={open}
      title="Konfirmasi Pengembalian"
      type="kembali"
      onClose={onClose}
      onConfirm={() => onConfirm({ tanggalKembaliAktual, kondisiKembali, catatanPengembalian, checklistSesudah, dendaKeterlambatan: denda.denda })}
    >
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-primary">
          Tanggal kembali aktual
          <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" type="date" value={tanggalKembaliAktual} onChange={(e) => setTanggalKembaliAktual(e.target.value)} />
        </label>
        <div className="rounded-xl bg-surface p-3 text-sm text-slate-600">
          Keterlambatan {denda.hariTerlambat} hari, denda {formatCurrency(denda.denda)}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {['baik', 'ada_kerusakan'].map((value) => (
            <button key={value} className={`rounded-xl border px-3 py-2 text-sm font-semibold ${kondisiKembali === value ? 'border-primary bg-primary text-white' : 'border-slate-200'}`} type="button" onClick={() => setKondisiKembali(value)}>
              {value === 'baik' ? 'Baik' : 'Ada Kerusakan'}
            </button>
          ))}
        </div>
        {checklist.length > 0 ? (
          <div className="space-y-2">
            {checklist.map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm text-slate-700">
                <input checked={Boolean(checklistSesudah[item])} type="checkbox" onChange={(e) => setChecklistSesudah((v) => ({ ...v, [item]: e.target.checked }))} />
                {item}
              </label>
            ))}
          </div>
        ) : null}
        <label className="block text-sm font-semibold text-primary">
          Catatan pengembalian
          <textarea className="mt-1 min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2" value={catatanPengembalian} onChange={(e) => setCatatanPengembalian(e.target.value)} />
        </label>
      </div>
    </Modal>
  )
}
