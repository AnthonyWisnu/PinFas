# AGENT.md - PINFAS (Pinjam Fasilitas)

Dokumen ini adalah sumber kebenaran tunggal untuk semua keputusan teknis project PINFAS.
Baca dan patuhi seluruh isi dokumen ini sebelum menulis satu baris kode pun.
Jika ada konflik antara instruksi ini dan intuisi kamu, ikuti dokumen ini.

---

## 1. Tentang Project

**Nama produk:** PINFAS (Pinjam Fasilitas)
**Konteks:** Tugas UAS E-Government, aplikasi G2C peminjaman fasilitas/aset publik tingkat Desa atau Kelurahan berbasis web dengan backend Supabase.
**Masalah yang diselesaikan:** Pengelolaan fasilitas publik desa masih manual, warga tidak tahu jadwal ketersediaan, tidak ada transparansi harga sewa, proses surat izin lambat.
**Pendekatan:** Design Thinking, target pengguna G2C (warga umum) dan internal pemerintah desa.

Satu instance aplikasi merepresentasikan satu Desa atau Kelurahan (setara, beda nama saja, dikonfigurasi oleh Admin Desa). Di dalam Desa/Kelurahan terdapat beberapa Banjar.

Kategori aset:
- Aset Desa/Kelurahan: dikelola Admin Desa, terbuka untuk semua warga.
- Aset Banjar: dikelola Kelian Banjar masing-masing, tarif berjenjang berdasarkan domisili peminjam.

---

## 2. Role dan Hak Akses

| Role | Login | Scope | Catatan |
|------|-------|-------|---------|
| Warga (Citizen) | Opsional (Supabase Auth) | Publik | Akses katalog, ajukan, lacak, download surat. Tanpa login tetap bisa ajukan dan lacak via NIK/HP. Dengan login dapat riwayat otomatis, dashboard warga, dan auto-fill form. |
| Kelian Banjar | Wajib (Supabase Auth) | Aset Banjar-nya saja | CRUD aset, approve/reject, konfirmasi pengembalian, laporan Banjar-nya |
| Admin Desa | Wajib (Supabase Auth) | Semua aset + konfigurasi sistem | Sekaligus Super Admin, kelola semua fitur termasuk konfigurasi instansi dan akun Kelian Banjar |
| Lurah/Kades | Wajib (Supabase Auth) | Semua (read-only) | Dasbor eksekutif, laporan, statistik, tidak ada aksi CRUD |

Admin Desa adalah Super Admin: satu-satunya yang bisa mengkonfigurasi profil instansi, rekening pembayaran, aturan peminjaman, blacklist tanggal, dan manajemen akun Kelian Banjar.

Login warga bersifat opsional: warga tanpa akun tetap bisa mengajukan peminjaman dan melacak status via NIK atau nomor HP. Warga yang memilih login mendapatkan fitur tambahan: riwayat pengajuan otomatis di dashboard warga, auto-fill data diri di form pengajuan, dan keamanan lebih karena data tidak bisa diintip orang lain yang tahu NIK mereka.

Aturan penting: login warga tidak boleh menjadi syarat untuk fitur inti. Semua alur utama warga tetap harus bisa diselesaikan tanpa akun. Login warga hanya enhancement untuk kenyamanan, keamanan riwayat pribadi, dan pengajuan berulang.

---

## 3. Tech Stack

- React 18 + Vite
- React Router DOM v6, gunakan createBrowserRouter
- State management: React Context API + useReducer, hanya untuk state sesi (currentUser, authLoading, konfigurasi instansi)
- Styling: Tailwind CSS v3
- Icon: lucide-react, wajib, tidak ada emoji di seluruh kode
- Grafik: recharts
- PDF generation: @react-pdf/renderer
- Excel export: xlsx (SheetJS)
- Database dan backend: Supabase (PostgreSQL + Storage + Auth)
- QR Code generation: qrcode.react
- Tidak ada backend Node.js/Express terpisah, semua query langsung ke Supabase dari React

---

## 4. Environment Variables

File `.env` di root project, tidak pernah dicommit ke git:
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-public-key>
```

File `scripts/seedAuth.js` menggunakan service role key via Node.js, tidak pernah diimport di kode React:
```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

Aturan mutlak: tidak ada variabel VITE_ yang menyimpan service role key. Semua variabel VITE_ akan ter-bundle ke JavaScript publik dan bisa dibaca siapa saja.

---

## 5. Struktur Folder Lengkap

Ikuti struktur ini secara eksak. Jangan membuat folder atau file di luar struktur ini tanpa alasan yang jelas.

