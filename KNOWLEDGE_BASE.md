# Knowledge Base PINFAS

## Gambaran Umum PINFAS

PINFAS adalah aplikasi web untuk layanan peminjaman fasilitas atau aset publik tingkat Desa, Kelurahan, dan Banjar. Aplikasi ini menyediakan katalog aset publik, formulir pengajuan peminjaman, pelacakan status pengajuan, proses verifikasi oleh petugas, pembayaran untuk aset berbayar, surat izin PDF, QR verifikasi surat, laporan publik, dan dashboard admin.

PINFAS dibangun sebagai aplikasi React dengan Vite. Data, autentikasi, dan storage menggunakan Supabase. Pengguna umum dapat memakai fitur publik tanpa login, sedangkan petugas masuk melalui dashboard admin.

## Tujuan Aplikasi

Tujuan PINFAS adalah membantu warga melihat aset yang tersedia, mengajukan peminjaman fasilitas, memantau status pengajuan, dan mengunduh surat izin setelah disetujui. Untuk petugas, PINFAS membantu mengelola aset, memverifikasi data warga, memproses pengajuan, memantau jadwal, mencatat pengembalian, menghitung denda, dan membuat laporan.

## Fitur Utama

### Katalog Aset

Warga dapat melihat daftar aset publik pada halaman utama. Setiap aset menampilkan nama, foto, kategori pemilik, lokasi, kapasitas, status aset, dan informasi biaya. Katalog dapat difilter berdasarkan kata kunci, kategori aset Desa/Kelurahan atau Banjar, dan status biaya gratis atau berbayar.

### Detail Aset

Halaman detail aset menampilkan galeri foto, deskripsi, lokasi, kapasitas, syarat dan ketentuan, checklist kondisi, tarif peminjaman, kalkulator estimasi biaya, kalender ketersediaan, dan tombol pengajuan. Jika aset berstatus maintenance, tombol pengajuan tidak ditampilkan dan warga diberi informasi bahwa aset belum bisa diajukan.

### Kalender Ketersediaan

Kalender menampilkan tanggal yang sudah terpakai, tanggal blacklist, tanggal hari ini, tanggal lewat, dan tanggal yang masih tersedia. Data tanggal terpakai berasal dari pengajuan yang sudah disetujui atau terlambat. Tanggal blacklist dikelola oleh Admin Desa/Kelurahan.

### Pengajuan Peminjaman

Form pengajuan terdiri dari tiga langkah:

1. Data diri: NIK, nama lengkap, nomor HP, banjar asal, dan estimasi jumlah tamu.
2. Detail acara: keperluan acara, tanggal mulai, tanggal selesai, dan unggah foto KTP.
3. Konfirmasi: pratinjau surat, ringkasan pengajuan, bukti transfer jika berbayar, dan persetujuan syarat.

Nomor pengajuan dibuat otomatis dengan format `PINFAS-YYYYMMDD-RANDOM`.

### Validasi Pengajuan

Sistem memvalidasi data sebelum pengajuan dikirim. Validasi mencakup:

- NIK harus 16 digit angka dan mengikuti pola dasar NIK.
- Nama wajib diisi.
- Nomor HP harus diawali `08` dan terdiri dari 10 sampai 15 digit.
- Banjar asal wajib dipilih.
- Keperluan acara wajib diisi.
- Tanggal mulai dan tanggal selesai wajib diisi.
- Tanggal selesai tidak boleh sebelum tanggal mulai.
- Tanggal mulai minimal sesuai konfigurasi `minimalHariPengajuan`, default 3 hari.
- Estimasi tamu tidak boleh melebihi kapasitas aset jika kapasitas tersedia.
- Tanggal tidak boleh bentrok dengan jadwal terpakai.
- Tanggal tidak boleh berada pada daftar blacklist.
- Aset gratis memiliki batas durasi berdasarkan konfigurasi.
- Satu NIK maksimal memiliki 2 pengajuan aktif.

### Lacak Pengajuan

Warga dapat melacak pengajuan melalui halaman lacak menggunakan NIK, nomor HP, atau nomor pengajuan. Query pencarian minimal 8 karakter. Hasil lacak menampilkan nomor pengajuan, aset, tanggal, total biaya, status, alasan penolakan jika ada, catatan pembayaran jika ada, tombol upload bukti pembayaran bila diperlukan, tombol batalkan untuk status pending, dan tombol unduh surat jika pengajuan sudah approved atau selesai.

### Akun Warga Opsional

