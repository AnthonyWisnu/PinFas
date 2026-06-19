import { useCallback, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAppContext } from './useAppContext'

const SELECT = `
  *,
  aset:aset_id (
    id,
    nama,
    kategori_pemilik,
    banjar_id,
    banjar:banjar_id (id, nama)
  ),
  approver:approved_by (id, nama, jabatan)
`

function monthKey(value) {
  return String(value ?? '').slice(0, 7)
}

function makeMonthRange(count = 6) {
  const now = new Date()
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (count - index - 1), 1)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  })
}

function mapTransaksi(row) {
  const aset = row.aset
  const banjar = aset?.banjar
  return {
    id: row.id,
    nomorPengajuan: row.nomor_pengajuan,
    namaAset: aset?.nama ?? '-',
    kategoriPemilik: aset?.kategori_pemilik,
    banjarId: aset?.banjar_id,
    namaBanjar: banjar?.nama ?? 'Desa/Kelurahan',
    keperluan: row.keperluan,
    tanggalMulai: row.tanggal_mulai,
    tanggalSelesai: row.tanggal_selesai,
    tanggalKembaliAktual: row.tanggal_kembali_aktual,
    totalBiaya: row.total_biaya ?? 0,
    dendaKeterlambatan: row.denda_keterlambatan ?? 0,
    totalPemasukan: (row.total_biaya ?? 0) + (row.denda_keterlambatan ?? 0),
    status: row.status,
    approver: row.approver,
    createdAt: row.created_at,
  }
}

function aggregateRows(rows) {
  const kpi = rows.reduce(
    (acc, row) => ({
      totalTransaksi: acc.totalTransaksi + 1,
      totalPemasukan: acc.totalPemasukan + row.totalBiaya,
      totalDenda: acc.totalDenda + row.dendaKeterlambatan,
    }),
    { totalTransaksi: 0, totalPemasukan: 0, totalDenda: 0 },
  )

  const months = makeMonthRange()
  const tren = months.map((bulan) => {
    const transaksi = rows.filter((row) => monthKey(row.tanggalKembaliAktual) === bulan)
    return {
      bulan,
      totalPenyewaan: transaksi.length,
      totalPemasukan: transaksi.reduce((sum, row) => sum + row.totalPemasukan, 0),
    }
  })

  const banjarMap = new Map()
  rows.forEach((row) => {
    const current = banjarMap.get(row.namaBanjar) ?? { namaBanjar: row.namaBanjar, totalPenyewaan: 0, totalPemasukan: 0 }
    current.totalPenyewaan += 1
    current.totalPemasukan += row.totalPemasukan
    banjarMap.set(row.namaBanjar, current)
  })

  return { kpi, tren, perBanjar: [...banjarMap.values()].sort((a, b) => b.totalPemasukan - a.totalPemasukan) }
}

function mapPublicTrend(row) {
  return {
    bulan: row.bulan,
    totalPenyewaan: row.totalPenyewaan ?? row.total_penyewaan ?? 0,
    totalPemasukan: row.totalPemasukan ?? row.total_pemasukan ?? 0,
  }
}

function mapPublicBanjar(row) {
  return {
    namaBanjar: row.namaBanjar ?? row.nama_banjar ?? 'Desa/Kelurahan',
    totalPenyewaan: row.totalPenyewaan ?? row.total_penyewaan ?? 0,
    totalPemasukan: row.totalPemasukan ?? row.total_pemasukan ?? 0,
  }
}

function mapPublicAset(row) {
  return {
    asetId: row.asetId ?? row.aset_id,
    namaAset: row.namaAset ?? row.nama_aset ?? '-',
    totalPenyewaan: row.totalPenyewaan ?? row.total_penyewaan ?? 0,
    totalPemasukan: row.totalPemasukan ?? row.total_pemasukan ?? 0,
  }
}

async function exportRowsToExcel(rows, fileName) {
  const XLSX = await import('xlsx')
  const sheet = XLSX.utils.json_to_sheet(
    rows.map((row) => ({
      Nomor: row.nomorPengajuan,
      Aset: row.namaAset,
      Banjar: row.namaBanjar,
      Keperluan: row.keperluan,
      Mulai: row.tanggalMulai,
      Selesai: row.tanggalSelesai,
      Kembali: row.tanggalKembaliAktual,
      Biaya: row.totalBiaya,
      Denda: row.dendaKeterlambatan,
      Total: row.totalPemasukan,
    })),
  )
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, 'Laporan')
  XLSX.writeFile(workbook, fileName)
}

export function useLaporan() {
  const {
    state: { currentUser },
  } = useAppContext()
  const [transaksi, setTransaksi] = useState([])
  const [laporanPublik, setLaporanPublik] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchLaporan = useCallback(async (filters = {}) => {
    setLoading(true)
    setError(null)
    let query = supabase.from('pengajuan').select(SELECT).eq('status', 'selesai').order('tanggal_kembali_aktual', { ascending: false })
    if (filters.tanggalMulai) query = query.gte('tanggal_kembali_aktual', filters.tanggalMulai)
    if (filters.tanggalSelesai) query = query.lte('tanggal_kembali_aktual', filters.tanggalSelesai)

    const { data, error: requestError } = await query
    setLoading(false)
    if (requestError) {
      setError(requestError.message)
      return { data: [], error: requestError }
    }

    const mapped = (data ?? []).map(mapTransaksi)
    setTransaksi(mapped)
    return { data: mapped, error: null }
  }, [])

  const fetchLaporanPublik = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: requestError } = await supabase.rpc('laporan_publik_ringkas')
    setLoading(false)
    if (requestError) {
      setError(requestError.message)
      return { data: null, error: requestError }
    }
    setLaporanPublik(data)
    return { data, error: null }
  }, [])

  const exportExcel = useCallback(async (fileName = 'laporan-pinfas.xlsx') => {
    await exportRowsToExcel(transaksi, fileName)
  }, [transaksi])

  const agregat = useMemo(() => aggregateRows(transaksi), [transaksi])
  const publicAgregat = useMemo(() => {
    if (!laporanPublik) return null
    return {
      kpi: laporanPublik.kpi ?? {},
      tren: (laporanPublik.tren ?? []).map(mapPublicTrend),
      perBanjar: (laporanPublik.perBanjar ?? []).map(mapPublicBanjar),
      perAset: (laporanPublik.perAset ?? []).map(mapPublicAset),
    }
  }, [laporanPublik])

  return {
    currentUser,
    transaksi,
    loading,
    error,
    kpi: agregat.kpi,
    tren: agregat.tren,
    perBanjar: agregat.perBanjar,
    laporanPublik: publicAgregat,
    fetchLaporan,
    fetchLaporanPublik,
    exportExcel,
  }
}
