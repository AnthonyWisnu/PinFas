import { useCallback, useState } from 'react'
import { supabase } from '../lib/supabase'
import { generateNomorPengajuan } from '../utils/generateNomorPengajuan'
import { kalkulasiTarif } from '../utils/kalkulasiTarif'
import { formatBanjarAsal } from '../utils/formatBanjarAsal'
import { validasiPengajuan } from '../utils/validasiPengajuan'

function mapPengajuan(row, banjarOptions = []) {
  return {
    id: row.id,
    nomorPengajuan: row.nomor_pengajuan,
    asetId: row.aset_id,
    namaAset: row.nama_aset ?? row.aset?.nama,
    banjarAsal: formatBanjarAsal(row.banjar_asal, banjarOptions),
    keperluan: row.keperluan,
    tanggalMulai: row.tanggal_mulai,
    tanggalSelesai: row.tanggal_selesai,
    durasiHari: row.durasi_hari,
    kategoriTarif: row.kategori_tarif,
    tarifPerHari: row.tarif_per_hari,
    totalBiaya: row.total_biaya,
    buktiTransferUrl: row.bukti_transfer_url,
    status: row.status,
    alasanTolak: row.alasan_tolak,
    catatanPembayaran: row.catatan_pembayaran,
    dendaKeterlambatan: row.denda_keterlambatan,
    createdAt: row.created_at,
  }
}

function mapDetailSurat(row, banjarOptions = []) {
  if (!row) return null
  return {
    id: row.id,
    nomorPengajuan: row.nomor_pengajuan,
    nik: row.nik,
    nama: row.nama,
    nomorHp: row.nomor_hp,
    banjarAsal: formatBanjarAsal(row.banjar_asal, banjarOptions),
    estimasiTamu: row.estimasi_tamu,
    keperluan: row.keperluan,
    tanggalMulai: row.tanggal_mulai,
    tanggalSelesai: row.tanggal_selesai,
    durasiHari: row.durasi_hari,
    kategoriTarif: row.kategori_tarif,
    tarifPerHari: row.tarif_per_hari,
    totalBiaya: row.total_biaya,
    status: row.status,
    approvedAt: row.approved_at,
    namaAset: row.nama_aset,
    lokasiAset: row.lokasi_aset,
    namaAdmin: row.nama_admin,
    jabatanAdmin: row.jabatan_admin,
  }
}

async function uploadFile(bucket, file, folder) {
  if (!file) return { data: null, error: null }
  const extension = file.name.split('.').pop() || 'jpg'
  const path = `${folder}/${crypto.randomUUID()}.${extension}`
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    contentType: file.type,
    upsert: false,
  })
  if (error) return { data: null, error }
  return { data: path, error: null }
}

