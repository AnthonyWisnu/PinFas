# PLAN.md - Rencana Implementasi PINFAS

Dokumen ini menjadi rencana kerja implementasi project PINFAS berdasarkan `AGENT.md` dan `DESIGN.md`. Semua item checklist masih kosong karena project dimulai dari nol.

---

## 1. Struktur Folder Lengkap

```txt
src/
  main.jsx
  App.jsx

  types/
    index.ts

  lib/
    supabase.js

  context/
    AppContext.jsx
    AppReducer.js

  hooks/
    useAppContext.js
    useAset.js
    usePengajuan.js
    useWargaAuth.js
    useAdmin.js
    useLaporan.js
    useKonfigurasi.js

  utils/
    kalkulasiTarif.js
    kalkulasiDenda.js
    formatCurrency.js
    formatDate.js
    generateNomorPengajuan.js
    statusHelper.js
    validasiPengajuan.js
    validasiNIK.js

  components/
    common/
      BadgeStatus.jsx
      ButtonPrimary.jsx
      EmptyState.jsx
      LoadingSpinner.jsx
      Modal.jsx
      StepIndicator.jsx
      ImagePreview.jsx
      KalkulatorBiaya.jsx

    layout/
      Navbar.jsx
      Footer.jsx
      AdminSidebar.jsx
      AdminLayout.jsx
      PublicLayout.jsx

    aset/
      AssetCard.jsx
      AssetGallery.jsx
      AssetInfo.jsx
      TarifCard.jsx
      AvailabilityCalendar.jsx
      FilterBar.jsx
      ChecklistKondisi.jsx

    pengajuan/
      FormDataDiri.jsx
      FormDetailAcara.jsx
      FormKonfirmasi.jsx
      RingkasanPengajuan.jsx
      PratinjauSurat.jsx
      SuratIzinPDF.jsx
      BuktiTransferUpload.jsx

    warga/
      WargaAuthForm.jsx
      WargaDashboardCard.jsx
      WargaRiwayatList.jsx

    admin/
      KPICard.jsx
      TabelPengajuan.jsx
      TabelAset.jsx
      FormAset.jsx
      ModalApprove.jsx
      ModalReject.jsx
      ModalPengembalian.jsx
      ModalKonfirmasiBayar.jsx
      ModalPaksaBatal.jsx
      GrafikTren.jsx
      GrafikPerBanjar.jsx
      KalenderGabungan.jsx
      PencocokkanData.jsx
      TemplateAlasanTolak.jsx

  pages/
    public/
      KatalogPage.jsx
      DetailAsetPage.jsx
      FormPengajuanPage.jsx
      LacakStatusPage.jsx
      VerifikasiSuratPage.jsx
      LaporanPublikPage.jsx
      RiwayatAsetPage.jsx
      WargaAuthPage.jsx
      DashboardWargaPage.jsx

    admin/
      LoginPage.jsx
      DasborPage.jsx
      ManajemenAsetPage.jsx
      ManajemenPengajuanPage.jsx
      LaporanPage.jsx
      KonfigurasiPage.jsx
      ManajemenAkunPage.jsx

scripts/
  seedAuth.js

supabase/
  migrations/
    0001_init.sql
    0002_rls.sql
    0003_seed.sql
```

---

## 2. Fase 0 - Setup Project dan Konfigurasi Dasar

Tujuan fase ini adalah menyiapkan kerangka React, dependency, konfigurasi environment, dan struktur folder sebelum logic aplikasi dibuat.