```
src/
  main.jsx
  App.jsx                         -> router setup saja, tidak ada logic bisnis

  types/
    index.ts                      -> semua interface dan type definition

  lib/
    supabase.js                   -> Supabase client tunggal dari env

  context/
    AppContext.jsx                 -> Context + Provider, state sesi saja
    AppReducer.js                 -> reducer: SET_AUTH_USER, CLEAR_AUTH_USER, SET_CITIZEN_USER, CLEAR_CITIZEN_USER, SET_AUTH_LOADING, SET_CITIZEN_AUTH_LOADING, SET_KONFIGURASI

  hooks/
    useAppContext.js               -> konsumsi AppContext
    useAset.js                    -> CRUD aset, filter, toggle maintenance, upload foto
    usePengajuan.js               -> fetch, submit, update status, upload file, batalkan
    useWargaAuth.js               -> daftar, login, logout, profil, auto-fill, dashboard warga
    useAdmin.js                   -> KPI, filter pengajuan, approve, reject, login, logout
    useLaporan.js                 -> agregasi data laporan, export Excel
    useKonfigurasi.js             -> fetch dan update konfigurasi instansi

  utils/
    kalkulasiTarif.js             -> hitung biaya per hari berdasarkan domisili dan durasi
    kalkulasiDenda.js             -> hitung denda keterlambatan pengembalian
    formatCurrency.js             -> format angka ke Rupiah
    formatDate.js                 -> format tanggal ke format Indonesia
    generateNomorPengajuan.js     -> generate nomor pengajuan unik
    statusHelper.js               -> label, warna, ikon per status
    validasiPengajuan.js          -> validasi NIK, HP, tanggal, overlap, batas H
    validasiNIK.js                -> validasi format NIK 16 digit sesuai standar Dukcapil

  components/
    common/
      BadgeStatus.jsx             -> badge warna per status
      ButtonPrimary.jsx           -> tombol reusable semua varian
      EmptyState.jsx              -> tampilan kosong dan error state
      LoadingSpinner.jsx          -> indikator loading
      Modal.jsx                   -> wrapper modal konfirmasi
      StepIndicator.jsx           -> indikator langkah form multi-step
      ImagePreview.jsx            -> preview gambar (KTP, bukti transfer) dengan zoom
      KalkulatorBiaya.jsx         -> kalkulator estimasi biaya interaktif

    layout/
      Navbar.jsx                  -> navigasi publik
      Footer.jsx                  -> footer publik dengan info instansi
      AdminSidebar.jsx            -> sidebar dasbor admin, menu dinamis per role
      AdminLayout.jsx             -> layout wrapper admin, guard auth
      PublicLayout.jsx            -> layout wrapper publik

    aset/
      AssetCard.jsx               -> kartu aset katalog
      AssetGallery.jsx            -> foto aset carousel
      AssetInfo.jsx               -> info detail aset
      TarifCard.jsx               -> tabel tarif berjenjang
      AvailabilityCalendar.jsx    -> kalender ketersediaan
      FilterBar.jsx               -> filter katalog
      ChecklistKondisi.jsx        -> checklist kondisi aset sebelum/sesudah pinjam

    pengajuan/
      FormDataDiri.jsx            -> langkah 1 form pengajuan
      FormDetailAcara.jsx         -> langkah 2 form pengajuan
      FormKonfirmasi.jsx          -> langkah 3 form pengajuan
      RingkasanPengajuan.jsx      -> kartu ringkasan di halaman lacak
      PratinjauSurat.jsx          -> pratinjau surat sebelum submit
      SuratIzinPDF.jsx            -> template PDF @react-pdf/renderer
      BuktiTransferUpload.jsx     -> upload bukti transfer di LacakStatusPage

    warga/
      WargaAuthForm.jsx            -> form daftar/masuk warga opsional
      WargaDashboardCard.jsx       -> ringkasan profil dan statistik pengajuan warga
      WargaRiwayatList.jsx         -> daftar riwayat pengajuan milik warga login

    admin/
      KPICard.jsx                 -> kartu statistik dasbor
      TabelPengajuan.jsx          -> tabel pengajuan dengan filter canggih
      TabelAset.jsx               -> tabel manajemen aset
      FormAset.jsx                -> form tambah/edit aset
      ModalApprove.jsx            -> modal konfirmasi approve (gratis vs berbayar)
      ModalReject.jsx             -> modal reject + template alasan
      ModalPengembalian.jsx       -> modal konfirmasi pengembalian + checklist kondisi
      ModalKonfirmasiBayar.jsx    -> modal verifikasi bukti transfer + preview gambar
      ModalPaksaBatal.jsx         -> modal paksa batal oleh admin + wajib isi alasan
      GrafikTren.jsx              -> line chart tren peminjaman bulanan
      GrafikPerBanjar.jsx         -> bar chart pemasukan per Banjar
      KalenderGabungan.jsx        -> kalender semua aset dalam satu tampilan
      PencocokkanData.jsx         -> tampilan berdampingan KTP vs input warga
      TemplateAlasanTolak.jsx     -> pilihan template alasan tolak

  pages/
    public/
      KatalogPage.jsx             -> / katalog aset publik
      DetailAsetPage.jsx          -> /aset/:id detail aset
      FormPengajuanPage.jsx       -> /aset/:id/ajukan form pengajuan
      LacakStatusPage.jsx         -> /lacak lacak status pengajuan
      VerifikasiSuratPage.jsx     -> /verifikasi/:nomorPengajuan cek keaslian surat
      LaporanPublikPage.jsx       -> /laporan-publik statistik PADes untuk warga
      RiwayatAsetPage.jsx         -> /aset/:id/riwayat histori pemakaian aset publik
      WargaAuthPage.jsx           -> /masuk-warga dan /daftar-warga auth opsional warga
      DashboardWargaPage.jsx      -> /warga dashboard riwayat pribadi warga login

    admin/
      LoginPage.jsx               -> /admin halaman login Supabase Auth
      DasborPage.jsx              -> /admin/dasbor dinamis per role
      ManajemenAsetPage.jsx       -> /admin/aset
      ManajemenPengajuanPage.jsx  -> /admin/pengajuan semua pengajuan + filter canggih
      LaporanPage.jsx             -> /admin/laporan
      KonfigurasiPage.jsx         -> /admin/konfigurasi khusus Admin Desa
      ManajemenAkunPage.jsx       -> /admin/akun khusus Admin Desa

  scripts/
    seedAuth.js                   -> Node.js script buat akun Supabase Auth admin

  supabase/
    migrations/
      0001_init.sql               -> DDL semua tabel
      0002_rls.sql                -> semua RLS policy
      0003_seed.sql               -> data awal
```

