import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

const ASET_SELECT = `
  *,
  banjar:banjar_id (
    id,
    nama
  )
`
const FALLBACK_PHOTOS = {
  desa: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  banjar: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80',
}

function mapBanjar(row) {
  if (!row) return null
  return { id: row.id, nama: row.nama, createdAt: row.created_at }
}

function mapAset(row) {
  if (!row) return null
  const fotoUrls = row.foto_urls ?? []
  const coverUrl = fotoUrls[0] ?? FALLBACK_PHOTOS[row.kategori_pemilik] ?? FALLBACK_PHOTOS.desa

  return {
    id: row.id,
    nama: row.nama,
    kategoriPemilik: row.kategori_pemilik,
    banjarId: row.banjar_id,
    banjar: mapBanjar(row.banjar),
    fotoUrls,
    coverUrl,
    deskripsi: row.deskripsi,
    lokasi: row.lokasi,
    syaratKetentuan: row.syarat_ketentuan ?? [],
    kapasitas: row.kapasitas,
    statusBiaya: row.status_biaya,
    tarifLokal: row.tarif_lokal ?? 0,
    tarifAntarBanjar: row.tarif_antar_banjar ?? 0,
    tarifLuarDesa: row.tarif_luar_desa ?? 0,
    statusAset: row.status_aset,
    checklistKondisi: row.checklist_kondisi ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapTanggalTerpakai(row) {
  return {
    id: row.id,
    asetId: row.aset_id,
    pengajuanId: row.pengajuan_id,
    tanggalMulai: row.tanggal_mulai,
    tanggalSelesai: row.tanggal_selesai,
  }
}

function mapBlacklistTanggal(row) {
  return {
    id: row.id,
    tanggal: row.tanggal,
    keterangan: row.keterangan,
    createdBy: row.created_by,
    createdAt: row.created_at,
  }
}

function mapRiwayat(row) {
  return {
    id: row.id,
    nomorPengajuan: row.nomor_pengajuan,
    namaAset: row.nama_aset,
    keperluan: row.keperluan,
    tanggalMulai: row.tanggal_mulai,
    tanggalSelesai: row.tanggal_selesai,
    durasiHari: row.durasi_hari,
    kategoriTarif: row.kategori_tarif,
    totalBiaya: row.total_biaya,
    status: row.status,
    createdAt: row.created_at,
  }
}

function toAsetPayload(input) {
  return {
    nama: input.nama,
    kategori_pemilik: input.kategoriPemilik,
    banjar_id: input.kategoriPemilik === 'banjar' ? input.banjarId : null,
    foto_urls: input.fotoUrls ?? [],
    deskripsi: input.deskripsi ?? null,
    lokasi: input.lokasi ?? null,
    syarat_ketentuan: input.syaratKetentuan ?? [],
    kapasitas: input.kapasitas ? Number(input.kapasitas) : null,
    status_biaya: input.statusBiaya,
    tarif_lokal: Number(input.tarifLokal ?? 0),
    tarif_antar_banjar: Number(input.tarifAntarBanjar ?? 0),
    tarif_luar_desa: Number(input.tarifLuarDesa ?? 0),
    status_aset: input.statusAset ?? 'tersedia',
    checklist_kondisi: input.checklistKondisi ?? [],
  }
}

export function useAset(options = {}) {
  const [aset, setAset] = useState([])
  const [banjarOptions, setBanjarOptions] = useState([])
  const [tanggalTerpakai, setTanggalTerpakai] = useState([])
  const [blacklistTanggal, setBlacklistTanggal] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAset = useCallback(async () => {
    setLoading(true)
    setError(null)

    const [asetResult, banjarResult, tanggalResult, blacklistResult] = await Promise.all([
      supabase.from('aset').select(ASET_SELECT).order('created_at', { ascending: true }),
      supabase.from('banjar').select('*').order('nama', { ascending: true }),
      supabase.from('tanggal_terpakai').select('*').order('tanggal_mulai', { ascending: true }),
      supabase.from('blacklist_tanggal').select('*').order('tanggal', { ascending: true }),
    ])

    const requestError = asetResult.error ?? banjarResult.error ?? tanggalResult.error ?? blacklistResult.error
    if (requestError) {
      setError(requestError.message)
      setLoading(false)
      return { data: null, error: requestError }
    }

    const nextAset = (asetResult.data ?? []).map(mapAset)
    setAset(nextAset)
    setBanjarOptions((banjarResult.data ?? []).map(mapBanjar))
    setTanggalTerpakai((tanggalResult.data ?? []).map(mapTanggalTerpakai))
    setBlacklistTanggal((blacklistResult.data ?? []).map(mapBlacklistTanggal))
    setLoading(false)
    return { data: nextAset, error: null }
  }, [])

  const fetchDetailAset = useCallback(async (id) => {
    setError(null)
    const { data, error: detailError } = await supabase.from('aset').select(ASET_SELECT).eq('id', id).maybeSingle()

    if (detailError) {
      setError(detailError.message)
      return { data: null, error: detailError }
    }

    return { data: mapAset(data), error: null }
  }, [])

  const fetchRiwayatAset = useCallback(async (asetId) => {
    setError(null)
    const { data, error: riwayatError } = await supabase
      .from('riwayat_aset_publik')
      .select('*')
      .eq('aset_id', asetId)
      .order('tanggal_mulai', { ascending: false })

    if (riwayatError) {
      setError(riwayatError.message)
      return { data: [], error: riwayatError }
    }

    return { data: (data ?? []).map(mapRiwayat), error: null }
  }, [])

  const simpanAset = useCallback(async (input) => {
    setError(null)
    const payload = toAsetPayload(input)
    const query = input.id
      ? supabase.from('aset').update(payload).eq('id', input.id).select(ASET_SELECT).single()
      : supabase.from('aset').insert(payload).select(ASET_SELECT).single()

    const { data, error: saveError } = await query
    if (saveError) {
      setError(saveError.message)
      return { data: null, error: saveError }
    }

    const nextAset = mapAset(data)
    setAset((items) => (input.id ? items.map((item) => (item.id === nextAset.id ? nextAset : item)) : [...items, nextAset]))
    return { data: nextAset, error: null }
  }, [])

  const toggleMaintenance = useCallback(async (item) => {
    const statusAset = item.statusAset === 'maintenance' ? 'tersedia' : 'maintenance'
    return simpanAset({ ...item, statusAset })
  }, [simpanAset])

  const hapusAset = useCallback(async (id) => {
    setError(null)
    const { error: deleteError } = await supabase.from('aset').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return { error: deleteError }
    }
    setAset((items) => items.filter((item) => item.id !== id))
    return { error: null }
  }, [])

  const uploadFotoAset = useCallback(async (file, asetId) => {
    setError(null)
    const extension = file.name.split('.').pop() || 'jpg'
    const path = `${asetId}/${crypto.randomUUID()}.${extension}`
    const { error: uploadError } = await supabase.storage.from('pinfas-aset').upload(path, file, {
      cacheControl: '3600',
      contentType: file.type,
      upsert: false,
    })

    if (uploadError) {
      setError(uploadError.message)
      return { data: null, error: uploadError }
    }

    const { data } = supabase.storage.from('pinfas-aset').getPublicUrl(path)
    return { data: data.publicUrl, error: null }
  }, [])

  useEffect(() => {
    if (options.autoFetch !== false) {
      void fetchAset()
    }
  }, [fetchAset, options.autoFetch])

  const statistik = useMemo(() => {
    const tersedia = aset.filter((item) => item.statusAset === 'tersedia').length
    const berbayar = aset.filter((item) => item.statusBiaya === 'berbayar').length
    return { total: aset.length, tersedia, berbayar }
  }, [aset])

  return {
    aset,
    banjarOptions,
    tanggalTerpakai,
    blacklistTanggal,
    statistik,
    loading,
    error,
    fetchAset,
    fetchDetailAset,
    fetchRiwayatAset,
    simpanAset,
    toggleMaintenance,
    hapusAset,
    uploadFotoAset,
  }
}
