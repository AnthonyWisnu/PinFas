import { useCallback, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAppContext } from './useAppContext'
import { formatBanjarAsal } from '../utils/formatBanjarAsal'
import { getCachedSignedUrl, preloadImage } from '../utils/storagePreview'

const PENGAJUAN_SELECT = `
  *,
  aset:aset_id (*, banjar:banjar_id (id, nama)),
  approver:approved_by (id, nama, jabatan)
`
const STATUS_PEMASUKAN = ['approved', 'terlambat', 'selesai']

function mapAset(row) {
  if (!row) return null
  return {
    id: row.id,
    nama: row.nama,
    kategoriPemilik: row.kategori_pemilik,
    banjarId: row.banjar_id,
    banjar: row.banjar ? { id: row.banjar.id, nama: row.banjar.nama } : null,
    statusBiaya: row.status_biaya,
    statusAset: row.status_aset,
    tarifLokal: row.tarif_lokal ?? 0,
    tarifAntarBanjar: row.tarif_antar_banjar ?? 0,
    tarifLuarDesa: row.tarif_luar_desa ?? 0,
    checklistKondisi: row.checklist_kondisi ?? [],
  }
}

function mapPengajuan(row, banjarOptions = []) {
  const aset = mapAset(row.aset)
  return {
    id: row.id, nomorPengajuan: row.nomor_pengajuan, asetId: row.aset_id, aset,
    namaAset: aset?.nama ?? '-',
    nik: row.nik,
    nama: row.nama,
    nomorHp: row.nomor_hp,
    banjarAsal: formatBanjarAsal(row.banjar_asal, banjarOptions),
    keperluan: row.keperluan,
    estimasiTamu: row.estimasi_tamu,
    tanggalMulai: row.tanggal_mulai,
    tanggalSelesai: row.tanggal_selesai,
    durasiHari: row.durasi_hari,
    kategoriTarif: row.kategori_tarif,
    tarifPerHari: row.tarif_per_hari ?? 0,
    totalBiaya: row.total_biaya ?? 0,
    fotoKtpUrl: row.foto_ktp_url, buktiTransferUrl: row.bukti_transfer_url, status: row.status,
    alasanTolak: row.alasan_tolak, templateAlasanId: row.template_alasan_id, catatanPembayaran: row.catatan_pembayaran,
    checklistSebelum: row.checklist_sebelum, checklistSesudah: row.checklist_sesudah, kondisiKembali: row.kondisi_kembali,
    catatanPengembalian: row.catatan_pengembalian,
    dendaKeterlambatan: row.denda_keterlambatan ?? 0,
    tanggalKembaliAktual: row.tanggal_kembali_aktual,
    alasanPaksaBatal: row.alasan_paksa_batal, approvedBy: row.approved_by, approvedAt: row.approved_at,
    approver: row.approver, createdAt: row.created_at, updatedAt: row.updated_at,
  }
}

function todayDate() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function canProcess(user, pengajuan) {
  if (!user || user.role === 'lurah') return false
  if (user.role === 'admin_desa') return pengajuan.aset?.kategoriPemilik === 'desa'
  return pengajuan.aset?.kategoriPemilik === 'banjar' && pengajuan.aset?.banjarId === user.banjarId
}

