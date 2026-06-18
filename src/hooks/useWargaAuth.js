import { useCallback, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAppContext } from './useAppContext'

function mapWargaProfile(row) {
  if (!row) return null
  return {
    id: row.id,
    authId: row.auth_id,
    nik: row.nik,
    nama: row.nama,
    nomorHp: row.nomor_hp,
    banjarAsal: row.banjar_asal,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapPengajuan(row) {
  return {
    id: row.id,
    nomorPengajuan: row.nomor_pengajuan,
    asetId: row.aset_id,
    namaAset: row.aset?.nama,
    keperluan: row.keperluan,
    tanggalMulai: row.tanggal_mulai,
    tanggalSelesai: row.tanggal_selesai,
    durasiHari: row.durasi_hari,
    totalBiaya: row.total_biaya,
    status: row.status,
    alasanTolak: row.alasan_tolak,
    catatanPembayaran: row.catatan_pembayaran,
    buktiTransferUrl: row.bukti_transfer_url,
    createdAt: row.created_at,
  }
}

export function useWargaAuth() {
  const { dispatch } = useAppContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchProfil = useCallback(async (authId) => {
    const { data, error: profileError } = await supabase
      .from('warga_profile')
      .select('*')
      .eq('auth_id', authId)
      .maybeSingle()

    if (profileError) return { data: null, error: profileError }
    return { data: mapWargaProfile(data), error: null }
  }, [])

  const daftar = useCallback(
    async (input) => {
      setLoading(true)
      setError(null)
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
      })

      if (signUpError || !authData.user) {
        setError(signUpError?.message ?? 'Gagal membuat akun warga.')
        setLoading(false)
        return { data: null, error: signUpError }
      }

      const { data, error: insertError } = await supabase
        .from('warga_profile')
        .insert({
          auth_id: authData.user.id,
          nik: input.nik,
          nama: input.nama,
          nomor_hp: input.nomorHp,
          banjar_asal: input.banjarAsal,
        })
        .select('*')
        .single()

      if (insertError) {
        setError(insertError.message)
        setLoading(false)
        return { data: null, error: insertError }
      }

      const profile = mapWargaProfile(data)
      dispatch({ type: 'SET_CITIZEN_USER', payload: profile })
      dispatch({ type: 'CLEAR_AUTH_USER' })
      setLoading(false)
      return { data: profile, error: null }
    },
    [dispatch],
  )

  const masuk = useCallback(
    async ({ email, password }) => {
      setLoading(true)
      setError(null)
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

      if (signInError || !authData.user) {
        setError(signInError?.message ?? 'Gagal masuk.')
        setLoading(false)
        return { data: null, error: signInError }
      }

      const { data: adminProfile } = await supabase.from('user_admin').select('id').eq('auth_id', authData.user.id).maybeSingle()
      if (adminProfile) {
        setLoading(false)
        return { data: { redirectToAdmin: true }, error: null }
      }

      const profileResult = await fetchProfil(authData.user.id)
      if (profileResult.error || !profileResult.data) {
        setError(profileResult.error?.message ?? 'Profil warga tidak ditemukan.')
        setLoading(false)
        return profileResult
      }

      dispatch({ type: 'SET_CITIZEN_USER', payload: profileResult.data })
      dispatch({ type: 'CLEAR_AUTH_USER' })
      setLoading(false)
      return profileResult
    },
    [dispatch, fetchProfil],
  )

  const keluar = useCallback(async () => {
    setLoading(true)
    const { error: signOutError } = await supabase.auth.signOut()
    dispatch({ type: 'CLEAR_CITIZEN_USER' })
    setLoading(false)
    return { error: signOutError }
  }, [dispatch])

  const fetchRiwayatWarga = useCallback(async (profile) => {
    if (!profile) return { data: [], error: null }
    const { data, error: historyError } = await supabase
      .from('pengajuan')
      .select('id, nomor_pengajuan, aset_id, keperluan, tanggal_mulai, tanggal_selesai, durasi_hari, total_biaya, status, alasan_tolak, catatan_pembayaran, bukti_transfer_url, created_at, aset:aset_id(nama)')
      .or(`warga_profile_id.eq.${profile.id},and(nik.eq.${profile.nik},nomor_hp.eq.${profile.nomorHp})`)
      .order('created_at', { ascending: false })

    if (historyError) return { data: [], error: historyError }
    return { data: (data ?? []).map(mapPengajuan), error: null }
  }, [])

  return { loading, error, daftar, masuk, keluar, fetchProfil, fetchRiwayatWarga }
}