Warga dapat mendaftar atau masuk sebagai warga, tetapi login tidak wajib untuk membuat pengajuan. Jika warga login, data awal pada form pengajuan dapat diisi dari profil warga dan warga dapat membuka dashboard warga untuk melihat riwayat pengajuannya.

### Dashboard Warga

Dashboard warga hanya dapat dibuka oleh warga yang sudah login. Halaman ini menampilkan profil warga, total riwayat pengajuan, jumlah pengajuan menunggu, disetujui, dan selesai. Warga juga dapat upload bukti transfer, membatalkan pengajuan pending, mengunduh surat jika sudah tersedia, dan keluar dari akun.

### Dashboard Admin

Dashboard admin menampilkan ringkasan pengajuan, pengajuan yang perlu tindakan, KPI, dan kalender gabungan jadwal aset. Sistem juga menandai pengajuan approved yang melewati tanggal selesai dan belum dikembalikan sebagai terlambat.

### Manajemen Pengajuan

Petugas dapat melihat daftar pengajuan sesuai hak aksesnya. Tersedia filter status, aset, tanggal mulai, tanggal selesai, dan kata kunci nama atau NIK. Petugas dapat:

- Memproses pengajuan pending.
- Menolak pengajuan dengan alasan.
- Memverifikasi pembayaran.
- Membatalkan pengajuan dengan alasan.
- Mengonfirmasi pengembalian aset.
- Melihat data input warga dan foto KTP untuk pencocokan.

### Manajemen Aset

Petugas yang berwenang dapat menambah, mengedit, menghapus, dan mengubah status maintenance aset. Data aset mencakup nama, kategori pemilik, banjar, kapasitas, status biaya, tarif lokal, tarif antar Banjar, tarif luar Desa/Kelurahan, deskripsi, lokasi, syarat, checklist kondisi, dan foto aset.

### Konfigurasi

Konfigurasi hanya dapat diubah oleh Admin Desa/Kelurahan. Konfigurasi mencakup tipe instansi, nama instansi, alamat, nomor telepon, logo, rekening pembayaran, batas hari gratis lokal, batas hari gratis luar Desa/Kelurahan, minimal hari pengajuan, tarif denda aset gratis, blacklist tanggal, dan template alasan penolakan.

### Manajemen Akun Petugas

Admin Desa/Kelurahan dapat membuat dan mengedit akun petugas. Role yang tersedia adalah Kelian Banjar, Admin Desa, dan Lurah/Kades. Admin Desa juga dapat mengaktifkan atau menonaktifkan akun petugas, tetapi akun yang sedang digunakan tidak dapat dinonaktifkan dari halaman ini.

### Laporan Admin

Halaman laporan admin menampilkan transaksi selesai, total pemasukan, total denda, grafik tren, grafik per Banjar, dan tabel transaksi. Laporan dapat difilter berdasarkan tanggal kembali aktual. Admin dapat export laporan ke Excel dan menggunakan print browser sebagai PDF.

### Laporan Publik

Laporan publik menampilkan data agregat tanpa data pribadi warga. Informasi yang ditampilkan mencakup total pemasukan, total penyewaan, pemasukan bulan ini, tren penyewaan, pemasukan per wilayah, dan aset paling sering dipinjam.

## Role Pengguna dan Hak Akses

### Pengunjung Publik

Pengunjung publik dapat melihat katalog aset, melihat detail aset, melihat riwayat pemakaian publik suatu aset, membuat pengajuan tanpa login, melacak pengajuan, upload bukti pembayaran melalui halaman lacak, membatalkan pengajuan pending dengan identifier yang sesuai, mengunduh surat jika sudah approved atau selesai, dan membuka halaman verifikasi surat.

### Warga Login

Warga login memiliki kemampuan publik yang sama, ditambah dashboard warga dan riwayat pribadi. Profil warga berisi NIK, nama, nomor HP, dan banjar asal. Pengajuan warga login dapat dikaitkan dengan profil warga.

### Admin Desa/Kelurahan

Admin Desa/Kelurahan dapat mengelola aset Desa/Kelurahan, memproses pengajuan untuk aset Desa/Kelurahan, mengelola konfigurasi, blacklist tanggal, template alasan penolakan, akun petugas, dan laporan. Berdasarkan implementasi pemrosesan di frontend, Admin Desa hanya dapat memproses pengajuan yang asetnya berkategori Desa/Kelurahan.

### Kelian Banjar

