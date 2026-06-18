delete from public.user_admin
where email in (
  'kelian.tengah@pinfas.id',
  'kelian.puseh@pinfas.id',
  'kelian.dalem@pinfas.id',
  'kelian.anyar@pinfas.id',
  'kelian.taman@pinfas.id',
  'kelian.sari@pinfas.id',
  'kelian.mekar@pinfas.id',
  'kelian.uma@pinfas.id'
);

delete from public.aset
where id = '66666666-6666-4666-8666-666666666624';

insert into public.banjar (id, nama) values
  ('22222222-2222-4222-8222-222222222201', 'Banjar Kaja'),
  ('22222222-2222-4222-8222-222222222202', 'Banjar Kelod'),
  ('22222222-2222-4222-8222-222222222203', 'Banjar Kangin'),
  ('22222222-2222-4222-8222-222222222204', 'Banjar Kauh')
on conflict (nama) do update set nama = excluded.nama;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('pinfas-aset', 'pinfas-aset', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('pinfas-logo', 'pinfas-logo', true, 2097152, array['image/jpeg', 'image/png', 'image/webp']),
  ('pinfas-avatar', 'pinfas-avatar', true, 2097152, array['image/jpeg', 'image/png', 'image/webp']),
  ('pinfas-ktp', 'pinfas-ktp', false, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('pinfas-bukti-transfer', 'pinfas-bukti-transfer', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into public.user_admin (id, auth_id, email, nama, jabatan, role, banjar_id, is_active)
select
  admin_seed.id,
  auth_users.id,
  admin_seed.email,
  admin_seed.nama,
  admin_seed.jabatan,
  admin_seed.role,
  banjar.id,
  true
from (
  values
    ('55555555-5555-4555-8555-555555555501'::uuid, 'kelian.kaja@pinfas.id', 'Kelian Banjar Kaja', 'Kelian Banjar Kaja', 'kelian_banjar', 'Banjar Kaja'),
    ('55555555-5555-4555-8555-555555555502'::uuid, 'kelian.kelod@pinfas.id', 'Kelian Banjar Kelod', 'Kelian Banjar Kelod', 'kelian_banjar', 'Banjar Kelod'),
    ('55555555-5555-4555-8555-555555555505'::uuid, 'kelian.kangin@pinfas.id', 'Kelian Banjar Kangin', 'Kelian Banjar Kangin', 'kelian_banjar', 'Banjar Kangin'),
    ('55555555-5555-4555-8555-555555555506'::uuid, 'kelian.kauh@pinfas.id', 'Kelian Banjar Kauh', 'Kelian Banjar Kauh', 'kelian_banjar', 'Banjar Kauh'),
    ('55555555-5555-4555-8555-555555555503'::uuid, 'admin.desa@pinfas.id', 'Admin Desa', 'Admin Desa', 'admin_desa', null),
    ('55555555-5555-4555-8555-555555555504'::uuid, 'lurah@pinfas.id', 'Lurah', 'Lurah / Kepala Instansi', 'lurah', null)
) as admin_seed(id, email, nama, jabatan, role, banjar_nama)
left join public.banjar banjar on banjar.nama = admin_seed.banjar_nama
left join auth.users auth_users on auth_users.email = admin_seed.email
on conflict (id) do update set
  auth_id = coalesce(excluded.auth_id, user_admin.auth_id),
  email = excluded.email,
  nama = excluded.nama,
  jabatan = excluded.jabatan,
  role = excluded.role,
  banjar_id = excluded.banjar_id,
  is_active = true;

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
)
select
  aset_seed.id,
  aset_seed.nama,
  aset_seed.kategori_pemilik,
  banjar.id,
  array[aset_seed.foto_url],
  aset_seed.deskripsi,
  aset_seed.lokasi,
  aset_seed.syarat_ketentuan,
  aset_seed.kapasitas,
  aset_seed.status_biaya,
  aset_seed.tarif_lokal,
  aset_seed.tarif_antar_banjar,
  aset_seed.tarif_luar_desa,
  aset_seed.status_aset,
  aset_seed.checklist_kondisi
from (
  values
    ('44444444-4444-4444-8444-444444444401'::uuid, 'Gedung Serbaguna Instansi', 'desa', null, 'https://placehold.co/1200x800/1E40AF/FFFFFF?text=Gedung+Serbaguna', 'Gedung utama untuk rapat besar, resepsi, dan kegiatan masyarakat tingkat desa atau kelurahan.', 'Kompleks Kantor Desa/Kelurahan', array['Menjaga kebersihan gedung', 'Tidak mengubah tata letak permanen tanpa izin'], 300, 'berbayar', 150000, 150000, 300000, 'tersedia', array['Lantai bersih', 'Lampu berfungsi', 'Kursi utama tersedia']),
    ('44444444-4444-4444-8444-444444444402'::uuid, 'Lapangan Umum Instansi', 'desa', null, 'https://placehold.co/1200x800/15803D/FFFFFF?text=Lapangan+Umum', 'Lapangan terbuka untuk olahraga, upacara, dan kegiatan publik.', 'Area Lapangan Utama', array['Tidak merusak rumput lapangan', 'Membersihkan sampah setelah kegiatan'], 500, 'gratis', 0, 0, 0, 'tersedia', array['Rumput lapangan baik', 'Penerangan tersedia']),
    ('66666666-6666-4666-8666-666666666601'::uuid, 'Wantilan Desa', 'desa', null, 'https://placehold.co/1200x800/7C2D12/FFFFFF?text=Wantilan+Desa', 'Wantilan terbuka untuk musyawarah, latihan seni, dan kegiatan adat.', 'Sebelah Balai Desa', array['Prioritas untuk kegiatan adat dan sosial', 'Mengembalikan area dalam kondisi bersih'], 220, 'berbayar', 100000, 150000, 250000, 'tersedia', array['Area panggung baik', 'Penerangan baik']),
    ('66666666-6666-4666-8666-666666666602'::uuid, 'Aula Rapat Kantor', 'desa', null, 'https://placehold.co/1200x800/334155/FFFFFF?text=Aula+Rapat', 'Ruang rapat indoor untuk pelatihan dan pertemuan resmi.', 'Kantor Desa/Kelurahan Lantai 1', array['Tidak membawa makanan basah ke ruang rapat', 'Peralatan dikembalikan ke posisi awal'], 80, 'gratis', 0, 50000, 100000, 'tersedia', array['AC berfungsi', 'Meja rapat baik', 'Proyektor tersedia']),
    ('66666666-6666-4666-8666-666666666603'::uuid, 'Panggung Portable Desa', 'desa', null, 'https://placehold.co/1200x800/9333EA/FFFFFF?text=Panggung+Portable', 'Panggung bongkar pasang untuk pentas seni dan acara luar ruang.', 'Gudang Aset Desa', array['Pemasangan harus diawasi petugas', 'Tidak digunakan saat hujan lebat'], 50, 'berbayar', 75000, 100000, 175000, 'tersedia', array['Rangka lengkap', 'Papan panggung baik']),
    ('66666666-6666-4666-8666-666666666604'::uuid, 'Tenda Kerucut Desa', 'desa', null, 'https://placehold.co/1200x800/0F766E/FFFFFF?text=Tenda+Kerucut', 'Set tenda kerucut untuk area tamu dan konsumsi.', 'Gudang Aset Desa', array['Pemasangan mengikuti arahan petugas', 'Kain tenda tidak boleh dicoret'], 120, 'berbayar', 50000, 75000, 125000, 'tersedia', array['Rangka lengkap', 'Kain tenda baik']),
    ('66666666-6666-4666-8666-666666666605'::uuid, 'Kursi Lipat Desa', 'desa', null, 'https://placehold.co/1200x800/2563EB/FFFFFF?text=Kursi+Lipat+Desa', 'Inventaris kursi lipat untuk kegiatan warga.', 'Gudang Aset Desa', array['Jumlah kembali harus sesuai berita acara', 'Kursi rusak wajib dilaporkan'], 300, 'gratis', 0, 0, 50000, 'tersedia', array['Kursi bersih', 'Kaki kursi baik']),
    ('66666666-6666-4666-8666-666666666606'::uuid, 'Meja Lipat Desa', 'desa', null, 'https://placehold.co/1200x800/CA8A04/FFFFFF?text=Meja+Lipat+Desa', 'Meja lipat untuk konsumsi, pendaftaran, dan rapat warga.', 'Gudang Aset Desa', array['Tidak digunakan untuk beban berlebih', 'Meja dibersihkan sebelum dikembalikan'], 80, 'gratis', 0, 0, 50000, 'tersedia', array['Permukaan meja baik', 'Engsel berfungsi']),
    ('66666666-6666-4666-8666-666666666607'::uuid, 'Sound System Desa', 'desa', null, 'https://placehold.co/1200x800/111827/FFFFFF?text=Sound+System', 'Perangkat audio untuk acara resmi dan sosial.', 'Gudang Aset Desa', array['Operator disediakan oleh pemohon atau petugas', 'Volume mengikuti batas ketertiban lingkungan'], 250, 'berbayar', 75000, 100000, 150000, 'tersedia', array['Speaker aktif baik', 'Mixer berfungsi', 'Kabel lengkap']),
    ('66666666-6666-4666-8666-666666666608'::uuid, 'Proyektor dan Layar', 'desa', null, 'https://placehold.co/1200x800/4F46E5/FFFFFF?text=Proyektor+Layar', 'Proyektor dan layar portable untuk sosialisasi dan pelatihan.', 'Ruang Sekretariat', array['Tidak digunakan di luar ruangan saat hujan', 'Lensa wajib ditutup setelah dipakai'], 100, 'berbayar', 50000, 75000, 100000, 'tersedia', array['Proyektor menyala', 'Remote tersedia', 'Layar baik']),
    ('66666666-6666-4666-8666-666666666609'::uuid, 'Genset Desa', 'desa', null, 'https://placehold.co/1200x800/B91C1C/FFFFFF?text=Genset+Desa', 'Generator listrik cadangan untuk kegiatan luar ruang.', 'Gudang Aset Desa', array['BBM ditanggung pemohon', 'Penggunaan wajib diawasi operator'], 1, 'berbayar', 100000, 125000, 200000, 'maintenance', array['Mesin menyala', 'Kabel output baik']),
    ('66666666-6666-4666-8666-666666666610'::uuid, 'Peralatan Kebersihan Acara', 'desa', null, 'https://placehold.co/1200x800/16A34A/FFFFFF?text=Peralatan+Kebersihan', 'Paket sapu, serok, tempat sampah, dan alat pel untuk kegiatan umum.', 'Gudang Kebersihan', array['Dikembalikan dalam kondisi lengkap', 'Kerusakan dicatat saat pengembalian'], 40, 'gratis', 0, 0, 25000, 'tersedia', array['Sapu lengkap', 'Tempat sampah bersih']),
    ('66666666-6666-4666-8666-666666666617'::uuid, 'Tenda Besar Instansi', 'desa', null, 'https://placehold.co/1200x800/0F766E/FFFFFF?text=Tenda+Besar', 'Tenda besar untuk upacara, pasar murah, dan kegiatan luar ruang.', 'Gudang Aset Desa', array['Pemasangan wajib bersama petugas', 'Tenda dikembalikan dalam kondisi kering'], 250, 'berbayar', 125000, 175000, 275000, 'tersedia', array['Rangka lengkap', 'Kain tenda baik']),
    ('66666666-6666-4666-8666-666666666618'::uuid, 'Stand Bazaar Desa', 'desa', null, 'https://placehold.co/1200x800/65A30D/FFFFFF?text=Stand+Bazaar', 'Set stand lipat untuk UMKM, bazaar, dan kegiatan pameran warga.', 'Gudang Aset Desa', array['Tidak menempel stiker permanen', 'Stand dibersihkan sebelum kembali'], 30, 'berbayar', 50000, 75000, 100000, 'tersedia', array['Rangka stand lengkap', 'Meja display baik']),
    ('66666666-6666-4666-8666-666666666619'::uuid, 'Peralatan Olahraga Desa', 'desa', null, 'https://placehold.co/1200x800/EA580C/FFFFFF?text=Peralatan+Olahraga', 'Paket net, bola, dan perlengkapan lomba untuk kegiatan olahraga.', 'Gudang Olahraga Desa', array['Dipakai untuk kegiatan warga', 'Jumlah alat dicatat saat kembali'], 100, 'gratis', 0, 25000, 50000, 'tersedia', array['Net baik', 'Bola tersedia', 'Peluit tersedia']),
    ('66666666-6666-4666-8666-666666666620'::uuid, 'Papan Pengumuman Portable', 'desa', null, 'https://placehold.co/1200x800/475569/FFFFFF?text=Papan+Pengumuman', 'Papan informasi portable untuk pengarahan acara dan penunjuk lokasi.', 'Ruang Sekretariat', array['Tidak dicoret permanen', 'Dikembalikan bersama kaki penyangga'], 10, 'gratis', 0, 0, 25000, 'tersedia', array['Papan bersih', 'Kaki penyangga lengkap']),
    ('66666666-6666-4666-8666-666666666621'::uuid, 'Lampu Sorot Acara', 'desa', null, 'https://placehold.co/1200x800/FACC15/111827?text=Lampu+Sorot', 'Set lampu sorot untuk kegiatan malam hari.', 'Gudang Aset Desa', array['Instalasi oleh petugas atau teknisi', 'Tidak digunakan saat hujan terbuka'], 80, 'berbayar', 50000, 75000, 125000, 'tersedia', array['Lampu menyala', 'Kabel baik']),
    ('66666666-6666-4666-8666-666666666622'::uuid, 'Karpet Acara Desa', 'desa', null, 'https://placehold.co/1200x800/7C2D12/FFFFFF?text=Karpet+Acara', 'Karpet gulung untuk rapat, sembahyang bersama, dan acara resmi.', 'Gudang Aset Desa', array['Karpet tidak boleh basah', 'Digulung rapi saat kembali'], 150, 'gratis', 0, 25000, 50000, 'tersedia', array['Karpet bersih', 'Gulungan lengkap']),
    ('66666666-6666-4666-8666-666666666623'::uuid, 'Handy Talky Petugas', 'desa', null, 'https://placehold.co/1200x800/1F2937/FFFFFF?text=Handy+Talky', 'Perangkat komunikasi untuk panitia kegiatan besar.', 'Ruang Sekretariat', array['Hanya untuk kegiatan berizin', 'Baterai dan charger wajib kembali'], 12, 'berbayar', 50000, 75000, 100000, 'tersedia', array['Unit menyala', 'Charger lengkap']),
    ('44444444-4444-4444-8444-444444444403'::uuid, 'Balai Banjar Kaja', 'banjar', 'Banjar Kaja', 'https://placehold.co/1200x800/1D4ED8/FFFFFF?text=Balai+Banjar+Kaja', 'Balai Banjar Kaja untuk rapat, upacara, dan kegiatan warga.', 'Banjar Kaja', array['Prioritas warga Banjar Kaja', 'Kunci dikembalikan tepat waktu'], 150, 'berbayar', 50000, 100000, 200000, 'tersedia', array['Balai bersih', 'Sound system tersedia']),
    ('66666666-6666-4666-8666-666666666611'::uuid, 'Set Kursi Banjar Kaja', 'banjar', 'Banjar Kaja', 'https://placehold.co/1200x800/2563EB/FFFFFF?text=Kursi+Banjar+Kaja', 'Set kursi plastik untuk kegiatan warga Banjar Kaja.', 'Gudang Banjar Kaja', array['Jumlah kursi dicatat saat keluar dan kembali'], 120, 'gratis', 0, 25000, 50000, 'tersedia', array['Kursi lengkap', 'Kursi tidak retak']),
    ('66666666-6666-4666-8666-666666666625'::uuid, 'Tenda Banjar Kaja', 'banjar', 'Banjar Kaja', 'https://placehold.co/1200x800/0F766E/FFFFFF?text=Tenda+Banjar+Kaja', 'Tenda lipat untuk kegiatan warga Banjar Kaja.', 'Gudang Banjar Kaja', array['Kain tenda kering saat kembali', 'Rangka tidak boleh hilang'], 80, 'berbayar', 25000, 50000, 75000, 'tersedia', array['Rangka lengkap', 'Kain tenda baik']),
    ('66666666-6666-4666-8666-666666666626'::uuid, 'Meja Banjar Kaja', 'banjar', 'Banjar Kaja', 'https://placehold.co/1200x800/CA8A04/FFFFFF?text=Meja+Banjar+Kaja', 'Set meja lipat untuk rapat dan konsumsi Banjar Kaja.', 'Gudang Banjar Kaja', array['Meja dibersihkan sebelum kembali'], 40, 'gratis', 0, 25000, 50000, 'tersedia', array['Meja lengkap', 'Engsel baik']),
    ('44444444-4444-4444-8444-444444444404'::uuid, 'Balai Banjar Kelod', 'banjar', 'Banjar Kelod', 'https://placehold.co/1200x800/7C3AED/FFFFFF?text=Balai+Banjar+Kelod', 'Balai Banjar Kelod untuk rapat dan kegiatan warga.', 'Banjar Kelod', array['Prioritas warga Banjar Kelod', 'Mengembalikan kunci tepat waktu'], 120, 'berbayar', 50000, 100000, 200000, 'tersedia', array['Balai bersih', 'Meja tersedia']),
    ('66666666-6666-4666-8666-666666666612'::uuid, 'Set Meja Banjar Kelod', 'banjar', 'Banjar Kelod', 'https://placehold.co/1200x800/CA8A04/FFFFFF?text=Meja+Banjar+Kelod', 'Set meja lipat untuk rapat dan konsumsi Banjar Kelod.', 'Gudang Banjar Kelod', array['Meja dibersihkan sebelum kembali'], 40, 'gratis', 0, 25000, 50000, 'tersedia', array['Meja lengkap', 'Engsel baik']),
    ('66666666-6666-4666-8666-666666666627'::uuid, 'Kursi Banjar Kelod', 'banjar', 'Banjar Kelod', 'https://placehold.co/1200x800/2563EB/FFFFFF?text=Kursi+Banjar+Kelod', 'Set kursi plastik untuk kegiatan Banjar Kelod.', 'Gudang Banjar Kelod', array['Jumlah kursi harus sesuai saat kembali'], 110, 'gratis', 0, 25000, 50000, 'tersedia', array['Kursi lengkap', 'Kursi bersih']),
    ('66666666-6666-4666-8666-666666666628'::uuid, 'Sound System Banjar Kelod', 'banjar', 'Banjar Kelod', 'https://placehold.co/1200x800/111827/FFFFFF?text=Sound+Banjar+Kelod', 'Sound system kecil untuk rapat dan acara banjar.', 'Gudang Banjar Kelod', array['Volume mengikuti aturan lingkungan', 'Kabel dikembalikan lengkap'], 120, 'berbayar', 30000, 50000, 75000, 'tersedia', array['Speaker baik', 'Kabel lengkap']),
    ('66666666-6666-4666-8666-666666666613'::uuid, 'Balai Banjar Kangin', 'banjar', 'Banjar Kangin', 'https://placehold.co/1200x800/0F766E/FFFFFF?text=Balai+Banjar+Kangin', 'Balai Banjar Kangin untuk kegiatan adat dan sosial.', 'Banjar Kangin', array['Prioritas warga Banjar Kangin', 'Menjaga perlengkapan balai'], 140, 'berbayar', 50000, 100000, 200000, 'tersedia', array['Lampu baik', 'Meja tersedia']),
    ('66666666-6666-4666-8666-666666666614'::uuid, 'Set Kursi Banjar Kangin', 'banjar', 'Banjar Kangin', 'https://placehold.co/1200x800/2563EB/FFFFFF?text=Kursi+Banjar+Kangin', 'Set kursi untuk kegiatan warga Banjar Kangin.', 'Gudang Banjar Kangin', array['Jumlah kembali harus sesuai'], 100, 'gratis', 0, 25000, 50000, 'tersedia', array['Kursi bersih', 'Kursi lengkap']),
    ('66666666-6666-4666-8666-666666666629'::uuid, 'Tenda Banjar Kangin', 'banjar', 'Banjar Kangin', 'https://placehold.co/1200x800/0F766E/FFFFFF?text=Tenda+Banjar+Kangin', 'Tenda lipat untuk kegiatan Banjar Kangin.', 'Gudang Banjar Kangin', array['Tenda kering saat dikembalikan'], 80, 'berbayar', 25000, 50000, 75000, 'tersedia', array['Rangka lengkap', 'Kain tenda baik']),
    ('66666666-6666-4666-8666-666666666630'::uuid, 'Perlengkapan Upacara Banjar Kangin', 'banjar', 'Banjar Kangin', 'https://placehold.co/1200x800/A16207/FFFFFF?text=Perlengkapan+Kangin', 'Perlengkapan pendukung kegiatan adat Banjar Kangin.', 'Gudang Banjar Kangin', array['Dipakai sesuai tujuan kegiatan', 'Dikembalikan lengkap'], 30, 'gratis', 0, 50000, 100000, 'tersedia', array['Inventaris lengkap', 'Kotak penyimpanan baik']),
    ('66666666-6666-4666-8666-666666666615'::uuid, 'Balai Banjar Kauh', 'banjar', 'Banjar Kauh', 'https://placehold.co/1200x800/B45309/FFFFFF?text=Balai+Banjar+Kauh', 'Balai Banjar Kauh untuk rapat dan kegiatan masyarakat.', 'Banjar Kauh', array['Prioritas warga Banjar Kauh', 'Area dapur dibersihkan setelah dipakai'], 130, 'berbayar', 50000, 100000, 200000, 'tersedia', array['Balai bersih', 'Dapur bersih']),
    ('66666666-6666-4666-8666-666666666616'::uuid, 'Tenda Banjar Kauh', 'banjar', 'Banjar Kauh', 'https://placehold.co/1200x800/0F766E/FFFFFF?text=Tenda+Banjar+Kauh', 'Tenda lipat untuk kegiatan warga Banjar Kauh.', 'Gudang Banjar Kauh', array['Kain tenda kering saat dikembalikan'], 80, 'berbayar', 25000, 50000, 75000, 'tersedia', array['Rangka lengkap', 'Kain tenda baik']),
    ('66666666-6666-4666-8666-666666666631'::uuid, 'Kursi Banjar Kauh', 'banjar', 'Banjar Kauh', 'https://placehold.co/1200x800/2563EB/FFFFFF?text=Kursi+Banjar+Kauh', 'Set kursi plastik untuk kegiatan Banjar Kauh.', 'Gudang Banjar Kauh', array['Jumlah kembali harus sesuai'], 100, 'gratis', 0, 25000, 50000, 'tersedia', array['Kursi lengkap', 'Kursi bersih']),
    ('66666666-6666-4666-8666-666666666632'::uuid, 'Meja Banjar Kauh', 'banjar', 'Banjar Kauh', 'https://placehold.co/1200x800/CA8A04/FFFFFF?text=Meja+Banjar+Kauh', 'Set meja lipat untuk rapat dan konsumsi Banjar Kauh.', 'Gudang Banjar Kauh', array['Meja dibersihkan sebelum dikembalikan'], 40, 'gratis', 0, 25000, 50000, 'tersedia', array['Meja lengkap', 'Engsel baik'])
) as aset_seed(
  id,
  nama,
  kategori_pemilik,
  banjar_nama,
  foto_url,
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
)
left join public.banjar banjar on banjar.nama = aset_seed.banjar_nama
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

delete from public.banjar
where nama in (
  'Banjar Tengah',
  'Banjar Puseh',
  'Banjar Dalem',
  'Banjar Anyar',
  'Banjar Taman',
  'Banjar Sari',
  'Banjar Mekar',
  'Banjar Uma'
);
