import { EmptyState } from '../common/EmptyState'
import { RingkasanPengajuan } from '../pengajuan/RingkasanPengajuan'
import { useState } from 'react'

export function WargaRiwayatList({ items = [], konfigurasi, verificationBaseUrl, onUploadBukti, onBatalkan, onMuatSurat, loading }) {
  const [files, setFiles] = useState({})

  if (items.length === 0) {
    return <EmptyState description="Riwayat pengajuan akan muncul otomatis setelah Anda mengajukan peminjaman." title="Belum Ada Riwayat" />
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <RingkasanPengajuan
          key={item.id}
          buktiFile={files[item.id]}
          konfigurasi={konfigurasi}
          loading={loading}
          pengajuan={item}
          verificationBaseUrl={verificationBaseUrl}
          onBatalkan={() => onBatalkan(item)}
          onBuktiChange={(file) => setFiles((current) => ({ ...current, [item.id]: file }))}
          onMuatSurat={onMuatSurat}
          onUploadBukti={() => onUploadBukti(item, files[item.id])}
        />
      ))}
    </div>
  )
}
