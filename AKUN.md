# Akun PINFAS

Dokumen ini berisi akun untuk kebutuhan demo dan pengujian PINFAS.

Catatan penting:
- Password tidak bisa dibaca ulang dari Supabase Auth. Password di bawah mengikuti default dari `scripts/seedAuth.js`.
- Kalau password tidak cocok, jalankan `npm run seed:auth` untuk reset password akun seed.
- Akun Kelian hanya bisa masuk dashboard admin jika sudah ada baris terkait di tabel `user_admin`.

## Akun Admin Aktif Saat Ini

| Role | Banjar | Email | Password | Status |
| --- | --- | --- | --- | --- |
| Admin Desa | - | `admin.desa@pinfas.id` | `PinfasDesa2026` | Aktif |
| Lurah | - | `lurah@pinfas.id` | `PinfasLurah2026` | Aktif |
| Kelian Banjar | Banjar Kaja | `kelian.kaja@pinfas.id` | `PinfasKaja2026` | Aktif |
| Kelian Banjar | Banjar Kelod | `kelian.kelod@pinfas.id` | `PinfasKelod2026` | Aktif |

## Akun Auth Yang Ada Tapi Belum Tertaut user_admin

Akun berikut sudah ada di Supabase Auth, tetapi belum muncul sebagai akun admin aktif di tabel `user_admin`. Jalankan migration seed terbaru dan `npm run seed:auth` agar bisa dipakai login sebagai petugas.

| Role Rencana | Banjar | Email | Password Default |
| --- | --- | --- | --- |
| Kelian Banjar | Banjar Kangin | `kelian.kangin@pinfas.id` | `PinfasKangin2026` |
| Kelian Banjar | Banjar Kauh | `kelian.kauh@pinfas.id` | `PinfasKauh2026` |

## Daftar Lengkap Akun Seed

Gunakan daftar ini setelah menjalankan:

```bash
npm run seed:auth
```

| Role | Banjar | Email | Password |
| --- | --- | --- | --- |
| Admin Desa | - | `admin.desa@pinfas.id` | `PinfasDesa2026` |
| Lurah | - | `lurah@pinfas.id` | `PinfasLurah2026` |
| Kelian Banjar | Banjar Kaja | `kelian.kaja@pinfas.id` | `PinfasKaja2026` |
| Kelian Banjar | Banjar Kelod | `kelian.kelod@pinfas.id` | `PinfasKelod2026` |
| Kelian Banjar | Banjar Kangin | `kelian.kangin@pinfas.id` | `PinfasKangin2026` |
| Kelian Banjar | Banjar Kauh | `kelian.kauh@pinfas.id` | `PinfasKauh2026` |

## Akun Warga

Belum ada akun warga di tabel `warga_profile` saat dokumen ini dibuat.

Warga tetap bisa mengajukan tanpa login. Kalau ingin akun warga untuk demo, buat melalui halaman `Daftar/Masuk Warga`, lalu data profil akan masuk ke `warga_profile`.
