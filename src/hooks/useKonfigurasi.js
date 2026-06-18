import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAppContext } from './useAppContext'

function mapKonfigurasi(row) {
  if (!row) return null

  return {
    id: row.id,
    tipeInstansi: row.tipe_instansi,
    namaInstansi: row.nama_instansi,
    alamat: row.alamat,
    nomorTelepon: row.nomor_telepon,
    logoUrl: row.logo_url,
    rekeningBank: row.rekening_bank,
    rekeningNomor: row.rekening_nomor,
    rekeningAtasNama: row.rekening_atas_nama,
    batasHariGratisLokal: row.batas_hari_gratis_lokal,
    batasHariGratisLuar: row.batas_hari_gratis_luar,
    minimalHariPengajuan: row.minimal_hari_pengajuan,
    tarifDendaGratis: row.tarif_denda_gratis,
    updatedAt: row.updated_at,
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

function mapTemplateAlasan(row) {
  return {
    id: row.id,
    teks: row.teks,
    createdAt: row.created_at,
  }
}

function mapAdminAccount(row) {
  return {
    id: row.id,
    authId: row.auth_id,
    email: row.email,
    nama: row.nama,
    jabatan: row.jabatan,
    role: row.role,
    banjarId: row.banjar_id,
    banjar: row.banjar ? { id: row.banjar.id, nama: row.banjar.nama } : null,
    isActive: row.is_active ?? true,
    createdAt: row.created_at,
  }
}

function toKonfigurasiPayload(input) {
  return {
    tipe_instansi: input.tipeInstansi,
    nama_instansi: input.namaInstansi,
    alamat: input.alamat,
    nomor_telepon: input.nomorTelepon,
    logo_url: input.logoUrl,
    rekening_bank: input.rekeningBank,
    rekening_nomor: input.rekeningNomor,
    rekening_atas_nama: input.rekeningAtasNama,
    batas_hari_gratis_lokal: input.batasHariGratisLokal,
    batas_hari_gratis_luar: input.batasHariGratisLuar,
    minimal_hari_pengajuan: input.minimalHariPengajuan,
    tarif_denda_gratis: input.tarifDendaGratis,
  }
}

export function useKonfigurasi() {
  const { dispatch } = useAppContext()
  const [konfigurasi, setKonfigurasi] = useState(null)
  const [blacklistTanggal, setBlacklistTanggal] = useState([])
  const [templateAlasanTolak, setTemplateAlasanTolak] = useState([])
  const [banjarOptions, setBanjarOptions] = useState([])
  const [adminAccounts, setAdminAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchKonfigurasi = useCallback(async () => {
    setLoading(true)
    setError(null)

    const [konfigurasiResult, blacklistResult, templateResult, banjarResult] = await Promise.all([
      supabase.from('konfigurasi_instansi').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('blacklist_tanggal').select('*').order('tanggal', { ascending: true }),
      supabase.from('template_alasan_tolak').select('*').order('created_at', { ascending: true }),
      supabase.from('banjar').select('*').order('nama', { ascending: true }),
    ])

    const requestError = konfigurasiResult.error ?? blacklistResult.error ?? templateResult.error ?? banjarResult.error
    if (requestError) {
      setError(requestError.message)
      setLoading(false)
      return { data: null, error: requestError }
    }

    const nextKonfigurasi = mapKonfigurasi(konfigurasiResult.data)
    setKonfigurasi(nextKonfigurasi)
    setBlacklistTanggal((blacklistResult.data ?? []).map(mapBlacklistTanggal))
    setTemplateAlasanTolak((templateResult.data ?? []).map(mapTemplateAlasan))
    setBanjarOptions((banjarResult.data ?? []).map((item) => ({ id: item.id, nama: item.nama })))
    dispatch({ type: 'SET_KONFIGURASI', payload: nextKonfigurasi })
    setLoading(false)

    return { data: nextKonfigurasi, error: null }
  }, [dispatch])

  const updateKonfigurasi = useCallback(
    async (input) => {
      setError(null)

      const payload = toKonfigurasiPayload(input)
      const query = supabase.from('konfigurasi_instansi').update(payload).eq('id', input.id).select('*').single()
      const { data, error: updateError } = await query

      if (updateError) {
        setError(updateError.message)
        return { data: null, error: updateError }
      }

      const nextKonfigurasi = mapKonfigurasi(data)
      setKonfigurasi(nextKonfigurasi)
      dispatch({ type: 'SET_KONFIGURASI', payload: nextKonfigurasi })

      return { data: nextKonfigurasi, error: null }
    },
    [dispatch],
  )

  const uploadLogo = useCallback(async (file) => {
    setError(null)
    const extension = file.name.split('.').pop() || 'png'
    const path = `logo-${crypto.randomUUID()}.${extension}`
    const { error: uploadError } = await supabase.storage.from('pinfas-logo').upload(path, file, {
      cacheControl: '3600',
      contentType: file.type,
      upsert: false,
    })
    if (uploadError) {
      setError(uploadError.message)
      return { data: null, error: uploadError }
    }
    const { data } = supabase.storage.from('pinfas-logo').getPublicUrl(path)
    return { data: data.publicUrl, error: null }
  }, [])

  const tambahBlacklistTanggal = useCallback(async (input) => {
    setError(null)
    const { data, error: insertError } = await supabase
      .from('blacklist_tanggal')
      .insert({ tanggal: input.tanggal, keterangan: input.keterangan ?? null, created_by: input.createdBy ?? null })
      .select('*')
      .single()

    if (insertError) {
      setError(insertError.message)
      return { data: null, error: insertError }
    }

    const nextItem = mapBlacklistTanggal(data)
    setBlacklistTanggal((items) => [...items, nextItem].sort((a, b) => a.tanggal.localeCompare(b.tanggal)))
    return { data: nextItem, error: null }
  }, [])

  const hapusBlacklistTanggal = useCallback(async (id) => {
    setError(null)
    const { error: deleteError } = await supabase.from('blacklist_tanggal').delete().eq('id', id)

    if (deleteError) {
      setError(deleteError.message)
      return { error: deleteError }
    }

    setBlacklistTanggal((items) => items.filter((item) => item.id !== id))
    return { error: null }
  }, [])

  const tambahTemplateAlasan = useCallback(async (teks) => {
    setError(null)
    const { data, error: insertError } = await supabase
      .from('template_alasan_tolak')
      .insert({ teks }).select('*').single()

    if (insertError) {
      setError(insertError.message)
      return { data: null, error: insertError }
    }

    const nextItem = mapTemplateAlasan(data)
    setTemplateAlasanTolak((items) => [...items, nextItem])
    return { data: nextItem, error: null }
  }, [])

  const hapusTemplateAlasan = useCallback(async (id) => {
    setError(null)
    const { error: deleteError } = await supabase.from('template_alasan_tolak').delete().eq('id', id)

    if (deleteError) {
      setError(deleteError.message)
      return { error: deleteError }
    }

    setTemplateAlasanTolak((items) => items.filter((item) => item.id !== id))
    return { error: null }
  }, [])

  const fetchAdminAccounts = useCallback(async () => {
    setError(null)
    const { data, error: requestError } = await supabase
      .from('user_admin').select('*, banjar:banjar_id (id, nama)').order('created_at', { ascending: true })

    if (requestError) {
      setError(requestError.message)
      return { data: [], error: requestError }
    }

    const mapped = (data ?? []).map(mapAdminAccount)
    setAdminAccounts(mapped)
    return { data: mapped, error: null }
  }, [])

  const simpanAdminAccount = useCallback(async (input) => {
    setError(null)
    let authId = input.authId
    const oldSession = await supabase.auth.getSession()

    if (!input.id) {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
      })
      if (oldSession.data.session) await supabase.auth.setSession(oldSession.data.session)
      if (signUpError) {
        setError(signUpError.message)
        return { data: null, error: signUpError }
      }
      authId = authData.user?.id
    }

    const payload = {
      auth_id: authId,
      email: input.email,
      nama: input.nama,
      jabatan: input.jabatan,
      role: input.role,
      banjar_id: input.role === 'kelian_banjar' ? input.banjarId : null,
      is_active: input.isActive ?? true,
    }
    const query = input.id
      ? supabase.from('user_admin').update(payload).eq('id', input.id).select('*, banjar:banjar_id (id, nama)').single()
      : supabase.from('user_admin').insert(payload).select('*, banjar:banjar_id (id, nama)').single()

    const { data, error: saveError } = await query
    if (saveError) {
      setError(saveError.message)
      return { data: null, error: saveError }
    }
    const mapped = mapAdminAccount(data)
    setAdminAccounts((items) => (input.id ? items.map((item) => (item.id === mapped.id ? mapped : item)) : [...items, mapped]))
    return { data: mapped, error: null }
  }, [])

  const toggleAdminActive = useCallback(async (account) => {
    return simpanAdminAccount({ ...account, isActive: !account.isActive })
  }, [simpanAdminAccount])

  useEffect(() => {
    void fetchKonfigurasi()
  }, [fetchKonfigurasi])

  return {
    konfigurasi,
    blacklistTanggal,
    templateAlasanTolak,
    banjarOptions,
    adminAccounts,
    loading,
    error,
    fetchKonfigurasi,
    updateKonfigurasi,
    uploadLogo,
    tambahBlacklistTanggal,
    hapusBlacklistTanggal,
    tambahTemplateAlasan,
    hapusTemplateAlasan,
    fetchAdminAccounts,
    simpanAdminAccount,
    toggleAdminActive,
  }
}