Kelian Banjar dapat mengelola aset Banjar yang sesuai dengan `banjar_id` akun petugasnya. Kelian Banjar dapat memproses pengajuan untuk aset Banjar tersebut, melihat dashboard, pengajuan, aset Banjar, dan laporan.

### Lurah atau Pimpinan

Lurah atau pimpinan memiliki akses read-only. Menu yang tersedia adalah dashboard dan laporan. Lurah tidak dapat memproses pengajuan, mengubah aset, atau mengubah konfigurasi.

## Alur Warga Melihat Katalog Aset

1. Warga membuka halaman utama `/`.
2. Sistem memuat data aset, Banjar, tanggal terpakai, dan blacklist tanggal.
3. Warga dapat mencari aset berdasarkan nama atau lokasi.
4. Warga dapat memfilter berdasarkan kategori Desa/Kelurahan, Banjar, gratis, atau berbayar.
5. Warga memilih `Lihat Detail` untuk membuka halaman detail aset.
6. Pada halaman detail, warga melihat informasi aset, tarif, estimasi biaya, dan kalender ketersediaan.
7. Jika aset tersedia, warga dapat memilih `Ajukan Peminjaman`.
8. Jika aset maintenance, warga tidak dapat mengajukan aset tersebut.

## Alur Warga Mengajukan Peminjaman

1. Warga membuka detail aset dan memilih `Ajukan Peminjaman`.
2. Warga mengisi data diri.
3. Sistem memvalidasi data diri dan mengecek jumlah pengajuan aktif berdasarkan NIK.
4. Warga mengisi detail acara, tanggal, dan unggah foto KTP.
5. Warga masuk ke tahap konfirmasi.
6. Sistem menampilkan pratinjau surat dan ringkasan biaya.
7. Jika aset berbayar, warga wajib mengunggah bukti transfer sebelum pengajuan dikirim.
8. Warga menyetujui syarat dan ketentuan.
9. Sistem mengunggah foto KTP dan bukti transfer jika ada ke storage.
10. Sistem menyimpan pengajuan dengan status awal `pending`.
11. Sistem menampilkan nomor pengajuan.

## Alur Lacak Pengajuan

1. Warga membuka `/lacak`.
2. Warga memasukkan NIK, nomor HP, atau nomor pengajuan.
3. Sistem memanggil fungsi pelacakan.
4. Jika data cocok, sistem menampilkan daftar pengajuan.
5. Jika status `menunggu_pembayaran`, warga dapat upload bukti transfer.
6. Jika status `pending`, warga dapat membatalkan pengajuan.
7. Jika status `approved` atau `selesai`, warga dapat mengunduh surat izin PDF.
8. Jika tidak ada data cocok, sistem menampilkan pesan pengajuan tidak ditemukan.

## Alur Verifikasi Admin

1. Petugas masuk melalui `/admin`.
2. Sistem memeriksa akun petugas di tabel `user_admin`.
3. Jika akun nonaktif atau bukan petugas, login ditolak.
4. Petugas membuka dashboard atau manajemen pengajuan.
5. Sistem memuat pengajuan sesuai hak akses role.
6. Petugas mencocokkan data input warga dengan foto KTP.
7. Untuk status `pending`, petugas dapat memproses atau menolak.
8. Jika pengajuan berbayar dan belum ada bukti transfer, status menjadi `menunggu_pembayaran`.
9. Jika pengajuan gratis atau sudah ada bukti transfer, status dapat menjadi `approved`.
10. Untuk status `menunggu_konfirmasi_bayar`, petugas memverifikasi bukti pembayaran.
11. Jika pembayaran valid, status menjadi `approved`.
12. Jika pembayaran tidak valid, status kembali `menunggu_pembayaran` dan catatan pembayaran disimpan.
13. Setelah pemakaian selesai, petugas mengonfirmasi pengembalian agar status menjadi `selesai`.

## Pembayaran Aset Berbayar

Aset dapat memiliki status biaya `gratis` atau `berbayar`. Untuk aset berbayar, sistem menghitung biaya berdasarkan kategori tarif:

- `lokal`: warga dari Banjar yang sama atau aset Desa/Kelurahan untuk warga lokal.
- `antar_banjar`: aset Banjar dipinjam oleh warga Banjar lain.
- `luar_desa`: warga dari luar Desa/Kelurahan.

Biaya dihitung dari tarif per hari dikalikan durasi hari. Jika pengajuan membutuhkan pembayaran, warga mengunggah bukti transfer dalam format JPG, PNG, atau WebP. Bukti transfer disimpan di bucket private `pinfas-bukti-transfer` dan dapat dilihat petugas melalui signed URL.