export function usePengajuan() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const lacakPengajuan = useCallback(async (query) => {
    setLoading(true)
    setError(null)
    const [pengajuanResult, banjarResult] = await Promise.all([
      supabase.rpc('lacak_pengajuan', { p_query: query }),
      supabase.from('banjar').select('id, nama').order('nama', { ascending: true }),
    ])
    setLoading(false)
    const rpcError = pengajuanResult.error ?? banjarResult.error
    if (rpcError) {
      setError(rpcError.message)
      return { data: [], error: rpcError }
    }
    return { data: (pengajuanResult.data ?? []).map((row) => mapPengajuan(row, banjarResult.data ?? [])), error: null }
  }, [])

  const hitungAktif = useCallback(async (nik) => {
    const { data, error: rpcError } = await supabase.rpc('hitung_pengajuan_aktif', { p_nik: nik })
    return { data: data ?? 0, error: rpcError }
  }, [])

  const submitPengajuan = useCallback(
    async ({ aset, konfigurasi, currentCitizen, form, fotoKtpFile, buktiTransferFile, banjarOptions = [] }) => {
      setLoading(true)
      setError(null)
      const activeResult = await hitungAktif(form.nik)
      const tarif = kalkulasiTarif(aset, { ...form })
      const validation = validasiPengajuan({
        pengajuan: form,
        aset,
        konfigurasi,
        pengajuanAktif: Array.from({ length: activeResult.data }, () => ({ status: 'pending' })),
      })

      if (!validation.valid) {
        setLoading(false)
        return { data: null, error: { message: 'Validasi gagal.', fields: validation.errors } }
      }

      const nomorPengajuan = generateNomorPengajuan()
      const ktpUpload = await uploadFile('pinfas-ktp', fotoKtpFile, nomorPengajuan)
      if (ktpUpload.error) {
        setError(ktpUpload.error.message)
        setLoading(false)
        return { data: null, error: ktpUpload.error }
      }

      const buktiUpload = await uploadFile('pinfas-bukti-transfer', buktiTransferFile, nomorPengajuan)
      if (buktiUpload.error) {
        setError(buktiUpload.error.message)
        setLoading(false)
        return { data: null, error: buktiUpload.error }
      }

      const status = 'pending'
      const payload = {
        nomor_pengajuan: nomorPengajuan,
        aset_id: aset.id,
        warga_profile_id: currentCitizen?.id ?? null,
        nik: form.nik,
        nama: form.nama,
        nomor_hp: form.nomorHp,
        banjar_asal: formatBanjarAsal(form.banjarAsal, banjarOptions),
        keperluan: form.keperluan,
        estimasi_tamu: form.estimasiTamu ? Number(form.estimasiTamu) : null,
        tanggal_mulai: form.tanggalMulai,
        tanggal_selesai: form.tanggalSelesai,
        kategori_tarif: tarif.kategoriTarif,
        tarif_per_hari: tarif.tarifPerHari,
        total_biaya: tarif.totalBiaya,
        foto_ktp_url: ktpUpload.data,
        bukti_transfer_url: buktiUpload.data,
        status,
      }

      const { error: insertError } = await supabase.from('pengajuan').insert(payload)
      setLoading(false)
      if (insertError) {
        setError(insertError.message)
        return { data: null, error: insertError }
      }
      return { data: { nomorPengajuan, status, totalBiaya: tarif.totalBiaya }, error: null }
    },
    [hitungAktif],
  )

  const uploadBuktiTransfer = useCallback(async ({ pengajuan, identifier, file }) => {
    setLoading(true)
    setError(null)
    const upload = await uploadFile('pinfas-bukti-transfer', file, pengajuan.nomorPengajuan)
    if (upload.error) {
      setError(upload.error.message)
      setLoading(false)
      return { data: null, error: upload.error }
    }
    const { data, error: rpcError } = await supabase.rpc('update_bukti_transfer_public', {
      p_nomor_pengajuan: pengajuan.nomorPengajuan,
      p_identifier: identifier,
      p_bukti_transfer_url: upload.data,
    })
    setLoading(false)
    if (rpcError) {
      setError(rpcError.message)
      return { data: null, error: rpcError }
    }
    return { data: data?.[0] ?? null, error: null }
  }, [])

  const batalkanPending = useCallback(async ({ pengajuan, identifier }) => {
    setLoading(true)
    const { data, error: rpcError } = await supabase.rpc('batalkan_pengajuan_public', {
      p_nomor_pengajuan: pengajuan.nomorPengajuan,
      p_identifier: identifier,
    })
    setLoading(false)
    return { data: data?.[0] ?? null, error: rpcError }
  }, [])

  const fetchDetailSurat = useCallback(async ({ nomorPengajuan, identifier }) => {
    setLoading(true)
    setError(null)
    const [suratResult, banjarResult] = await Promise.all([
      supabase.rpc('detail_surat_public', {
        p_nomor_pengajuan: nomorPengajuan,
        p_identifier: identifier,
      }),
      supabase.from('banjar').select('id, nama').order('nama', { ascending: true }),
    ])
    setLoading(false)
    const rpcError = suratResult.error ?? banjarResult.error
    if (rpcError) {
      setError(rpcError.message)
      return { data: null, error: rpcError }
    }
    return { data: mapDetailSurat(suratResult.data?.[0], banjarResult.data ?? []), error: null }
  }, [])

  const verifikasiSurat = useCallback(async (nomorPengajuan) => {
    setLoading(true)
    setError(null)
    const [suratResult, banjarResult] = await Promise.all([
      supabase.rpc('verifikasi_surat_public', {
        p_nomor_pengajuan: nomorPengajuan,
      }),
      supabase.from('banjar').select('id, nama').order('nama', { ascending: true }),
    ])
    setLoading(false)
    const rpcError = suratResult.error ?? banjarResult.error
    if (rpcError) {
      setError(rpcError.message)
      return { data: null, error: rpcError }
    }
    return { data: mapDetailSurat(suratResult.data?.[0], banjarResult.data ?? []), error: null }
  }, [])

  return {
    loading,
    error,
    submitPengajuan,
    lacakPengajuan,
    uploadBuktiTransfer,
    batalkanPending,
    hitungAktif,
    fetchDetailSurat,
    verifikasiSurat,
  }
}
