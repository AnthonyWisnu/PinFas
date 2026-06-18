export type TipeInstansi = 'desa' | 'kelurahan'

export type KategoriPemilik = 'desa' | 'banjar'

export type StatusBiaya = 'gratis' | 'berbayar'

export type StatusAset = 'tersedia' | 'maintenance'

export type KategoriTarif = 'lokal' | 'antar_banjar' | 'luar_desa'

export type StatusPengajuan =
  | 'pending'
  | 'menunggu_pembayaran'
  | 'menunggu_konfirmasi_bayar'
  | 'approved'
  | 'rejected'
  | 'dibatalkan'
  | 'terlambat'
  | 'selesai'

export type KondisiKembali = 'baik' | 'ada_kerusakan'

export type RoleAdmin = 'kelian_banjar' | 'admin_desa' | 'lurah'

export interface KonfigurasiInstansi {
  id: string
  tipeInstansi: TipeInstansi
  namaInstansi: string
  alamat?: string | null
  nomorTelepon?: string | null
  logoUrl?: string | null
  rekeningBank?: string | null
  rekeningNomor?: string | null
  rekeningAtasNama?: string | null
  batasHariGratisLokal: number
  batasHariGratisLuar: number
  minimalHariPengajuan: number
  tarifDendaGratis: number
  updatedAt?: string | null
}

export interface Banjar {
  id: string
  nama: string
  createdAt?: string
}

export interface UserAdmin {
  id: string
  authId: string
  email?: string | null
  nama: string
  jabatan: string
  role: RoleAdmin
  banjarId?: string | null
  isActive?: boolean
  avatarUrl?: string | null
  createdAt?: string
}

export interface WargaProfile {
  id: string
  authId: string
  nik: string
  nama: string
  nomorHp: string
  banjarAsal: string
  createdAt: string
  updatedAt: string
}

export interface Aset {
  id: string
  nama: string
  kategoriPemilik: KategoriPemilik
  banjarId?: string | null
  fotoUrls: string[]
  deskripsi?: string | null
  lokasi?: string | null
  syaratKetentuan: string[]
  kapasitas?: number | null
  statusBiaya: StatusBiaya
  tarifLokal: number
  tarifAntarBanjar: number
  tarifLuarDesa: number
  statusAset: StatusAset
  checklistKondisi: string[]
  createdAt: string
  updatedAt: string
}

export interface BlacklistTanggal {
  id: string
  tanggal: string
  keterangan?: string | null
  createdBy?: string | null
  createdAt?: string
}

export interface Pengajuan {
  id: string
  nomorPengajuan: string
  asetId: string
  wargaProfileId?: string | null
  nik: string
  nama: string
  nomorHp: string
  banjarAsal: string
  keperluan: string
  estimasiTamu?: number | null
  tanggalMulai: string
  tanggalSelesai: string
  durasiHari: number
  kategoriTarif: KategoriTarif
  tarifPerHari: number
  totalBiaya: number
  fotoKtpUrl?: string | null
  buktiTransferUrl?: string | null
  status: StatusPengajuan
  alasanTolak?: string | null
  templateAlasanId?: string | null
  catatanPembayaran?: string | null
  checklistSebelum?: Record<string, boolean> | null
  checklistSesudah?: Record<string, boolean> | null
  kondisiKembali?: KondisiKembali | null
  catatanPengembalian?: string | null
  dendaKeterlambatan: number
  tanggalKembaliAktual?: string | null
  alasanPaksaBatal?: string | null
  approvedBy?: string | null
  approvedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface TanggalTerpakai {
  id: string
  asetId: string
  pengajuanId: string
  tanggalMulai: string
  tanggalSelesai: string
}

export interface TemplateAlasanTolak {
  id: string
  teks: string
  createdAt?: string
}
