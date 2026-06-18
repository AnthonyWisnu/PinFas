insert into public.konfigurasi_instansi (
  id,
  tipe_instansi,
  nama_instansi,
  alamat,
  nomor_telepon,
  rekening_bank,
  rekening_nomor,
  rekening_atas_nama,
  batas_hari_gratis_lokal,
  batas_hari_gratis_luar,
  minimal_hari_pengajuan,
  tarif_denda_gratis
) values (
  '11111111-1111-4111-8111-111111111111',
  'desa',
  'Desa/Kelurahan Contoh',
  'Jalan Raya Desa No. 1',
  '0361-000000',
  'BPD Bali',
  '1234567890',
  'Pemerintah Desa/Kelurahan Contoh',
  3,
  1,
  3,
  50000
) on conflict (id) do update set
  tipe_instansi = excluded.tipe_instansi,
  nama_instansi = excluded.nama_instansi,
  alamat = excluded.alamat,
  nomor_telepon = excluded.nomor_telepon,
  rekening_bank = excluded.rekening_bank,
  rekening_nomor = excluded.rekening_nomor,
  rekening_atas_nama = excluded.rekening_atas_nama,
  batas_hari_gratis_lokal = excluded.batas_hari_gratis_lokal,
  batas_hari_gratis_luar = excluded.batas_hari_gratis_luar,
  minimal_hari_pengajuan = excluded.minimal_hari_pengajuan,
  tarif_denda_gratis = excluded.tarif_denda_gratis;

insert into public.banjar (id, nama) values
  ('22222222-2222-4222-8222-222222222201', 'Banjar Kaja'),
  ('22222222-2222-4222-8222-222222222202', 'Banjar Kelod'),
  ('22222222-2222-4222-8222-222222222203', 'Banjar Kangin'),
  ('22222222-2222-4222-8222-222222222204', 'Banjar Kauh')
on conflict (nama) do update set nama = excluded.nama;

insert into public.template_alasan_tolak (id, teks) values
  ('33333333-3333-4333-8333-333333333301', 'Tanggal yang diajukan sudah digunakan untuk kegiatan lain.'),
  ('33333333-3333-4333-8333-333333333302', 'Data pemohon belum sesuai dengan foto identitas.'),
  ('33333333-3333-4333-8333-333333333303', 'Keperluan peminjaman belum memenuhi syarat dan ketentuan.'),
  ('33333333-3333-4333-8333-333333333304', 'Aset sedang dalam masa pemeliharaan.')
on conflict (id) do update set teks = excluded.teks;

insert into public.aset (
  id,
  nama,
  kategori_pemilik,
  banjar_id,
  foto_urls,
  deskripsi,
  lokasi,
  syarat_ketentuan,
  kapasitas,
  status_biaya,
  tarif_lokal,
  tarif_antar_banjar,
  tarif_luar_desa,
  status_aset,
  checklist_kondisi
) values
  (
    '44444444-4444-4444-8444-444444444401',
    'Gedung Serbaguna Instansi',
    'desa',
    null,
    '{}',
    'Gedung serbaguna untuk kegiatan masyarakat tingkat desa atau kelurahan.',
    'Kompleks Kantor Desa/Kelurahan',
    array['Menjaga kebersihan area gedung', 'Mengembalikan fasilitas sesuai kondisi awal'],
    300,
    'berbayar',
    150000,
    150000,
    300000,
    'tersedia',
    array['Lantai bersih', 'Kursi tersedia', 'Lampu berfungsi']
  ),
  (
    '44444444-4444-4444-8444-444444444402',
    'Lapangan Umum Instansi',
    'desa',
    null,
    '{}',
    'Lapangan terbuka untuk olahraga dan kegiatan warga.',
    'Area Lapangan Utama',
    array['Tidak merusak rumput lapangan', 'Membersihkan sampah setelah kegiatan'],
    500,
    'gratis',
    0,
    0,
    0,
    'tersedia',
    array['Rumput lapangan baik', 'Penerangan tersedia']
  ),
  (
    '44444444-4444-4444-8444-444444444403',
    'Balai Banjar Kaja',
    'banjar',
    (select id from public.banjar where nama = 'Banjar Kaja' limit 1),
    '{}',
    'Balai Banjar Kaja untuk kegiatan warga dan upacara adat.',
    'Banjar Kaja',
    array['Prioritas untuk warga Banjar Kaja', 'Menjaga perlengkapan balai'],
    150,
    'berbayar',
    50000,
    100000,
    200000,
    'tersedia',
    array['Balai bersih', 'Sound system tersedia']
  ),
  (
    '44444444-4444-4444-8444-444444444404',
    'Balai Banjar Kelod',
    'banjar',
    (select id from public.banjar where nama = 'Banjar Kelod' limit 1),
    '{}',
    'Balai Banjar Kelod untuk rapat dan kegiatan warga.',
    'Banjar Kelod',
    array['Prioritas untuk warga Banjar Kelod', 'Mengembalikan kunci tepat waktu'],
    120,
    'berbayar',
    50000,
    100000,
    200000,
    'tersedia',
    array['Balai bersih', 'Meja tersedia']
  )