- [x] Buat struktur folder lengkap sesuai tree di atas tanpa menambah folder di luar scope `AGENT.md`.
- [x] Siapkan `src/main.jsx` untuk mount React, Provider global, dan RouterProvider.
- [x] Siapkan `src/App.jsx` sebagai router setup saja, tanpa logic bisnis; halaman UI yang dirujuk maksimal 350 baris per file saat dibuat.
- [x] Siapkan `src/lib/supabase.js` sebagai Supabase client tunggal dari `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`; Supabase terlibat: konfigurasi project, bukan tabel.
- [x] Siapkan `.env` lokal dengan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`; jangan menyimpan service role key dalam variabel `VITE_`.
- [x] Pastikan dependency utama tersedia: `react`, `vite`, `react-router-dom`, `@supabase/supabase-js`, `tailwindcss`, `lucide-react`, `recharts`, `@react-pdf/renderer`, `xlsx`, `qrcode.react`.
- [x] Konfigurasi Tailwind CSS v3 dan import font Plus Jakarta Sans, Inter, JetBrains Mono sesuai `DESIGN.md`.
- [x] Verifikasi fase 0: jalankan dev server, pastikan aplikasi blank dapat terbuka tanpa error console, dan `src/App.jsx` belum berisi logic bisnis selain router.

---

## 3. Fase 1 - Database, RLS, Seed, dan Storage Supabase

Tujuan fase ini adalah membangun fondasi data Supabase agar semua fitur berikutnya memiliki kontrak database yang stabil.

- [x] Buat `supabase/migrations/0001_init.sql` untuk tabel `konfigurasi_instansi`, `banjar`, `warga_profile`, `user_admin`, `aset`, `blacklist_tanggal`, `pengajuan`, `tanggal_terpakai`, dan `template_alasan_tolak`.
- [x] Di `supabase/migrations/0001_init.sql`, pastikan `pengajuan.warga_profile_id` nullable agar warga tanpa login tetap bisa mengajukan; Supabase terlibat: `pengajuan`, `warga_profile`.
- [x] Di `supabase/migrations/0001_init.sql`, pastikan `pengajuan.durasi_hari` generated column benar; Supabase terlibat: `pengajuan`.
- [x] Di `supabase/migrations/0001_init.sql`, pastikan constraint status sesuai alur: `pending`, `menunggu_pembayaran`, `menunggu_konfirmasi_bayar`, `approved`, `rejected`, `dibatalkan`, `terlambat`, `selesai`; Supabase terlibat: `pengajuan`.
- [x] Buat `supabase/migrations/0002_rls.sql` untuk enable RLS pada semua tabel public; Supabase terlibat: semua tabel public.
- [x] Di `supabase/migrations/0002_rls.sql`, buat policy publik read untuk katalog dan kalender; Supabase terlibat: `aset`, `banjar`, `konfigurasi_instansi`, `tanggal_terpakai`, `blacklist_tanggal`.
- [x] Di `supabase/migrations/0002_rls.sql`, buat policy insert pengajuan publik dan authenticated; Supabase terlibat: `pengajuan`.
- [x] Di `supabase/migrations/0002_rls.sql`, buat policy warga login hanya bisa membaca profil dan riwayatnya sendiri; Supabase terlibat: `warga_profile`, `pengajuan`.
- [x] Di `supabase/migrations/0002_rls.sql`, buat policy Kelian Banjar hanya mengelola aset dan pengajuan Banjar-nya; Supabase terlibat: `user_admin`, `aset`, `pengajuan`, `tanggal_terpakai`.
- [x] Di `supabase/migrations/0002_rls.sql`, buat policy Admin Desa untuk semua data administratif; Supabase terlibat: semua tabel public.
- [x] Di `supabase/migrations/0002_rls.sql`, buat policy Lurah read-only; Supabase terlibat: `user_admin`, `aset`, `pengajuan`, `tanggal_terpakai`, `banjar`, `konfigurasi_instansi`.
- [x] Di `supabase/migrations/0003_seed.sql`, isi konfigurasi instansi awal, data Banjar awal, template alasan tolak, aset contoh, dan blacklist contoh; Supabase terlibat: `konfigurasi_instansi`, `banjar`, `template_alasan_tolak`, `aset`, `blacklist_tanggal`.
- [x] Siapkan bucket Supabase Storage untuk foto aset, foto KTP, bukti transfer, logo instansi, dan avatar admin; Supabase terlibat: Storage dan referensi URL di `aset`, `pengajuan`, `konfigurasi_instansi`, `user_admin`.
- [x] Buat `scripts/seedAuth.js` untuk membuat akun Supabase Auth admin dan insert `user_admin`; Supabase terlibat: `auth.users`, `user_admin`, `banjar`.
- [x] Verifikasi fase 1: jalankan migration, seed, dan query smoke test untuk membaca `aset`, insert `pengajuan` publik, membaca profil warga sendiri, serta memastikan Lurah tidak bisa melakukan update.

---

## 4. Fase 2 - Types, Utils, Context, dan Hook Dasar

Tujuan fase ini adalah membangun kontrak data, helper bisnis, state sesi, dan akses Supabase yang akan dipakai semua halaman.

- [x] Buat `src/types/index.ts` berisi interface `KonfigurasiInstansi`, `Banjar`, `WargaProfile`, `UserAdmin`, `Aset`, `BlacklistTanggal`, `Pengajuan`, `TanggalTerpakai`, `TemplateAlasanTolak`, `StatusPengajuan`, dan `RoleAdmin`.
- [x] Buat `src/utils/formatCurrency.js` dengan JSDoc untuk format Rupiah.
- [x] Buat `src/utils/formatDate.js` dengan JSDoc untuk format tanggal Indonesia panjang.
- [x] Buat `src/utils/validasiNIK.js` dengan JSDoc dan validasi NIK 16 digit sesuai aturan Dukcapil.
- [x] Buat `src/utils/kalkulasiTarif.js` dengan JSDoc untuk tarif aset gratis, aset desa/kelurahan, dan aset Banjar.
- [x] Buat `src/utils/kalkulasiDenda.js` dengan JSDoc untuk denda aset berbayar dan aset gratis.
- [x] Buat `src/utils/generateNomorPengajuan.js` dengan JSDoc untuk nomor unik pengajuan.
- [x] Buat `src/utils/statusHelper.js` dengan label, warna, dan ikon status sesuai `DESIGN.md`.
- [x] Buat `src/utils/validasiPengajuan.js` dengan JSDoc untuk validasi tanggal, overlap, blacklist, batas H, batas hari gratis, kapasitas, dan maksimal 2 pengajuan aktif; Supabase terlibat saat dipakai hook: `pengajuan`, `tanggal_terpakai`, `blacklist_tanggal`, `konfigurasi_instansi`, `aset`.
- [x] Buat `src/context/AppReducer.js` untuk action `SET_AUTH_USER`, `CLEAR_AUTH_USER`, `SET_CITIZEN_USER`, `CLEAR_CITIZEN_USER`, `SET_AUTH_LOADING`, `SET_CITIZEN_AUTH_LOADING`, dan `SET_KONFIGURASI`.
- [x] Buat `src/context/AppContext.jsx` untuk state sesi admin, sesi warga, dan konfigurasi; Supabase terlibat: `user_admin`, `warga_profile`, `konfigurasi_instansi`.
- [x] Buat `src/hooks/useAppContext.js` sebagai wrapper konsumsi context; hook maksimal 300 baris.
- [x] Buat `src/hooks/useKonfigurasi.js` untuk fetch/update konfigurasi, blacklist tanggal, dan template alasan; hook maksimal 300 baris; Supabase terlibat: `konfigurasi_instansi`, `blacklist_tanggal`, `template_alasan_tolak`.
- [x] Verifikasi fase 2: jalankan unit/manual test helper tarif, denda, format tanggal, validasi NIK, dan pastikan context dapat membedakan admin login, warga login, dan guest.

---

## 5. Fase 3 - Komponen Common dan Layout

Tujuan fase ini adalah membuat desain sistem reusable agar halaman berikutnya konsisten secara visual dan tidak menduplikasi UI.

- [x] Buat `src/components/common/BadgeStatus.jsx` untuk status pengajuan/aset; komponen UI maksimal 180 baris.
- [x] Buat `src/components/common/ButtonPrimary.jsx` dengan varian Primary, Secondary, Accent, Danger, Ghost, Icon, dan loading state; komponen UI maksimal 180 baris.
- [x] Buat `src/components/common/EmptyState.jsx` untuk empty/error state; komponen UI maksimal 180 baris.
- [x] Buat `src/components/common/LoadingSpinner.jsx` untuk loading fullscreen, section, dan button; komponen UI maksimal 180 baris.
- [x] Buat `src/components/common/Modal.jsx` sebagai wrapper modal konfirmasi; komponen UI maksimal 180 baris.
- [x] Buat `src/components/common/StepIndicator.jsx` untuk form multi-step; komponen UI maksimal 180 baris.
- [x] Buat `src/components/common/ImagePreview.jsx` untuk preview KTP/bukti transfer/logo dengan zoom; komponen UI maksimal 180 baris.
- [x] Buat `src/components/common/KalkulatorBiaya.jsx` untuk estimasi biaya interaktif; komponen UI maksimal 180 baris.
- [x] Buat `src/components/layout/PublicLayout.jsx` untuk wrapper publik dengan `Outlet`; komponen UI maksimal 180 baris.
- [x] Buat `src/components/layout/Navbar.jsx` dengan menu Katalog, Laporan Publik, Lacak Pengajuan, Masuk Warga/Dashboard Warga, dan Masuk Admin; komponen UI maksimal 180 baris.
- [x] Buat `src/components/layout/Footer.jsx` dengan informasi instansi dan link cepat; komponen UI maksimal 180 baris.
- [x] Buat `src/components/layout/AdminSidebar.jsx` dengan menu dinamis Kelian Banjar, Admin Desa, dan Lurah; komponen UI maksimal 180 baris.
- [x] Buat `src/components/layout/AdminLayout.jsx` dengan guard admin dan shell dashboard; komponen UI maksimal 180 baris.
- [x] Verifikasi fase 3: render semua komponen common/layout di halaman sementara atau story sederhana, cek tidak ada emoji, tidak ada inline style, dan responsif mobile/desktop.

---

## 6. Fase 4 - Fitur Aset Publik dan Katalog

Tujuan fase ini adalah membuat warga bisa melihat daftar aset Desa/Kelurahan dan Banjar, detail aset, tarif, ketersediaan, dan riwayat pemakaian publik.

- [x] Buat `src/hooks/useAset.js` untuk fetch katalog, detail, filter, CRUD aset admin, toggle maintenance, dan upload foto; hook maksimal 300 baris; Supabase terlibat: `aset`, `banjar`, `tanggal_terpakai`, `blacklist_tanggal`, Storage foto aset.
- [x] Buat `src/components/aset/AssetCard.jsx` dengan foto, accent bar emas, badge, lokasi, kapasitas, tarif, dan tombol detail; komponen UI maksimal 180 baris.
- [x] Buat `src/components/aset/AssetGallery.jsx` untuk carousel foto aset; komponen UI maksimal 180 baris.
- [x] Buat `src/components/aset/AssetInfo.jsx` untuk deskripsi, lokasi, kapasitas, dan syarat ketentuan; komponen UI maksimal 180 baris.
- [x] Buat `src/components/aset/TarifCard.jsx` untuk tabel tarif lokal, antar Banjar, dan luar desa; komponen UI maksimal 180 baris.
- [x] Buat `src/components/aset/AvailabilityCalendar.jsx` untuk tanggal tersedia, terpakai, blacklist, lampau, hari ini, dan range dipilih; komponen UI maksimal 180 baris.
- [x] Buat `src/components/aset/FilterBar.jsx` dengan filter Semua, Aset Desa/Kelurahan, Aset Banjar, status biaya, dan search; komponen UI maksimal 180 baris.
- [x] Buat `src/components/aset/ChecklistKondisi.jsx` untuk checklist kondisi aset read-only dan admin; komponen UI maksimal 180 baris.
- [x] Buat `src/pages/public/KatalogPage.jsx` sebagai halaman katalog, hero, statistik publik mini, kalkulator, filter, dan grid aset; halaman UI maksimal 350 baris.
- [x] Buat `src/pages/public/DetailAsetPage.jsx` sebagai halaman detail aset, tarif, kalkulator, kalender, dan tombol ajukan; halaman UI maksimal 350 baris.
- [x] Buat `src/pages/public/RiwayatAsetPage.jsx` untuk histori pemakaian aset tanpa data pribadi; halaman UI maksimal 350 baris; Supabase terlibat lewat hook: `pengajuan`, `aset`.
- [x] Verifikasi fase 4: cek katalog dapat memfilter Aset Desa/Kelurahan dan Aset Banjar, detail aset tampil lengkap, tanggal approved terkunci, dan riwayat tidak menampilkan NIK/HP/nama pribadi jika tidak diperlukan.

---

## 7. Fase 5 - Pengajuan Publik, Login Warga Opsional, dan Dashboard Warga

Tujuan fase ini adalah menyelesaikan alur warga dari pengajuan tanpa login, pengajuan dengan login, tracking status, upload bukti transfer, dan dashboard warga.

- [x] Buat `src/hooks/useWargaAuth.js` untuk daftar, login, logout, fetch profil, auto-fill, dan dashboard warga; hook maksimal 300 baris; Supabase terlibat: `auth.users`, `warga_profile`, `pengajuan`.
- [x] Buat `src/hooks/usePengajuan.js` untuk submit pengajuan, fetch lacak status, upload KTP, upload bukti transfer, update status pembayaran, dan batalkan pending; hook maksimal 300 baris; Supabase terlibat: `pengajuan`, `aset`, `warga_profile`, `tanggal_terpakai`, `blacklist_tanggal`, `konfigurasi_instansi`, Storage KTP, Storage bukti transfer.
- [x] Buat `src/components/pengajuan/FormDataDiri.jsx` untuk NIK, nama, nomor HP, Banjar asal, estimasi tamu, dan auto-fill warga login; komponen UI maksimal 180 baris.
- [x] Buat `src/components/pengajuan/FormDetailAcara.jsx` untuk keperluan, tanggal, durasi, biaya otomatis, dan upload KTP; komponen UI maksimal 180 baris.
- [x] Buat `src/components/pengajuan/FormKonfirmasi.jsx` untuk pratinjau, ringkasan, rekening, bukti transfer awal jika diperlukan, dan persetujuan syarat; komponen UI maksimal 180 baris.
- [x] Buat `src/components/pengajuan/RingkasanPengajuan.jsx` untuk kartu status di lacak dan dashboard warga; komponen UI maksimal 180 baris.
- [x] Buat `src/components/pengajuan/PratinjauSurat.jsx` untuk pratinjau surat sebelum submit; komponen UI maksimal 180 baris.
- [x] Buat `src/components/pengajuan/BuktiTransferUpload.jsx` untuk upload bukti pembayaran di LacakStatusPage dan DashboardWargaPage; komponen UI maksimal 180 baris.
- [x] Buat `src/components/warga/WargaAuthForm.jsx` untuk daftar/masuk warga opsional dan tombol Lanjut Tanpa Akun; komponen UI maksimal 180 baris.
- [x] Buat `src/components/warga/WargaDashboardCard.jsx` untuk profil dan statistik warga; komponen UI maksimal 180 baris.
- [x] Buat `src/components/warga/WargaRiwayatList.jsx` untuk riwayat pengajuan warga login; komponen UI maksimal 180 baris.
- [x] Buat `src/pages/public/FormPengajuanPage.jsx` sebagai orchestrator 3 langkah pengajuan tanpa memaksa login; halaman UI maksimal 350 baris.
- [x] Buat `src/pages/public/LacakStatusPage.jsx` untuk pencarian via NIK/HP, upload bukti transfer, batalkan pending, dan download surat; halaman UI maksimal 350 baris.
- [x] Buat `src/pages/public/WargaAuthPage.jsx` untuk route `/masuk-warga` dan `/daftar-warga`; halaman UI maksimal 350 baris.
- [x] Buat `src/pages/public/DashboardWargaPage.jsx` dengan guard warga login dan riwayat pribadi; halaman UI maksimal 350 baris.
- [x] Pastikan submit warga login mengisi `warga_profile_id`, sedangkan submit guest menyimpan `warga_profile_id = null`; Supabase terlibat: `pengajuan`, `warga_profile`.
- [x] Pastikan batas maksimal 2 pengajuan aktif per NIK diterapkan sebelum insert; Supabase terlibat: `pengajuan`.
- [x] Pastikan upload bukti transfer mengubah status ke `menunggu_konfirmasi_bayar`; Supabase terlibat: `pengajuan`, Storage bukti transfer.
- [x] Verifikasi fase 5: lakukan simulasi guest submit, warga daftar/login submit, tracking via NIK/HP, dashboard warga hanya melihat data sendiri, upload bukti transfer berhasil, dan login warga tidak menjadi syarat pengajuan.

---

## 8. Fase 6 - Auth Admin, Dashboard, Manajemen Aset, dan Manajemen Pengajuan

Tujuan fase ini adalah membangun area petugas untuk Kelian Banjar, Admin Desa, dan Lurah sesuai hak akses.

- [x] Buat `src/hooks/useAdmin.js` untuk login/logout admin, fetch user_admin, KPI, filter pengajuan, approve, reject, verifikasi bayar, paksa batal, dan flag terlambat otomatis; hook maksimal 300 baris; Supabase terlibat: `auth.users`, `user_admin`, `pengajuan`, `aset`, `tanggal_terpakai`, `template_alasan_tolak`, `banjar`.
- [x] Buat `src/components/admin/KPICard.jsx` untuk statistik admin dan lurah; komponen UI maksimal 180 baris.
- [x] Buat `src/components/admin/TabelPengajuan.jsx` untuk tabel/filter/aksi pengajuan; komponen UI maksimal 180 baris.
- [x] Buat `src/components/admin/TabelAset.jsx` untuk tabel manajemen aset; komponen UI maksimal 180 baris.
- [x] Buat `src/components/admin/FormAset.jsx` untuk tambah/edit aset, tarif, checklist, kapasitas, dan upload foto; komponen UI maksimal 180 baris.
- [x] Buat `src/components/admin/ModalApprove.jsx` untuk approval gratis/berbayar; komponen UI maksimal 180 baris.
- [x] Buat `src/components/admin/ModalReject.jsx` untuk reject wajib alasan dan template; komponen UI maksimal 180 baris.
- [x] Buat `src/components/admin/ModalKonfirmasiBayar.jsx` untuk preview bukti transfer dan verifikasi pembayaran; komponen UI maksimal 180 baris.
- [x] Buat `src/components/admin/ModalPaksaBatal.jsx` untuk paksa batal wajib alasan; komponen UI maksimal 180 baris.
- [x] Buat `src/components/admin/ModalPengembalian.jsx` untuk checklist pengembalian, kondisi kembali, dan denda; komponen UI maksimal 180 baris.
- [x] Buat `src/components/admin/KalenderGabungan.jsx` untuk kalender semua aset dan konflik jadwal; komponen UI maksimal 180 baris.
- [x] Buat `src/components/admin/PencocokkanData.jsx` untuk foto KTP vs data input warga; komponen UI maksimal 180 baris.
- [x] Buat `src/components/admin/TemplateAlasanTolak.jsx` untuk chip template alasan tolak; komponen UI maksimal 180 baris.
- [x] Buat `src/pages/admin/LoginPage.jsx` untuk login petugas Supabase Auth; halaman UI maksimal 350 baris.
- [x] Buat `src/pages/admin/DasborPage.jsx` untuk dashboard Kelian/Admin dan dashboard eksekutif Lurah; halaman UI maksimal 350 baris.
- [x] Buat `src/pages/admin/ManajemenAsetPage.jsx` untuk CRUD aset dan toggle maintenance; halaman UI maksimal 350 baris.
- [x] Buat `src/pages/admin/ManajemenPengajuanPage.jsx` untuk filter canggih dan aksi status; halaman UI maksimal 350 baris.
- [x] Pastikan approval aset Banjar hanya bisa dilakukan Kelian dengan `banjar_id` sama; Supabase terlibat: `user_admin`, `aset`, `pengajuan`.
- [x] Pastikan approval aset Desa/Kelurahan hanya bisa dilakukan Admin Desa; Supabase terlibat: `user_admin`, `aset`, `pengajuan`.
- [x] Pastikan Lurah read-only di UI dan RLS; Supabase terlibat: `user_admin`, `pengajuan`, `aset`.
- [x] Pastikan status `approved` otomatis insert ke `tanggal_terpakai`; Supabase terlibat: `pengajuan`, `tanggal_terpakai`.
- [x] Pastikan halaman ManajemenPengajuanPage menandai `approved` yang lewat tanggal selesai sebagai `terlambat`; Supabase terlibat: `pengajuan`.
- [x] Verifikasi fase 6: login sebagai Kelian, Admin Desa, dan Lurah; cek menu sesuai role, scope data benar, approval membuat kalender terkunci, dan Lurah tidak dapat memunculkan aksi mutasi.

---

## 9. Fase 7 - Konfigurasi, Akun, Laporan, Export, dan Grafik

Tujuan fase ini adalah menyelesaikan fitur administrasi lanjutan: konfigurasi sistem, manajemen akun, laporan internal, laporan publik, grafik, dan export.

- [x] Buat `src/hooks/useLaporan.js` untuk agregasi laporan, KPI laporan, tren bulanan, pemasukan per Banjar, dan export Excel; hook maksimal 300 baris; Supabase terlibat: `pengajuan`, `aset`, `banjar`, `user_admin`.
- [x] Lengkapi `src/hooks/useKonfigurasi.js` untuk upload logo, rekening, aturan peminjaman, blacklist tanggal, dan template alasan; hook maksimal 300 baris; Supabase terlibat: `konfigurasi_instansi`, `blacklist_tanggal`, `template_alasan_tolak`, Storage logo.
- [x] Buat `src/components/admin/GrafikTren.jsx` untuk line chart tren peminjaman bulanan; komponen UI maksimal 180 baris.
- [x] Buat `src/components/admin/GrafikPerBanjar.jsx` untuk bar chart pemasukan per Banjar; komponen UI maksimal 180 baris.
- [x] Buat `src/pages/admin/LaporanPage.jsx` untuk filter periode, KPI, tabel transaksi selesai, export PDF/Excel; halaman UI maksimal 350 baris.
- [x] Buat `src/pages/admin/KonfigurasiPage.jsx` untuk profil instansi, rekening, aturan peminjaman, blacklist tanggal, dan template alasan; halaman UI maksimal 350 baris.
- [x] Buat `src/pages/admin/ManajemenAkunPage.jsx` untuk daftar, tambah, dan nonaktifkan Kelian Banjar; halaman UI maksimal 350 baris; Supabase terlibat: `auth.users`, `user_admin`, `banjar`.
- [x] Buat `src/pages/public/LaporanPublikPage.jsx` untuk transparansi PADes tanpa data pribadi; halaman UI maksimal 350 baris; Supabase terlibat lewat hook: `pengajuan`, `aset`, `banjar`.
- [x] Pastikan laporan Kelian hanya scope Banjar-nya, Admin Desa semua, Lurah semua read-only; Supabase terlibat: `user_admin`, `aset`, `pengajuan`, `banjar`.
- [x] Pastikan laporan publik tidak menampilkan NIK, nomor HP, foto KTP, atau data pribadi warga; Supabase terlibat: `pengajuan`, `aset`.
- [x] Verifikasi fase 7: ubah konfigurasi instansi dari Admin Desa, cek label Desa/Kelurahan berubah di UI, export Excel terbuka, grafik tampil, dan laporan publik bersih dari data pribadi.

---

## 10. Fase 8 - Surat PDF, Verifikasi QR, dan Finalisasi Alur End-to-End

Tujuan fase ini adalah mengunci fitur dokumen resmi, verifikasi surat, serta memastikan seluruh alur pengajuan berjalan dari awal sampai selesai.

- [x] Buat `src/components/pengajuan/SuratIzinPDF.jsx` untuk template PDF A4 portrait, margin 2cm, header instansi, detail peminjam, detail aset, biaya, tanda tangan, dan QR; komponen UI/PDF maksimal 180 baris.
- [x] Lengkapi `src/pages/public/VerifikasiSuratPage.jsx` untuk validasi nomor pengajuan dari QR; halaman UI maksimal 350 baris; Supabase terlibat: `pengajuan`, `aset`, `user_admin`.
- [x] Integrasikan tombol unduh PDF di `src/pages/public/LacakStatusPage.jsx` untuk status `approved` dan `selesai`; halaman UI maksimal 350 baris; Supabase terlibat lewat data: `pengajuan`, `aset`, `konfigurasi_instansi`, `user_admin`.
- [x] Integrasikan tombol unduh PDF di `src/pages/public/DashboardWargaPage.jsx` untuk status `approved` dan `selesai`; halaman UI maksimal 350 baris; Supabase terlibat lewat data: `pengajuan`, `aset`, `konfigurasi_instansi`, `user_admin`.
- [x] Pastikan QR Code berisi nomor pengajuan dan route `/verifikasi/:nomorPengajuan`.
- [x] Pastikan surat hanya bisa diunduh ketika status `approved` atau `selesai`; Supabase terlibat: `pengajuan`.
- [x] Pastikan surat valid menampilkan nama peminjam, nama aset, tanggal acara, dan admin yang approve; Supabase terlibat: `pengajuan`, `aset`, `user_admin`.
- [x] Verifikasi fase 8: ajukan aset gratis sampai approved dan unduh surat; ajukan aset berbayar sampai upload bukti, verifikasi bayar, approved, unduh surat, scan/verifikasi QR, lalu konfirmasi pengembalian sampai selesai.

---

## 11. Fase 9 - QA, Responsivitas, Security Review, dan Cleanup

Tujuan fase ini adalah memastikan kualitas akhir sesuai aturan teknis, desain, keamanan Supabase, dan kebutuhan presentasi UAS.

- [x] Audit semua file komponen di `src/components/**` agar maksimal 180 baris per file dan satu tanggung jawab.
- [x] Audit semua file halaman di `src/pages/**` agar maksimal 350 baris per file dan hanya menjadi orchestrator.
- [x] Audit semua file hook di `src/hooks/**` agar maksimal 300 baris per file dan semua query Supabase hanya berada di hooks.
- [x] Pastikan tidak ada import `src/lib/supabase.js` di luar folder `src/hooks/`, `src/context/`, dan `scripts/seedAuth.js` jika memang dibutuhkan untuk sesi awal.
- [x] Pastikan tidak ada logic tarif, denda, format, atau validasi berat di komponen dan halaman.
- [x] Pastikan semua fetch Supabase punya loading state dan error state; Supabase terlibat: semua tabel yang dibaca hooks.
- [x] Pastikan semua form menampilkan error per field dan tombol submit disabled saat loading.
- [x] Pastikan tidak ada emoji, inline style, hardcode nama desa/banjar/rekening, atau service role key di file frontend.
- [ ] Uji responsivitas halaman publik di mobile, tablet, dan desktop; halaman UI maksimal 350 baris tetap dipatuhi.
- [ ] Uji responsivitas halaman admin di desktop dan mobile fallback, termasuk tabel kolaps menjadi kartu.
- [ ] Uji RLS dengan role guest, warga login, Kelian Banjar, Admin Desa, dan Lurah; Supabase terlibat: semua tabel public dan Storage.
- [ ] Jalankan advisor/security review Supabase jika tersedia; Supabase terlibat: RLS, Auth, Storage, semua tabel public.
- [ ] Verifikasi fase 9: jalankan lint/build, lakukan smoke test semua route, cek console browser tanpa error, cek semua role, dan pastikan demo flow UAS bisa dilakukan tanpa data dummy hardcode di komponen.