---

## 6. Skema Database Supabase

### 6.1 Tabel `konfigurasi_instansi`

```sql
CREATE TABLE konfigurasi_instansi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipe_instansi TEXT NOT NULL DEFAULT 'desa' CHECK (tipe_instansi IN ('desa', 'kelurahan')),
  nama_instansi TEXT NOT NULL DEFAULT 'Desa',
  alamat TEXT,
  nomor_telepon TEXT,
  logo_url TEXT,
  rekening_bank TEXT,
  rekening_nomor TEXT,
  rekening_atas_nama TEXT,
  batas_hari_gratis_lokal INTEGER NOT NULL DEFAULT 3,
  batas_hari_gratis_luar INTEGER NOT NULL DEFAULT 1,
  minimal_hari_pengajuan INTEGER NOT NULL DEFAULT 3,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 6.2 Tabel `banjar`

```sql
CREATE TABLE banjar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 6.3 Tabel `warga_profile`

```sql
CREATE TABLE warga_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE REFERENCES auth.users(id),
  nik TEXT UNIQUE NOT NULL,
  nama TEXT NOT NULL,
  nomor_hp TEXT NOT NULL,
  banjar_asal TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

`warga_profile` hanya dipakai untuk warga yang memilih daftar/masuk. Pengajuan tanpa login tetap valid dan tidak wajib memiliki `warga_profile_id`.

### 6.4 Tabel `user_admin`

```sql
CREATE TABLE user_admin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE REFERENCES auth.users(id),
  nama TEXT NOT NULL,
  jabatan TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('kelian_banjar', 'admin_desa', 'lurah')),
  banjar_id UUID REFERENCES banjar(id),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 6.5 Tabel `aset`

