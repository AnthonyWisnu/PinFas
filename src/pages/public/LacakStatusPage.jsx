import { useState } from 'react'
import { Search } from 'lucide-react'
import { ButtonPrimary } from '../../components/common/ButtonPrimary'
import { EmptyState } from '../../components/common/EmptyState'
import { RingkasanPengajuan } from '../../components/pengajuan/RingkasanPengajuan'
import { useAppContext } from '../../hooks/useAppContext'
import { usePengajuan } from '../../hooks/usePengajuan'

export function LacakStatusPage() {
  const {
    state: { currentCitizen, konfigurasi },
  } = useAppContext()
  const { lacakPengajuan, uploadBuktiTransfer, batalkanPending, fetchDetailSurat, loading } = usePengajuan()
  const [query, setQuery] = useState(currentCitizen?.nik ?? '')
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [buktiFiles, setBuktiFiles] = useState({})
  const [error, setError] = useState(null)

  const search = async (event) => {
    event.preventDefault()
    setError(null)
    const result = await lacakPengajuan(query)
    setSearched(true)
    if (result.error) setError(result.error.message)
    setResults(result.data)
  }

  const refresh = async () => {
    const result = await lacakPengajuan(query)
    setResults(result.data)
  }

  const handleUpload = async (item) => {
    const file = buktiFiles[item.id]
    if (!file) {
      setError('Pilih file bukti transfer terlebih dahulu.')
      return
    }
    const result = await uploadBuktiTransfer({ pengajuan: item, identifier: query, file })
    if (result.error) setError(result.error.message)
    await refresh()
  }

  const handleBatalkan = async (item) => {
    const result = await batalkanPending({ pengajuan: item, identifier: query })
    if (result.error) setError(result.error.message)
    await refresh()
  }

  const handleMuatSurat = (item) =>
    fetchDetailSurat({
      nomorPengajuan: item.nomorPengajuan,
      identifier: currentCitizen?.nik ?? query,
    })

  return (
    <>
      <section className="bg-gradient-to-br from-primary via-primary-mid to-accent px-6 py-14 text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-3xl font-black">Lacak Status Pengajuan</h1>
          <p className="mt-3 text-sm leading-6 text-white/80">Cari menggunakan NIK, nomor HP, atau nomor pengajuan.</p>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-6 py-8">
        <form className="-mt-14 rounded-2xl bg-white p-5 shadow-xl" onSubmit={search}>
          <label className="flex flex-col gap-2 text-sm font-semibold text-primary">
            NIK / Nomor HP / Nomor Pengajuan
            <div className="flex flex-col gap-3 sm:flex-row">
              <input className="min-w-0 flex-1 rounded-lg border border-slate-200 px-4 py-3 font-mono text-sm" value={query} onChange={(event) => setQuery(event.target.value)} />
              <ButtonPrimary icon={Search} loading={loading} type="submit">Cari</ButtonPrimary>
            </div>
          </label>
        </form>
        {error ? <EmptyState description={error} mode="error" title="Gagal Melacak" /> : null}
        {!error && searched && results.length === 0 ? <EmptyState description="Tidak ada pengajuan yang cocok dengan data tersebut." title="Pengajuan Tidak Ditemukan" /> : null}
        <div className="mt-6 space-y-4">
          {results.map((item) => (
            <RingkasanPengajuan
              key={item.id}
              buktiFile={buktiFiles[item.id]}
              konfigurasi={konfigurasi}
              loading={loading}
              pengajuan={item}
              verificationBaseUrl={window.location.origin}
              onBatalkan={() => handleBatalkan(item)}
              onBuktiChange={(file) => setBuktiFiles((current) => ({ ...current, [item.id]: file }))}
              onMuatSurat={handleMuatSurat}
              onUploadBukti={() => handleUpload(item)}
            />
          ))}
        </div>
      </section>
    </>
  )
}
