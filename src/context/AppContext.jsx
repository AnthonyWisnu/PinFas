/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import { appReducer, initialState } from './AppReducer'
import { supabase } from '../lib/supabase'

export const AppContext = createContext(null)

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

function mapUserAdmin(row) {
  if (!row) return null

  return {
    id: row.id,
    authId: row.auth_id,
    nama: row.nama,
    jabatan: row.jabatan,
    role: row.role,
    banjarId: row.banjar_id,
    email: row.email,
    isActive: row.is_active ?? true,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
  }
}

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

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const syncedAuthIdRef = useRef(null)

  const loadKonfigurasi = useCallback(async () => {
    const { data, error } = await supabase
      .from('konfigurasi_instansi')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!error) {
      dispatch({ type: 'SET_KONFIGURASI', payload: mapKonfigurasi(data) })
    }
  }, [])

  const syncSessionProfile = useCallback(async (session, options = {}) => {
    if (!options.silent) {
      dispatch({ type: 'SET_AUTH_LOADING', payload: true })
      dispatch({ type: 'SET_CITIZEN_AUTH_LOADING', payload: true })
    }

    if (!session?.user?.id) {
      syncedAuthIdRef.current = null
      dispatch({ type: 'CLEAR_AUTH_USER' })
      dispatch({ type: 'CLEAR_CITIZEN_USER' })
      return
    }

    const authId = session.user.id
    const { data: adminProfile, error: adminError } = await supabase
      .from('user_admin')
      .select('*')
      .eq('auth_id', authId)
      .maybeSingle()

    if (!adminError && adminProfile?.is_active !== false) {
      syncedAuthIdRef.current = authId
      dispatch({ type: 'SET_AUTH_USER', payload: mapUserAdmin(adminProfile) })
      dispatch({ type: 'CLEAR_CITIZEN_USER' })
      return
    }

    if (!adminError && adminProfile?.is_active === false) {
      syncedAuthIdRef.current = null
      await supabase.auth.signOut()
      dispatch({ type: 'CLEAR_AUTH_USER' })
      dispatch({ type: 'CLEAR_CITIZEN_USER' })
      return
    }

    const { data: wargaProfile, error: wargaError } = await supabase
      .from('warga_profile')
      .select('*')
      .eq('auth_id', authId)
      .maybeSingle()

    if (!wargaError && wargaProfile) {
      syncedAuthIdRef.current = authId
      dispatch({ type: 'CLEAR_AUTH_USER' })
      dispatch({ type: 'SET_CITIZEN_USER', payload: mapWargaProfile(wargaProfile) })
      return
    }

    syncedAuthIdRef.current = authId
    dispatch({ type: 'CLEAR_AUTH_USER' })
    dispatch({ type: 'CLEAR_CITIZEN_USER' })
  }, [])

  useEffect(() => {
    let active = true

    async function bootstrapSession() {
      await loadKonfigurasi()
      const { data } = await supabase.auth.getSession()
      if (active) await syncSessionProfile(data.session)
    }

    bootstrapSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active || event === 'INITIAL_SESSION') return

      const authId = session?.user?.id ?? null
      const sameUser = authId && authId === syncedAuthIdRef.current

      if (sameUser && (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED' || event === 'SIGNED_IN')) {
        return
      }

      void syncSessionProfile(session, { silent: true })
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [loadKonfigurasi, syncSessionProfile])

  const value = useMemo(() => ({ state, dispatch }), [state])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
