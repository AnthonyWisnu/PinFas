import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CheckCircle, FileWarning } from 'lucide-react'
import { BadgeStatus } from '../../components/common/BadgeStatus'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { usePengajuan } from '../../hooks/usePengajuan'
import { formatDate } from '../../utils/formatDate'

export function VerifikasiSuratPage() {
  const { nomorPengajuan } = useParams()
  const { verifikasiSurat, loading, error } = usePengajuan()
  const [surat, setSurat] = useState(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    async function load() {
      const result = await verifikasiSurat(nomorPengajuan)
      setSurat(result.data)
      setChecked(true)
    }
    void load()
  }, [nomorPengajuan, verifikasiSurat])

  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${surat ? 'bg-secondary-pale text-secondary' : 'bg-[#FEE2E2] text-[#9B1C1C]'}`}>
            {surat ? <CheckCircle aria-hidden="true" size={30} /> : <FileWarning aria-hidden="true" size={30} />}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Verifikasi Surat</p>
            <h1 className="font-display text-3xl font-bold text-primary">{surat ? 'Surat Valid' : 'Pengecekan Keaslian'}</h1>
            <p className="mt-2 text-sm text-slate-600">Nomor: <span className="font-mono font-semibold">{nomorPengajuan}</span></p>
          </div>
        </div>
        {loading ? <LoadingSpinner mode="section" /> : null}
        {error ? <EmptyState mode="error" title="Gagal Memverifikasi" description={error} /> : null}
        {!loading && checked && !error && !surat ? (
          <EmptyState
            mode="error"
            title="Surat Tidak Valid"
            description="Nomor surat tidak ditemukan atau status pengajuan belum disetujui."
          />
        ) : null}
        {surat ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-surface p-4">
              <p className="text-xs font-semibold text-slate-500">Status</p>
              <div className="mt-2"><BadgeStatus status={surat.status} /></div>
            </div>
            <div className="rounded-xl bg-surface p-4">
              <p className="text-xs font-semibold text-slate-500">Nama Peminjam</p>
              <p className="mt-1 font-semibold text-primary">{surat.nama}</p>
            </div>
            <div className="rounded-xl bg-surface p-4">
              <p className="text-xs font-semibold text-slate-500">Aset</p>
              <p className="mt-1 font-semibold text-primary">{surat.namaAset}</p>
            </div>
            <div className="rounded-xl bg-surface p-4">
              <p className="text-xs font-semibold text-slate-500">Tanggal Acara</p>
              <p className="mt-1 font-semibold text-primary">{formatDate(surat.tanggalMulai)} - {formatDate(surat.tanggalSelesai)}</p>
            </div>
            <div className="rounded-xl bg-surface p-4 sm:col-span-2">
              <p className="text-xs font-semibold text-slate-500">Disetujui Oleh</p>
              <p className="mt-1 font-semibold text-primary">{surat.namaAdmin ?? '-'} {surat.jabatanAdmin ? `(${surat.jabatanAdmin})` : ''}</p>
              <p className="mt-1 text-sm text-slate-600">{formatDate(surat.approvedAt, { withTime: true })}</p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
