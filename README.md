# PINFAS

PINFAS adalah aplikasi web peminjaman fasilitas/aset publik tingkat Desa atau Kelurahan. Aplikasi ini mendukung katalog aset publik, pengajuan warga tanpa login, login warga opsional, verifikasi admin, pembayaran aset berbayar, pembuatan surat izin PDF, QR verifikasi surat, laporan, dan manajemen aset.

## Tech Stack

- React 18 + Vite
- React Router DOM v6
- Tailwind CSS v3
- Supabase Auth, Database, Storage
- Recharts
- @react-pdf/renderer
- SheetJS `xlsx`

## Prasyarat

- Node.js LTS
- npm
- Project Supabase aktif
- Supabase anon key untuk frontend
- Supabase service role key untuk script seed akun

## Setup Project

1. Copy atau clone project ke mesin lokal.

2. Install dependency.

```bash
npm install
```

3. Buat file `.env` dari `.env.example`.

```bash
cp .env.example .env
```

Di Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

4. Isi `.env`.

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-or-publishable-public-key>

SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

Jangan pernah memakai `SUPABASE_SERVICE_ROLE_KEY` di variabel `VITE_`.

## Setup Supabase

Jalankan semua file SQL di folder `supabase/migrations` secara berurutan lewat Supabase SQL Editor:

```text
0001_init.sql
0002_rls.sql
0003_seed.sql
0004_public_riwayat_aset.sql
0005_public_pengajuan_rpc.sql
0006_admin_pengajuan_triggers.sql
0007_admin_account_status.sql
0008_public_laporan_rpc.sql
0009_surat_rpc.sql
20260618061853_expand_seed_assets_admins_storage.sql
```

Migration terakhir memastikan data demo berisi 35 aset:

- 19 aset Desa/Kelurahan
- 4 aset Banjar Kaja
- 4 aset Banjar Kelod
- 4 aset Banjar Kangin
- 4 aset Banjar Kauh

Bucket storage yang dibutuhkan:

- `pinfas-aset`
- `pinfas-logo`
- `pinfas-avatar`
- `pinfas-ktp`
- `pinfas-bukti-transfer`

## Seed Akun Auth

Setelah migration database selesai, jalankan:

```bash
npm run seed:auth
```

Script ini membuat atau mereset akun demo admin di Supabase Auth.

## Akun Demo

Lihat juga [AKUN.md](./AKUN.md).

| Role | Email | Password |
| --- | --- | --- |
| Admin Desa | `admin.desa@pinfas.id` | `PinfasDesa2026` |
| Lurah | `lurah@pinfas.id` | `PinfasLurah2026` |
| Kelian Banjar Kaja | `kelian.kaja@pinfas.id` | `PinfasKaja2026` |
| Kelian Banjar Kelod | `kelian.kelod@pinfas.id` | `PinfasKelod2026` |
| Kelian Banjar Kangin | `kelian.kangin@pinfas.id` | `PinfasKangin2026` |
| Kelian Banjar Kauh | `kelian.kauh@pinfas.id` | `PinfasKauh2026` |

## Menjalankan Aplikasi

Development server:

```bash
npm run dev
```

Buka URL yang tampil di terminal, biasanya:

```text
http://localhost:5173
```

Jika port 5173 sedang dipakai, Vite akan memakai port berikutnya seperti `5174`.

## Build Production

```bash
npm run build
```

Preview hasil build:

```bash
npm run preview
```

## Quality Check

```bash
npm run lint
npm run build
```

Build dapat menampilkan warning chunk besar karena library PDF dan Excel. Warning ini tidak menghentikan build.

## Alur Uji Cepat

1. Buka katalog publik di `/`.
2. Pilih aset gratis, ajukan peminjaman, upload foto KTP.
3. Login Admin Desa.
4. Buka `/admin/pengajuan`, klik `Proses`, cocokkan foto KTP dan data warga.
5. Setujui pengajuan, lalu cek surat dapat diunduh dari halaman lacak.
6. Pilih aset berbayar, ajukan, upload bukti transfer.
7. Admin verifikasi bukti transfer, setujui, lalu unduh surat.
8. Scan atau buka URL QR surat di `/verifikasi/:nomorPengajuan`.
9. Admin konfirmasi pengembalian sampai status `selesai`.

## Struktur Penting

```text
src/
  components/
    admin/
    aset/
    common/
    layout/
    pengajuan/
    warga/
  context/
  hooks/
  lib/
  pages/
  types/
  utils/
scripts/
  seedAuth.js
supabase/
  migrations/
```

## Catatan Pengembangan

- Query Supabase hanya boleh berada di hooks, context, atau script.
- Komponen dan halaman tidak boleh import `src/lib/supabase.js` langsung.
- Service role key hanya boleh dipakai di script Node, bukan frontend.
- Login warga bersifat opsional. Warga tetap bisa mengajukan tanpa akun.
- Admin Desa mengelola aset Desa/Kelurahan dan konfigurasi.
- Kelian Banjar hanya mengelola aset banjarnya sendiri.
- Lurah hanya read-only.

## Troubleshooting

Jika login admin gagal:

1. Pastikan `.env` sudah benar.
2. Pastikan migration `0007_admin_account_status.sql` sudah dijalankan.
3. Jalankan ulang:

```bash
npm run seed:auth
```

Jika gambar KTP atau bukti transfer tidak tampil:

1. Pastikan bucket storage sudah dibuat oleh migration `0002_rls.sql`.
2. Pastikan policy storage dari `0002_rls.sql` sudah dijalankan.
3. Pastikan file yang diupload bertipe JPG, PNG, atau WebP dan maksimal 5 MB.

Jika data aset belum 35:

1. Jalankan migration `20260618061853_expand_seed_assets_admins_storage.sql`.
2. Refresh halaman katalog atau restart dev server.