```sql
CREATE TABLE aset (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  kategori_pemilik TEXT NOT NULL CHECK (kategori_pemilik IN ('desa', 'banjar')),
  banjar_id UUID REFERENCES banjar(id),
  foto_urls TEXT[] NOT NULL DEFAULT '{}',
  deskripsi TEXT,
  lokasi TEXT,
  syarat_ketentuan TEXT[] DEFAULT '{}',
  kapasitas INTEGER,
  status_biaya TEXT NOT NULL DEFAULT 'gratis' CHECK (status_biaya IN ('gratis', 'berbayar')),
  tarif_lokal INTEGER DEFAULT 0,
  tarif_antar_banjar INTEGER DEFAULT 0,
  tarif_luar_desa INTEGER DEFAULT 0,
  status_aset TEXT NOT NULL DEFAULT 'tersedia' CHECK (status_aset IN ('tersedia', 'maintenance')),
  checklist_kondisi TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 6.6 Tabel `blacklist_tanggal`

```sql
CREATE TABLE blacklist_tanggal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tanggal DATE NOT NULL UNIQUE,
  keterangan TEXT,
  created_by UUID REFERENCES user_admin(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 6.7 Tabel `pengajuan`

```sql
CREATE TABLE pengajuan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nomor_pengajuan TEXT UNIQUE NOT NULL,
  aset_id UUID NOT NULL REFERENCES aset(id),
  warga_profile_id UUID REFERENCES warga_profile(id),
  nik TEXT NOT NULL,
  nama TEXT NOT NULL,
  nomor_hp TEXT NOT NULL,
  banjar_asal TEXT NOT NULL,
  keperluan TEXT NOT NULL,
  estimasi_tamu INTEGER,
  tanggal_mulai DATE NOT NULL,
  tanggal_selesai DATE NOT NULL,
  durasi_hari INTEGER GENERATED ALWAYS AS (tanggal_selesai - tanggal_mulai + 1) STORED,
  kategori_tarif TEXT NOT NULL CHECK (kategori_tarif IN ('lokal', 'antar_banjar', 'luar_desa')),
  tarif_per_hari INTEGER NOT NULL DEFAULT 0,
  total_biaya INTEGER NOT NULL DEFAULT 0,
  foto_ktp_url TEXT,
  bukti_transfer_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',
    'menunggu_pembayaran',
    'menunggu_konfirmasi_bayar',
    'approved',
    'rejected',
    'dibatalkan',
    'terlambat',
    'selesai'
  )),
  alasan_tolak TEXT,
  template_alasan_id UUID,
  catatan_pembayaran TEXT,
  checklist_sebelum JSONB,
  checklist_sesudah JSONB,
  kondisi_kembali TEXT CHECK (kondisi_kembali IN ('baik', 'ada_kerusakan')),
  catatan_pengembalian TEXT,
  denda_keterlambatan INTEGER DEFAULT 0,
  tanggal_kembali_aktual DATE,
  alasan_paksa_batal TEXT,
  approved_by UUID REFERENCES user_admin(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 6.8 Tabel `tanggal_terpakai`

```sql
CREATE TABLE tanggal_terpakai (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aset_id UUID NOT NULL REFERENCES aset(id),
  pengajuan_id UUID NOT NULL REFERENCES pengajuan(id),
  tanggal_mulai DATE NOT NULL,
  tanggal_selesai DATE NOT NULL
);
```

### 6.9 Tabel `template_alasan_tolak`

```sql
CREATE TABLE template_alasan_tolak (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teks TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 7. Interface TypeScript (src/types/index.ts)

```ts
export interface KonfigurasiInstansi {
  id: string
  tipeInstansi: 'desa' | 'kelurahan'
  namaInstansi: string
  alamat?: string
  nomorTelepon?: string
  logoUrl?: string
  rekeningBank?: string
  rekeningNomor?: string
  rekeningAtasNama?: string
  batasHariGratisLokal: number
  batasHariGratisLuar: number
  minimalHariPengajuan: number
}

export interface Banjar {
  id: string
  nama: string
}

export interface UserAdmin {
  id: string
  authId: string
  nama: string
  jabatan: string
  role: 'kelian_banjar' | 'admin_desa' | 'lurah'
  banjarId?: string
  avatarUrl?: string
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
  kategoriPemilik: 'desa' | 'banjar'
  banjarId?: string
  fotoUrls: string[]
  deskripsi?: string
  lokasi?: string
  syaratKetentuan: string[]
  kapasitas?: number
  statusBiaya: 'gratis' | 'berbayar'
  tarifLokal: number
  tarifAntarBanjar: number
  tarifLuarDesa: number
  statusAset: 'tersedia' | 'maintenance'
  checklistKondisi: string[]
  createdAt: string
  updatedAt: string
}

export interface BlacklistTanggal {
  id: string
  tanggal: string
  keterangan?: string
}

export interface Pengajuan {
  id: string
  nomorPengajuan: string
  asetId: string
  wargaProfileId?: string
  nik: string
  nama: string
  nomorHp: string
  banjarAsal: string
  keperluan: string
  estimasiTamu?: number
  tanggalMulai: string
  tanggalSelesai: string
  durasiHari: number
  kategoriTarif: 'lokal' | 'antar_banjar' | 'luar_desa'
  tarifPerHari: number
  totalBiaya: number
  fotoKtpUrl?: string
  buktiTransferUrl?: string
  status: StatusPengajuan
  alasanTolak?: string
  catatanPembayaran?: string
  checklistSebelum?: Record<string, boolean>
  checklistSesudah?: Record<string, boolean>
  kondisiKembali?: 'baik' | 'ada_kerusakan'
  catatanPengembalian?: string
  dendaKeterlambatan: number
  tanggalKembaliAktual?: string
  alasanPaksaBatal?: string
  approvedBy?: string
  approvedAt?: string
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
}

export type StatusPengajuan =
  | 'pending'
  | 'menunggu_pembayaran'
  | 'menunggu_konfirmasi_bayar'
  | 'approved'
  | 'rejected'
  | 'dibatalkan'
  | 'terlambat'
  | 'selesai'

export type RoleAdmin = UserAdmin['role']
```

---

## 8. State Global Context

### Shape State (src/context/AppContext.jsx)

```js
const initialState = {
  currentUser: null,           // UserAdmin | null, khusus petugas/admin
  currentCitizen: null,        // WargaProfile | null, khusus warga login opsional
  authLoading: true,           // true saat cek sesi admin awal
  citizenAuthLoading: true,    // true saat cek sesi warga awal
  konfigurasi: null,           // KonfigurasiInstansi | null
}
```

### Daftar Action (src/context/AppReducer.js)

```js
'SET_AUTH_USER'       // payload: UserAdmin, set currentUser + authLoading false
'CLEAR_AUTH_USER'     // reset currentUser null + authLoading false
'SET_CITIZEN_USER'    // payload: WargaProfile, set currentCitizen + citizenAuthLoading false
'CLEAR_CITIZEN_USER'  // reset currentCitizen null + citizenAuthLoading false
'SET_AUTH_LOADING'    // payload: boolean
'SET_CITIZEN_AUTH_LOADING' // payload: boolean
'SET_KONFIGURASI'     // payload: KonfigurasiInstansi
```

### Aturan Context

- Context hanya menyimpan state sesi admin, state sesi warga, dan konfigurasi instansi.
- Semua data aset, pengajuan, laporan dikelola di hooks masing-masing menggunakan Supabase query langsung, tidak disimpan di Context.
- Komponen tidak boleh import supabase.js secara langsung, semua query hanya boleh ada di hooks.

---

## 9. Autentikasi Supabase Auth

### Alur Login Admin

```
[Admin buka /admin] -> LoginPage
  -> input email + password
  -> supabase.auth.signInWithPassword()
  -> fetch user_admin by auth_id = session.user.id
  -> dispatch SET_AUTH_USER
  -> navigate ke /admin/dasbor
```

### Alur Daftar/Masuk Warga Opsional

```
[Warga buka /daftar-warga] -> WargaAuthPage mode daftar
  -> input NIK, nama, nomor HP, banjar asal, email, password
  -> supabase.auth.signUp()
  -> insert warga_profile dengan auth_id = session.user.id
  -> dispatch SET_CITIZEN_USER
  -> navigate ke /warga

[Warga buka /masuk-warga] -> WargaAuthPage mode masuk
  -> input email + password
  -> supabase.auth.signInWithPassword()
  -> fetch warga_profile by auth_id = session.user.id
  -> dispatch SET_CITIZEN_USER
  -> navigate ke /warga
```

Jika user Supabase Auth yang login memiliki baris `user_admin`, ia diperlakukan sebagai petugas/admin. Jika memiliki baris `warga_profile`, ia diperlakukan sebagai warga. Satu akun tidak boleh memiliki dua profil sekaligus.

### Dashboard Warga

`/warga` hanya untuk warga login. Halaman ini menampilkan profil warga, statistik ringkas pengajuan, dan riwayat pengajuan yang terkait dengan `warga_profile_id` atau data NIK/nomor HP milik profil tersebut.

Saat warga login mengisi FormPengajuanPage:
- FormDataDiri otomatis terisi dari `currentCitizen`.
- Warga tetap boleh mengubah nomor HP jika perlu, tetapi NIK dan nama default mengikuti profil.
- Submit pengajuan wajib menyimpan `warga_profile_id`.

Saat warga tidak login mengisi FormPengajuanPage:
- Form tetap kosong.
- Submit pengajuan tetap boleh dilakukan.
- `warga_profile_id` bernilai null.

### Alur Sesi Persisten

AppContext Provider saat mount:
1. Panggil `supabase.auth.getSession()`
2. Jika ada sesi aktif, fetch `user_admin` by `auth_id`
3. Jika tidak ada `user_admin`, fetch `warga_profile` by `auth_id`
4. Dispatch `SET_AUTH_USER`, `SET_CITIZEN_USER`, atau clear keduanya
5. Set `authLoading: false` dan `citizenAuthLoading: false`
6. Pasang listener `supabase.auth.onAuthStateChange` untuk handle perubahan sesi

### Akun Admin Seed

```
Kelian Banjar Kaja    : kelian.kaja@pinfas.id    / PinfasKaja2024
Kelian Banjar Kelod   : kelian.kelod@pinfas.id   / PinfasKelod2024
Admin Desa            : admin.desa@pinfas.id      / PinfasDesa2024
Lurah                 : lurah@pinfas.id           / PinfasLurah2024
```

### Guard AdminLayout

```
authLoading === true  -> tampilkan LoadingSpinner fullscreen
authLoading === false && currentUser === null -> redirect /admin
authLoading === false && currentUser ada -> render layout
```

### Guard DashboardWargaPage

```
citizenAuthLoading === true  -> tampilkan LoadingSpinner fullscreen
citizenAuthLoading === false && currentCitizen === null -> redirect /masuk-warga
citizenAuthLoading === false && currentCitizen ada -> render dashboard warga
```

---

## 10. Aturan Bisnis Kunci

### Kalkulasi Tarif (src/utils/kalkulasiTarif.js)

```js
// Tarif dihitung per hari x durasi hari
// Aset gratis: selalu 0 tanpa memandang domisili
// Aset berbayar kategori 'desa':
//   banjarAsal !== 'luar_desa' = tarifLokal x durasi
//   banjarAsal === 'luar_desa' = tarifLuarDesa x durasi
// Aset berbayar kategori 'banjar':
//   banjarAsal === aset.banjarId = tarifLokal x durasi
//   banjarAsal !== aset.banjarId && !== 'luar_desa' = tarifAntarBanjar x durasi
//   banjarAsal === 'luar_desa' = tarifLuarDesa x durasi
```

### Batas Hari Aset Gratis

Diambil dari `konfigurasi_instansi`:
- `batasHariGratisLokal`: maksimal hari untuk warga lokal (default 3)
- `batasHariGratisLuar`: maksimal hari untuk warga luar banjar/desa (default 1)
- Validasi dilakukan di `validasiPengajuan.js`

### Minimal Hari Pengajuan

Diambil dari `konfigurasi_instansi.minimalHariPengajuan` (default 3). `tanggalMulai` harus minimal H+3 dari hari ini. Validasi di `validasiPengajuan.js`.

### Batas Pengajuan Aktif per NIK

Satu NIK maksimal 2 pengajuan berstatus pending atau approved secara bersamaan. Cek dilakukan saat submit form sebelum insert ke database.

### Login Warga Opsional

- Warga tanpa login tetap bisa ajukan, lacak, upload bukti transfer, batalkan pengajuan pending, dan download surat.
- Warga login mendapat auto-fill FormDataDiri dari `warga_profile`.
- Warga login mendapat dashboard pribadi di `/warga`.
- Pengajuan dari warga login wajib menyimpan `warga_profile_id`.
- Pengajuan dari warga tanpa login wajib tetap diterima dengan `warga_profile_id = null`.
- Dashboard warga hanya boleh menampilkan pengajuan milik warga tersebut.
- LacakStatusPage tetap tersedia untuk publik via NIK/nomor HP.
- Jangan membuat redirect paksa dari FormPengajuanPage ke login warga.
- Jangan menampilkan ajakan login sebagai penghalang submit; gunakan sebagai opsi kecil dan tidak mengganggu.

### Validasi NIK (src/utils/validasiNIK.js)

Format NIK 16 digit standar Dukcapil:
- Digit 1-6: kode wilayah (provinsi + kabupaten + kecamatan)
- Digit 7-12: tanggal lahir (DDMMYY, perempuan digit 1 ditambah 40)
- Digit 13-16: nomor urut
- Validasi: panjang tepat 16, semua angka, digit 7-8 antara 01-71 (tanggal valid)

### Alur Status Pengajuan

```
[warga submit] -> pending
    |
[admin verifikasi kelayakan]
    |-- Tolak -> rejected (wajib isi alasan, bisa pilih template)
    |-- Layak + GRATIS -> approved (langsung, kalender terblokir, surat bisa diunduh)
    |-- Layak + BERBAYAR -> menunggu_pembayaran
            |
    [warga upload bukti transfer di LacakStatusPage]
            |
        menunggu_konfirmasi_bayar
            |
    [admin verifikasi bukti di ModalKonfirmasiBayar, preview gambar berdampingan dengan data]
            |-- Tidak valid -> menunggu_pembayaran (dengan catatan_pembayaran ke warga)
            |-- Valid -> approved (kalender terblokir, surat bisa diunduh)
                    |
            [hari-H acara selesai, admin konfirmasi pengembalian]
            [jika H+1 belum dikonfirmasi, sistem flag otomatis -> terlambat]
                    |
            [admin isi checklist sesudah + kondisi + hitung denda jika terlambat]
                    |
                selesai

[paksa batal oleh admin] -> dibatalkan (wajib isi alasan, bisa dari status apapun kecuali selesai)
[warga batalkan] -> dibatalkan (hanya dari status pending)
```

### Denda Keterlambatan (src/utils/kalkulasiDenda.js)

```js
// denda = tarifPerHari x jumlahHariTerlambat
// jumlahHariTerlambat = tanggalKembaliAktual - tanggalSelesai (jika positif)
// jika aset gratis: denda = 50000 x jumlahHariTerlambat (tarif denda flat dikonfigurasi admin)
```

### Aturan Approval

- Pengajuan aset Banjar hanya bisa di-approve Kelian Banjar dengan `banjarId` yang sama.
- Pengajuan aset Desa hanya bisa di-approve Admin Desa.
- Lurah tidak bisa approve, reject, atau aksi apapun.
- Saat status berubah ke `approved`, otomatis insert baris ke `tanggal_terpakai`.
- Kalender publik otomatis terkunci untuk tanggal tersebut, first-come-first-served.

### Pencocokan Data Visual

Saat admin membuka detail pengajuan yang memiliki `foto_ktp_url`, komponen `PencocokkanData.jsx` menampilkan foto KTP di sisi kiri dan data yang diinput warga (NIK, nama, banjar asal) di sisi kanan secara berdampingan. Admin mencocokkan secara visual sebelum approve.

### Flag Terlambat Otomatis

Setiap kali halaman ManajemenPengajuanPage dibuka, `useAdmin.js` menjalankan query untuk mencari pengajuan berstatus `approved` yang `tanggal_selesai < today` dan belum ada `tanggal_kembali_aktual`. Pengajuan tersebut diupdate otomatis ke status `terlambat`.

---

## 11. Fitur per Halaman

### Halaman Publik

#### `/` - KatalogPage
- Hero section dengan foto Bali + gradient overlay + kalkulator biaya instan
- Grid kartu aset dengan filter: kategori (Semua/Desa/Banjar tertentu) + status biaya (Semua/Gratis/Berbayar)
- Pencarian aset by nama
- Dashboard publik mini: total aset tersedia, total penyewaan bulan ini, aset terpopuler

#### `/aset/:id` - DetailAsetPage
- Galeri foto carousel
- Info aset: nama, deskripsi, lokasi, kapasitas, syarat ketentuan
- Checklist kondisi aset saat ini (read-only untuk warga)
- TarifCard: tabel tarif berjenjang per kategori peminjam
- KalkulatorBiaya: interaktif, pilih tanggal dan banjar asal, muncul estimasi biaya
- AvailabilityCalendar: kalender ketersediaan real-time
- Tombol "Ajukan Peminjaman", disabled jika maintenance

#### `/aset/:id/riwayat` - RiwayatAsetPage
- Histori pemakaian aset: nama acara, tanggal, kategori acara, tanpa data pribadi warga
- Transparansi penggunaan aset publik

#### `/aset/:id/ajukan` - FormPengajuanPage
- StepIndicator 3 langkah
- Langkah 1: NIK (validasi Dukcapil), Nama, Nomor HP, Banjar Asal, Estimasi Tamu
- Langkah 2: Keperluan Acara, Tanggal Mulai, Tanggal Selesai, Upload Foto KTP
- Langkah 3: PratinjauSurat (pratinjau dokumen surat izin sebelum submit), ringkasan biaya, checkbox persetujuan syarat
- Halaman sukses: nomorPengajuan dalam JetBrains Mono + tombol Lacak Status

#### `/lacak` - LacakStatusPage
- Cari via NIK atau Nomor HP
- Riwayat semua pengajuan dengan identitas yang sama
- Jika warga sudah login, tampilkan shortcut ke `/warga` dan prioritaskan riwayat milik `currentCitizen`
- Per pengajuan: BadgeStatus, detail, alasan tolak jika rejected
- Blok upload bukti transfer jika status `menunggu_pembayaran` (termasuk info rekening dari konfigurasi)
- Blok menunggu konfirmasi jika status `menunggu_konfirmasi_bayar`
- Blok denda jika status `terlambat`
- Tombol Unduh Surat Izin PDF jika status `approved` atau `selesai`
- Tombol Batalkan jika status `pending`

#### `/verifikasi/:nomorPengajuan` - VerifikasiSuratPage
- Halaman publik tanpa login
- Tampilkan status keaslian surat: valid/tidak valid
- Jika valid: nama peminjam, nama aset, tanggal acara, nama admin yang approve
- Diakses via scan QR di surat izin

#### `/laporan-publik` - LaporanPublikPage
- Total pemasukan PADes dari sewa aset bulan ini
- Jumlah penyewaan per aset
- Aset paling sering dipinjam
- Grafik tren bulanan
- Tidak ada data pribadi warga

#### `/masuk-warga` dan `/daftar-warga` - WargaAuthPage
- Form masuk/daftar warga opsional, bukan syarat untuk mengajukan peminjaman
- Daftar warga: email, password, NIK, nama lengkap, nomor HP, Banjar asal
- Masuk warga: email dan password
- Setelah berhasil masuk/daftar, redirect ke `/warga`
- Tampilkan link jelas: "Tetap ajukan tanpa akun" menuju katalog
- Jika akun yang login adalah admin/petugas, arahkan ke `/admin/dasbor`, bukan `/warga`

#### `/warga` - DashboardWargaPage
- Guard khusus warga login
- Ringkasan profil warga
- Statistik ringkas: total pengajuan, menunggu verifikasi, disetujui, selesai
- Riwayat pengajuan otomatis milik warga login
- Tombol cepat: Ajukan Peminjaman, Lacak Status, Keluar
- Per pengajuan tetap memakai RingkasanPengajuan dan BadgeStatus yang sama dengan LacakStatusPage

### Halaman Admin

#### `/admin` - LoginPage
- Form email + password, toggle show/hide password
- Error message di dalam form
- Redirect ke `/admin/dasbor` jika sudah ada sesi aktif

#### `/admin/dasbor` - DasborPage

Untuk Kelian Banjar dan Admin Desa:
- KPI: Pengajuan Masuk, Menunggu Verifikasi, Menunggu Konfirmasi Bayar, Disetujui Bulan Ini, Pemasukan Bulan Ini
- KalenderGabungan: semua aset dalam satu kalender, terlihat konflik jadwal
- TabelPengajuan: filter status pending + menunggu_konfirmasi_bayar, aksi per baris

Untuk Lurah:
- KPI eksekutif: Total Pengajuan, Total Disetujui, Total PADes, Aset Aktif
- GrafikTren: line chart 6 bulan terakhir
- GrafikPerBanjar: bar chart pemasukan per Banjar
- Tombol ke LaporanPublikPage

#### `/admin/pengajuan` - ManajemenPengajuanPage
- Filter canggih: status, aset, tanggal mulai/selesai, nama warga, NIK, Banjar asal
- Kombinasi filter bebas
- Per baris: aksi sesuai status (approve, reject, verifikasi bayar, konfirmasi pengembalian, paksa batal)
- Flag pengajuan mencurigakan (NIK sama lebih dari 3x sebulan)

#### `/admin/aset` - ManajemenAsetPage
- TabelAset: nama, kategori, Banjar, kapasitas, status biaya, status aset, aksi
- Aksi: Edit, Toggle Maintenance, Hapus
- FormAset di modal: semua field termasuk kapasitas, checklist kondisi, tarif per hari

#### `/admin/laporan` - LaporanPage
- Filter periode: bulan + tahun
- KPI: total transaksi selesai, total pemasukan, total denda
- Tabel transaksi selesai
- Unduh laporan PDF dan Excel (.xlsx)
- Scope: Kelian Banjar lihat Banjar-nya, Admin Desa lihat semua, Lurah lihat semua

#### `/admin/konfigurasi` - KonfigurasiPage (Admin Desa saja)
- Form profil instansi: tipe (Desa/Kelurahan), nama, alamat, nomor telepon, logo (upload)
- Rekening pembayaran: nama bank, nomor rekening, atas nama
- Aturan peminjaman: batas hari gratis lokal, batas hari gratis luar, minimal hari pengajuan, tarif denda keterlambatan aset gratis
- Blacklist tanggal: tambah/hapus tanggal yang diblokir untuk semua aset
- Template alasan tolak: tambah/edit/hapus template

#### `/admin/akun` - ManajemenAkunPage (Admin Desa saja)
- Daftar akun Kelian Banjar
- Tambah akun baru (nama, jabatan, banjar, email, password awal)
- Nonaktifkan akun

---

## 12. Routing (src/App.jsx)

```jsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <KatalogPage /> },
      { path: 'aset/:id', element: <DetailAsetPage /> },
      { path: 'aset/:id/ajukan', element: <FormPengajuanPage /> },
      { path: 'aset/:id/riwayat', element: <RiwayatAsetPage /> },
      { path: 'lacak', element: <LacakStatusPage /> },
      { path: 'verifikasi/:nomorPengajuan', element: <VerifikasiSuratPage /> },
      { path: 'laporan-publik', element: <LaporanPublikPage /> },
      { path: 'masuk-warga', element: <WargaAuthPage mode="masuk" /> },
      { path: 'daftar-warga', element: <WargaAuthPage mode="daftar" /> },
      { path: 'warga', element: <DashboardWargaPage /> },
    ],
  },
  { path: '/admin', element: <LoginPage /> },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: 'dasbor', element: <DasborPage /> },
      { path: 'pengajuan', element: <ManajemenPengajuanPage /> },
      { path: 'aset', element: <ManajemenAsetPage /> },
      { path: 'laporan', element: <LaporanPage /> },
      { path: 'konfigurasi', element: <KonfigurasiPage /> },
      { path: 'akun', element: <ManajemenAkunPage /> },
    ],
  },
])
```

---

## 13. Aturan Struktur Kode (Wajib Dipatuhi)

- Komponen UI (components/): 80-180 baris. Jika melebihi, pecah berdasarkan tanggung jawab.
- Halaman (pages/): 250-350 baris sebagai orchestrator, tidak ada logic bisnis di sini.
- Custom hooks (hooks/): 200-300 baris.
- Utils/helpers: tidak ada batas ketat, satu file satu tanggung jawab.
- Single Responsibility Principle: satu file satu tanggung jawab.
- Komponen React idealnya di bawah 180 baris. Jika ada bagian dengan tanggung jawab sendiri, pecah jadi komponen anak.
- Tidak boleh ada logic kalkulasi tarif, denda, format, atau manipulasi data di komponen atau halaman.
- Tidak boleh ada query Supabase langsung di komponen atau halaman, semua lewat hooks.
- Tidak boleh ada import supabase.js langsung di luar folder hooks/.

---

## 14. Konvensi Kode

### Penamaan File

| Jenis | Konvensi | Contoh |
|-------|----------|--------|
| Komponen React | PascalCase.jsx | AssetCard.jsx |
| Halaman | PascalCase + Page | KatalogPage.jsx |
| Hook | camelCase + use | useAppContext.js |
| Util | camelCase | kalkulasiTarif.js |
| Types | index.ts | index.ts |

### Konvensi Umum

- Variabel dan fungsi: camelCase
- Konstanta global: UPPER_SNAKE_CASE
- Bahasa UI: Bahasa Indonesia
- Tidak ada emoji di kode, komentar, string UI, console.log
- Setiap fungsi utils wajib punya JSDoc singkat
- Gunakan optional chaining (?.) dan nullish coalescing (??)
- Tidak ada inline style, semua Tailwind class
- Tidak ada hardcode nama desa/banjar di komponen, ambil dari konfigurasi atau data Supabase
- Snake_case dari Supabase selalu di-mapping ke camelCase di hooks sebelum dikembalikan ke komponen

### Error dan Loading State

- Semua fetch Supabase wajib menangani loading state dengan LoadingSpinner.jsx
- Semua fetch Supabase wajib menangani error state dengan EmptyState.jsx mode error
- Form wajib tampilkan error per field, bukan alert browser
- Tombol submit disabled + spinner kecil saat proses berlangsung

---

## 15. Surat Izin PDF (SuratIzinPDF.jsx)

Menggunakan @react-pdf/renderer, layout A4 portrait, margin 2cm.

Konten wajib:
- Header: logo instansi (dari konfigurasi) + nama instansi + alamat
- Double line separator
- Judul: "SURAT IZIN PEMINJAMAN FASILITAS"
- Nomor surat: nomorPengajuan
- Paragraf pembuka baku
- Tabel identitas: Nama, NIK, Banjar Asal, Nomor HP, Estimasi Tamu
- Tabel detail: Nama Aset, Lokasi, Keperluan, Tanggal Mulai, Tanggal Selesai, Durasi, Biaya Sewa
- Paragraf penutup baku
- Footer kanan: tempat + tanggal surat, jabatan yang approve, spasi tanda tangan, nama yang approve
- Footer kiri bawah: QR Code berisi nomorPengajuan + teks "Scan untuk verifikasi keaslian"

---

## 16. Hal yang Harus Dihindari

- Jangan menulis logic di App.jsx selain router setup
- Jangan import data dummy atau supabase.js langsung di komponen
- Jangan gunakan useState lokal untuk data yang di-fetch dari Supabase
- Jangan gunakan inline style
- Jangan hardcode nama desa, banjar, atau rekening di komponen
- Jangan tambahkan library baru tanpa alasan yang jelas
- Jangan tambahkan fitur di luar scope dokumen ini
- Jangan expose service role key di variabel VITE_