on conflict (id) do update set
  nama = excluded.nama,
  kategori_pemilik = excluded.kategori_pemilik,
  banjar_id = excluded.banjar_id,
  foto_urls = excluded.foto_urls,
  deskripsi = excluded.deskripsi,
  lokasi = excluded.lokasi,
  syarat_ketentuan = excluded.syarat_ketentuan,
  kapasitas = excluded.kapasitas,
  status_biaya = excluded.status_biaya,
  tarif_lokal = excluded.tarif_lokal,
  tarif_antar_banjar = excluded.tarif_antar_banjar,
  tarif_luar_desa = excluded.tarif_luar_desa,
  status_aset = excluded.status_aset,
  checklist_kondisi = excluded.checklist_kondisi;

insert into public.blacklist_tanggal (tanggal, keterangan)
values
  ('2026-08-17', 'Hari Kemerdekaan Republik Indonesia'),
  ('2026-12-31', 'Persiapan kegiatan akhir tahun')
on conflict (tanggal) do update set keterangan = excluded.keterangan;

insert into public.user_admin (id, auth_id, nama, jabatan, role, banjar_id)
select
  values_table.id,
  auth_users.id,
  values_table.nama,
  values_table.jabatan,
  values_table.role,
  values_table.banjar_id
from (
  values
    (
      '55555555-5555-4555-8555-555555555501'::uuid,
      'kelian.kaja@pinfas.id',
      'Kelian Banjar Kaja',
      'Kelian Banjar Kaja',
      'kelian_banjar',
      (select id from public.banjar where nama = 'Banjar Kaja' limit 1)
    ),
    (
      '55555555-5555-4555-8555-555555555502'::uuid,
      'kelian.kelod@pinfas.id',
      'Kelian Banjar Kelod',
      'Kelian Banjar Kelod',
      'kelian_banjar',
      (select id from public.banjar where nama = 'Banjar Kelod' limit 1)
    ),
    (
      '55555555-5555-4555-8555-555555555503'::uuid,
      'admin.desa@pinfas.id',
      'Admin Desa',
      'Admin Desa',
      'admin_desa',
      null::uuid
    ),
    (
      '55555555-5555-4555-8555-555555555504'::uuid,
      'lurah@pinfas.id',
      'Lurah',
      'Lurah',
      'lurah',
      null::uuid
    )
) as values_table(id, email, nama, jabatan, role, banjar_id)
join auth.users auth_users on auth_users.email = values_table.email
on conflict (auth_id) do update set
  nama = excluded.nama,
  jabatan = excluded.jabatan,
  role = excluded.role,
  banjar_id = excluded.banjar_id;
