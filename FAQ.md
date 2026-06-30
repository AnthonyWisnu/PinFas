## FAQ PINFAS

### 1. Apa itu PINFAS?

PINFAS adalah aplikasi web untuk peminjaman fasilitas atau aset publik tingkat Desa, Kelurahan, dan Banjar. Warga dapat melihat katalog aset, mengajukan peminjaman, melacak status, mengunggah bukti pembayaran jika diperlukan, dan mengunduh surat izin setelah disetujui.

### 2. Siapa pengguna PINFAS?

Pengguna PINFAS terdiri dari pengunjung publik, warga yang login, Admin Desa/Kelurahan, Kelian Banjar, dan Lurah atau pimpinan. Masing-masing memiliki akses berbeda sesuai implementasi role di aplikasi.

### 3. Apakah warga harus login?

Tidak. Warga tetap bisa mengajukan peminjaman tanpa login. Login warga bersifat opsional dan digunakan untuk mengisi data profil serta melihat riwayat pengajuan pribadi di dashboard warga.

### 4. Bagaimana cara melihat katalog aset?

Warga membuka halaman utama PINFAS. Katalog menampilkan daftar aset dengan foto, nama, kategori, lokasi, kapasitas, status aset, dan biaya. Warga dapat mencari aset berdasarkan nama atau lokasi, serta memfilter berdasarkan kategori dan status biaya.

### 5. Bagaimana cara mengajukan peminjaman aset?

Warga membuka detail aset, lalu memilih tombol `Ajukan Peminjaman` jika aset tersedia. Setelah itu warga mengisi data diri, detail acara, mengunggah foto KTP, memeriksa ringkasan, mengunggah bukti transfer jika aset berbayar, menyetujui syarat, lalu mengirim pengajuan.

### 6. Data apa saja yang perlu diisi saat pengajuan?

Data yang perlu diisi adalah NIK, nama lengkap, nomor HP, banjar asal, estimasi jumlah tamu, keperluan acara, tanggal mulai, tanggal selesai, dan foto KTP. Untuk aset berbayar, warga juga perlu mengunggah bukti transfer.

### 7. Bagaimana cara melacak pengajuan?

Warga membuka halaman `Lacak Pengajuan`, lalu memasukkan NIK, nomor HP, atau nomor pengajuan. Sistem menampilkan pengajuan yang cocok, termasuk status, informasi aset, tanggal, biaya, catatan pembayaran, alasan penolakan, dan tombol aksi yang tersedia.

### 8. Apa saja status pengajuan?

Status pengajuan adalah `pending`, `menunggu_pembayaran`, `menunggu_konfirmasi_bayar`, `approved`, `rejected`, `dibatalkan`, `terlambat`, dan `selesai`.

### 9. Siapa yang memverifikasi pengajuan?

Pengajuan diverifikasi oleh petugas admin sesuai hak akses. Admin Desa/Kelurahan memproses aset Desa/Kelurahan, sedangkan Kelian Banjar memproses aset Banjar sesuai Banjar miliknya. Lurah hanya read-only.

### 10. Apa fungsi Admin Desa/Kelurahan?

Admin Desa/Kelurahan dapat mengelola aset Desa/Kelurahan, memproses pengajuan terkait aset Desa/Kelurahan, mengelola konfigurasi instansi, rekening, aturan peminjaman, blacklist tanggal, template alasan penolakan, akun petugas, dan laporan.

### 11. Apa fungsi admin Banjar atau Kelian Banjar?

Kelian Banjar dapat mengelola aset Banjar miliknya, melihat dan memproses pengajuan untuk aset Banjar tersebut, mengubah status maintenance aset Banjar, mengonfirmasi pembayaran, dan mengonfirmasi pengembalian.

### 12. Apa fungsi Lurah atau pimpinan?

Lurah atau pimpinan memiliki akses read-only. Berdasarkan menu aplikasi, Lurah dapat melihat dashboard dan laporan, tetapi tidak dapat memproses pengajuan, mengubah aset, mengubah konfigurasi, atau mengelola akun.

### 13. Bagaimana sistem menangani aset berbayar?

Untuk aset berbayar, sistem menghitung biaya berdasarkan kategori tarif dan durasi hari. Kategori tarif meliputi lokal, antar Banjar, dan luar Desa/Kelurahan. Warga harus mengunggah bukti transfer sebelum atau setelah pengajuan bergantung status pengajuan.

### 14. Apa fungsi bukti pembayaran?

Bukti pembayaran digunakan petugas untuk memverifikasi pembayaran aset berbayar. Jika bukti pembayaran valid, pengajuan dapat disetujui. Jika tidak valid, petugas dapat mengembalikan status menjadi `menunggu_pembayaran` dan memberi catatan agar warga mengunggah ulang.

### 15. Apa itu surat izin PDF?

Surat izin PDF adalah dokumen izin peminjaman fasilitas yang dapat diunduh setelah pengajuan berstatus `approved` atau `selesai`. Surat berisi data pemohon, data aset, tanggal acara, biaya, informasi instansi, petugas yang menyetujui, dan QR verifikasi.

### 16. Apa fungsi QR verifikasi surat?

QR verifikasi digunakan untuk mengecek keaslian surat. QR mengarah ke halaman verifikasi berdasarkan nomor pengajuan. Surat dianggap valid jika nomor pengajuan ditemukan dan statusnya `approved` atau `selesai`.

### 17. Apa itu laporan publik?

Laporan publik adalah halaman transparansi penggunaan fasilitas publik. Data yang ditampilkan berupa agregat seperti total pemasukan, total penyewaan, pemasukan bulan ini, tren penyewaan, pemasukan per wilayah, dan aset paling sering dipinjam. Data pribadi warga tidak ditampilkan.

### 18. Apa yang terjadi jika jadwal aset bentrok?

Jika tanggal pengajuan bentrok dengan tanggal terpakai, validasi pengajuan menolak tanggal tersebut. Di sisi database, saat pengajuan disetujui, trigger juga mencegah penyimpanan tanggal terpakai yang overlap dengan pengajuan lain.

### 19. Apakah chatbot bisa membuat pengajuan otomatis?

Tidak berdasarkan implementasi saat ini. Pengajuan harus dilakukan melalui form website karena membutuhkan input data, upload foto KTP, validasi tanggal, validasi NIK, dan penyimpanan file ke storage.

### 20. Apa yang harus dilakukan jika informasi tidak tersedia?

Jika informasi tidak tersedia di aplikasi, pengguna dapat mengecek halaman terkait seperti katalog, detail aset, lacak pengajuan, atau laporan publik. Jika data tetap tidak ditemukan, pengguna perlu menghubungi petugas Desa/Kelurahan karena chatbot hanya menjawab berdasarkan informasi yang tersedia di sistem dan knowledge base.