## Surat Izin PDF

Surat izin PDF dapat diunduh dari halaman lacak atau dashboard warga jika pengajuan berstatus `approved` atau `selesai`. Surat berisi nomor pengajuan, data pemohon, NIK, banjar asal, nomor HP, estimasi tamu, nama aset, lokasi, keperluan, tanggal mulai, tanggal selesai, durasi, biaya sewa, informasi instansi, tanda tangan petugas, dan QR verifikasi.

## QR Verifikasi Surat

QR pada surat mengarah ke `/verifikasi/:nomorPengajuan`. Halaman verifikasi menampilkan apakah surat valid. Surat dianggap valid jika nomor pengajuan ditemukan dan status pengajuan adalah `approved` atau `selesai`. Halaman verifikasi menampilkan status, nama peminjam, aset, tanggal acara, nama admin, jabatan admin, dan waktu persetujuan.

## Laporan Publik

Laporan publik dapat diakses melalui `/laporan-publik`. Data yang ditampilkan bersifat agregat dan tidak menampilkan NIK, nomor HP, foto KTP, atau data pribadi warga. Data laporan publik dihitung dari pengajuan berstatus `selesai`.

## Status Pengajuan

- `pending`: pengajuan baru menunggu verifikasi petugas.
- `menunggu_pembayaran`: pengajuan berbayar menunggu bukti transfer warga.
- `menunggu_konfirmasi_bayar`: bukti transfer sudah dikirim dan menunggu verifikasi petugas.
- `approved`: pengajuan disetujui.
- `rejected`: pengajuan ditolak petugas.
- `dibatalkan`: pengajuan dibatalkan oleh warga atau petugas.
- `terlambat`: pengajuan approved sudah melewati tanggal selesai dan belum dikembalikan.
- `selesai`: aset sudah dikembalikan dan pengajuan selesai.

## Batasan Sistem

- Pengajuan tanpa login tetap membutuhkan NIK, nomor HP, data acara, tanggal, dan foto KTP.
- Pencarian lacak membutuhkan NIK, nomor HP, atau nomor pengajuan minimal 8 karakter.
- Satu NIK maksimal memiliki 2 pengajuan aktif.
- Tanggal pengajuan harus memenuhi minimal H sesuai konfigurasi.
- Aset gratis memiliki batas durasi sesuai konfigurasi.
- Upload foto KTP, bukti transfer, logo, dan foto aset dibatasi tipe gambar JPG, PNG, atau WebP sesuai konfigurasi storage.
- Ukuran file pada storage dikonfigurasi maksimal 5 MB untuk KTP, bukti transfer, dan foto aset, serta 2 MB untuk logo dan avatar.
- Surat PDF hanya tersedia untuk status `approved` dan `selesai`.
- QR verifikasi hanya valid untuk status `approved` dan `selesai`.
- Laporan publik hanya menggunakan data pengajuan yang sudah `selesai`.
- Pengajuan aset maintenance tidak dapat dimulai dari halaman detail aset.

## Hal yang Tidak Didukung Sistem

- Chatbot tidak membuat pengajuan otomatis karena pengajuan harus melalui form website, upload file, validasi tanggal, dan penyimpanan ke Supabase.
- Sistem tidak menyediakan pembayaran online otomatis atau payment gateway. Pembayaran dilakukan lewat transfer manual dan bukti transfer diverifikasi petugas.
- Sistem tidak memverifikasi isi KTP secara otomatis. Petugas mencocokkan data dan foto KTP secara manual.
- Sistem tidak membaca nominal transfer otomatis dari gambar bukti pembayaran.
- Sistem tidak mengirim notifikasi WhatsApp, SMS, atau email dari implementasi frontend yang ada.
- Sistem tidak menyediakan tanda tangan digital kriptografis. Keaslian surat diverifikasi melalui QR dan status pengajuan.
- Sistem tidak menampilkan data pribadi warga pada laporan publik dan riwayat aset publik.
- Sistem tidak menyediakan fitur edit pengajuan oleh warga setelah dikirim.
- Sistem tidak menyediakan penghapusan akun warga dari UI.
- Sistem tidak menyediakan reset password dari UI khusus PINFAS.
- Sistem tidak menyediakan pemesanan berulang otomatis.
- Sistem tidak mendukung aset dengan status selain `tersedia` dan `maintenance`.
- Sistem tidak mendukung role selain `admin_desa`, `kelian_banjar`, dan `lurah`.