export function useAdmin() {
  const { state, dispatch } = useAppContext()
  const [pengajuan, setPengajuan] = useState([])
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = useCallback(
    async ({ email, password }) => {
      setLoading(true)
      setError(null)
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) {
        setLoading(false)
        setError(authError.message)
        return { data: null, error: authError }
      }

      const { data: admin, error: profileError } = await supabase
        .from('user_admin')
        .select('*')
        .eq('auth_id', data.user.id)
        .maybeSingle()

      setLoading(false)
      if (profileError || !admin || admin.is_active === false) {
        await supabase.auth.signOut()
        const nextError = profileError ?? { message: admin?.is_active === false ? 'Akun petugas sedang nonaktif.' : 'Akun ini bukan akun petugas.' }
        setError(nextError.message)
        return { data: null, error: nextError }
      }

      const mapped = {
        id: admin.id,
        authId: admin.auth_id,
        nama: admin.nama,
        jabatan: admin.jabatan,
        role: admin.role, banjarId: admin.banjar_id, email: admin.email, isActive: admin.is_active ?? true,
        avatarUrl: admin.avatar_url,
        createdAt: admin.created_at,
      }
      dispatch({ type: 'SET_AUTH_USER', payload: mapped })
      dispatch({ type: 'CLEAR_CITIZEN_USER' })
      return { data: mapped, error: null }
    },
    [dispatch],
  )

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    dispatch({ type: 'CLEAR_AUTH_USER' })
  }, [dispatch])

  const fetchTemplates = useCallback(async () => {
    const { data, error: requestError } = await supabase.from('template_alasan_tolak').select('*').order('teks')
    const mapped = (data ?? []).map((item) => ({ id: item.id, teks: item.teks }))
    if (!requestError) setTemplates(mapped)
    return { data: mapped, error: requestError }
  }, [])

  const fetchPengajuan = useCallback(async (filters = {}) => {
    setLoading(true)
    setError(null)
    let query = supabase.from('pengajuan').select(PENGAJUAN_SELECT).order('created_at', { ascending: false })

    if (filters.status && filters.status !== 'semua') query = query.eq('status', filters.status)
    if (filters.asetId && filters.asetId !== 'semua') query = query.eq('aset_id', filters.asetId)
    if (filters.tanggalMulai) query = query.gte('tanggal_mulai', filters.tanggalMulai)
    if (filters.tanggalSelesai) query = query.lte('tanggal_selesai', filters.tanggalSelesai)
    if (filters.keyword) query = query.or(`nama.ilike.%${filters.keyword}%,nik.ilike.%${filters.keyword}%`)
    if (filters.banjarAsal) query = query.ilike('banjar_asal', `%${filters.banjarAsal}%`)

    const [pengajuanResult, banjarResult] = await Promise.all([
      query,
      supabase.from('banjar').select('id, nama').order('nama', { ascending: true }),
    ])

    const requestError = pengajuanResult.error ?? banjarResult.error
    if (requestError) {
      setError(requestError.message)
      setLoading(false)
      return { data: [], error: requestError }
    }

    const banjarOptions = banjarResult.data ?? []
    const mapped = await Promise.all(
      (pengajuanResult.data ?? []).map(async (row) => {
        const fotoKtpSignedUrl = await getCachedSignedUrl('pinfas-ktp', row.foto_ktp_url)
        const buktiTransferSignedUrl = await getCachedSignedUrl('pinfas-bukti-transfer', row.bukti_transfer_url)
        preloadImage(fotoKtpSignedUrl)
        preloadImage(buktiTransferSignedUrl)
        return {
          ...mapPengajuan(row, banjarOptions),
          fotoKtpSignedUrl,
          buktiTransferSignedUrl,
        }
      }),
    )
    setPengajuan(mapped)
    setLoading(false)
    return { data: mapped, error: null }
  }, [])

  const fetchDashboard = useCallback(async () => {
    const result = await fetchPengajuan()
    await fetchTemplates()
    return result
  }, [fetchPengajuan, fetchTemplates])

  const flagTerlambat = useCallback(async () => {
    const { error: updateError } = await supabase
      .from('pengajuan')
      .update({ status: 'terlambat' })
      .eq('status', 'approved')
      .lt('tanggal_selesai', todayDate())
      .is('tanggal_kembali_aktual', null)
    return { error: updateError }
  }, [])

  const updatePengajuan = useCallback(
    async (id, payload) => {
      setLoading(true)
      const { data, error: updateError } = await supabase
        .from('pengajuan')
        .update(payload)
        .eq('id', id)
        .select(PENGAJUAN_SELECT)
        .single()
      setLoading(false)
      if (updateError) {
        setError(updateError.message)
        return { data: null, error: updateError }
      }
      const mapped = mapPengajuan(data)
      setPengajuan((items) => items.map((item) => (item.id === id ? mapped : item)))
      return { data: mapped, error: null }
    },
    [],
  )

  const approve = useCallback(
    (item) => {
      if (!canProcess(state.currentUser, item)) return { data: null, error: { message: 'Tidak berwenang.' } }
      const status = item.totalBiaya > 0 && !item.buktiTransferUrl ? 'menunggu_pembayaran' : 'approved'
      return updatePengajuan(item.id, {
        status,
        approved_by: status === 'approved' ? state.currentUser.id : null,
        approved_at: status === 'approved' ? new Date().toISOString() : null,
      })
    },
    [state.currentUser, updatePengajuan],
  )

  const reject = useCallback(
    (item, { alasan, templateId }) => {
      if (!canProcess(state.currentUser, item)) return { data: null, error: { message: 'Tidak berwenang.' } }
      if (!alasan?.trim()) return { data: null, error: { message: 'Alasan penolakan wajib diisi.' } }
      return updatePengajuan(item.id, {
        status: 'rejected',
        alasan_tolak: alasan.trim(),
        template_alasan_id: templateId || null,
      })
    },
    [state.currentUser, updatePengajuan],
  )

  const verifikasiBayar = useCallback(
    (item, { valid, catatan }) => {
      if (!canProcess(state.currentUser, item)) return { data: null, error: { message: 'Tidak berwenang.' } }
      if (!valid && !catatan?.trim()) return { data: null, error: { message: 'Catatan pembayaran wajib diisi.' } }
      return updatePengajuan(item.id, {
        status: valid ? 'approved' : 'menunggu_pembayaran',
        catatan_pembayaran: valid ? null : catatan.trim(),
        approved_by: valid ? state.currentUser?.id : null,
        approved_at: valid ? new Date().toISOString() : null,
      })
    },
    [state.currentUser, updatePengajuan],
  )

  const paksaBatal = useCallback(
    (item, alasan) => {
      if (!canProcess(state.currentUser, item)) return { data: null, error: { message: 'Tidak berwenang.' } }
      if (!alasan?.trim()) return { data: null, error: { message: 'Alasan pembatalan wajib diisi.' } }
      return updatePengajuan(item.id, { status: 'dibatalkan', alasan_paksa_batal: alasan.trim() })
    },
    [state.currentUser, updatePengajuan],
  )

  const konfirmasiPengembalian = useCallback(
    (item, input) => {
      if (!canProcess(state.currentUser, item)) return { data: null, error: { message: 'Tidak berwenang.' } }
      return updatePengajuan(item.id, {
        status: 'selesai',
        checklist_sesudah: input.checklistSesudah,
        kondisi_kembali: input.kondisiKembali,
        catatan_pengembalian: input.catatanPengembalian,
        denda_keterlambatan: input.dendaKeterlambatan,
        tanggal_kembali_aktual: input.tanggalKembaliAktual,
      })
    },
    [state.currentUser, updatePengajuan],
  )

  const kpi = useMemo(() => {
    const bulan = todayDate().slice(0, 7)
    const sewaBulanIni = pengajuan.filter((item) => (
      STATUS_PEMASUKAN.includes(item.status) && item.approvedAt?.startsWith(bulan)
    ))
    const dendaBulanIni = pengajuan.filter((item) => item.status === 'selesai' && item.tanggalKembaliAktual?.startsWith(bulan))
    return {
      total: pengajuan.length,
      pending: pengajuan.filter((item) => item.status === 'pending').length,
      konfirmasiBayar: pengajuan.filter((item) => item.status === 'menunggu_konfirmasi_bayar').length,
      approvedBulanIni: pengajuan.filter((item) => item.status === 'approved' && item.approvedAt?.startsWith(bulan)).length,
      pemasukanBulanIni: (
        sewaBulanIni.reduce((sum, item) => sum + item.totalBiaya, 0)
        + dendaBulanIni.reduce((sum, item) => sum + item.dendaKeterlambatan, 0)
      ),
    }
  }, [pengajuan])

  return {
    currentUser: state.currentUser, pengajuan, templates, loading, error, kpi,
    canProcess: (item) => canProcess(state.currentUser, item),
    login, logout, fetchDashboard, fetchPengajuan, fetchTemplates, flagTerlambat,
    approve, reject, verifikasiBayar, paksaBatal, konfirmasiPengembalian,
  }
}
