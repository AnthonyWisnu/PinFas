import { useState } from 'react'
import { Calendar, FileDown, X } from 'lucide-react'
import { BadgeStatus } from '../common/BadgeStatus'
import { ButtonPrimary } from '../common/ButtonPrimary'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import { BuktiTransferUpload } from './BuktiTransferUpload'

export function RingkasanPengajuan({
  pengajuan,
  buktiFile,
  konfigurasi,
  verificationBaseUrl,
  onBuktiChange,
  onUploadBukti,
  onBatalkan,
  onMuatSurat,
  loading = false,
}) {
  const [suratLoading, setSuratLoading] = useState(false)
  const [suratError, setSuratError] = useState(null)

  const createQrDataUrl = async (value) => {
    const [{ createRoot }, { QRCodeCanvas }] = await Promise.all([
      import('react-dom/client'),
      import('qrcode.react'),
    ])
    const container = document.createElement('div')
    container.className = 'fixed -left-[9999px] top-0'
    document.body.appendChild(container)
    const root = createRoot(container)
    root.render(<QRCodeCanvas bgColor="#FFFFFF" fgColor="#0D2137" includeMargin size={144} value={value} />)
    await new Promise((resolve) => setTimeout(resolve, 30))
    const dataUrl = container.querySelector('canvas')?.toDataURL('image/png')
    root.unmount()
    container.remove()
    return dataUrl
  }

  const handleUnduhSurat = async () => {
    setSuratError(null)
    setSuratLoading(true)
    const result = await onMuatSurat?.(pengajuan)
    if (result?.error || !result?.data) {
      setSuratLoading(false)
      setSuratError(result?.error?.message ?? 'Surat belum dapat diunduh.')
      return
    }

    try {
      const [{ pdf }, { SuratIzinPDF }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./SuratIzinPDF'),
      ])
      const baseUrl = verificationBaseUrl ?? window.location.origin
      const qrDataUrl = await createQrDataUrl(`${baseUrl}/verifikasi/${result.data.nomorPengajuan}`)
      const blob = await pdf(
        <SuratIzinPDF konfigurasi={konfigurasi} qrDataUrl={qrDataUrl} surat={result.data} verificationBaseUrl={baseUrl} />,
      ).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `surat-izin-${pengajuan.nomorPengajuan}.pdf`
      link.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (pdfError) {
      setSuratError(pdfError.message)
    } finally {
      setSuratLoading(false)
    }
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-sm font-semibold text-primary">{pengajuan.nomorPengajuan}</p>
          <h2 className="mt-1 font-display text-lg font-bold text-primary">{pengajuan.namaAset}</h2>
        </div>
        <BadgeStatus status={pengajuan.status} />
      </div>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <p className="flex items-center gap-2 text-slate-600"><Calendar aria-hidden="true" size={16} />{formatDate(pengajuan.tanggalMulai)} - {formatDate(pengajuan.tanggalSelesai)}</p>
        <p className="font-mono font-semibold text-primary">{formatCurrency(pengajuan.totalBiaya)}</p>
      </div>
      {pengajuan.alasanTolak ? <p className="mt-4 rounded-xl bg-[#FEE2E2] p-3 text-sm text-[#9B1C1C]">{pengajuan.alasanTolak}</p> : null}
      {pengajuan.catatanPembayaran ? <p className="mt-4 rounded-xl bg-[#FEE2E2] p-3 text-sm text-[#9B1C1C]">{pengajuan.catatanPembayaran}</p> : null}
      {suratError ? <p className="mt-4 rounded-xl bg-[#FEE2E2] p-3 text-sm text-[#9B1C1C]">{suratError}</p> : null}
      {pengajuan.status === 'menunggu_pembayaran' ? (
        <div className="mt-4 rounded-xl border border-accent-light bg-accent-pale p-4">
          <p className="text-sm font-bold text-primary">Selesaikan pembayaran lalu unggah bukti transfer.</p>
          <BuktiTransferUpload file={buktiFile} onChange={onBuktiChange} />
          <ButtonPrimary className="mt-4 w-full" loading={loading} variant="accent" onClick={onUploadBukti}>Kirim Bukti Transfer</ButtonPrimary>
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-3">
        {['approved', 'selesai'].includes(pengajuan.status) ? (
          <ButtonPrimary icon={FileDown} loading={suratLoading} variant="secondary" onClick={handleUnduhSurat}>
            Unduh Surat
          </ButtonPrimary>
        ) : null}
        {pengajuan.status === 'pending' ? <ButtonPrimary icon={X} variant="ghost" onClick={onBatalkan}>Batalkan</ButtonPrimary> : null}
      </div>
    </article>
  )
}
