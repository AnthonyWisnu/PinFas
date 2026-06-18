create or replace function public.detail_surat_public(
  p_nomor_pengajuan text,
  p_identifier text
)
returns table (
  id uuid,
  nomor_pengajuan text,
  nik text,
  nama text,
  nomor_hp text,
  banjar_asal text,
  estimasi_tamu integer,
  keperluan text,
  tanggal_mulai date,
  tanggal_selesai date,
  durasi_hari integer,
  kategori_tarif text,
  tarif_per_hari integer,
  total_biaya integer,
  status text,
  approved_at timestamptz,
  nama_aset text,
  lokasi_aset text,
  nama_admin text,
  jabatan_admin text
)
language sql
security definer
set search_path = ''
as $$
  select
    p.id,
    p.nomor_pengajuan,
    p.nik,
    p.nama,
    p.nomor_hp,
    p.banjar_asal,
    p.estimasi_tamu,
    p.keperluan,
    p.tanggal_mulai,
    p.tanggal_selesai,
    p.durasi_hari,
    p.kategori_tarif,
    p.tarif_per_hari,
    p.total_biaya,
    p.status,
    p.approved_at,
    a.nama as nama_aset,
    a.lokasi as lokasi_aset,
    ua.nama as nama_admin,
    ua.jabatan as jabatan_admin
  from public.pengajuan p
  join public.aset a on a.id = p.aset_id
  left join public.user_admin ua on ua.id = p.approved_by
  where p.nomor_pengajuan = trim(coalesce(p_nomor_pengajuan, ''))
    and p.status in ('approved', 'selesai')
    and (
      p.nik = trim(coalesce(p_identifier, ''))
      or p.nomor_hp = trim(coalesce(p_identifier, ''))
      or p.nomor_pengajuan = trim(coalesce(p_identifier, ''))
    )
  limit 1;
$$;

revoke execute on function public.detail_surat_public(text, text) from public;
grant execute on function public.detail_surat_public(text, text) to anon, authenticated;

create or replace function public.verifikasi_surat_public(p_nomor_pengajuan text)
returns table (
  nomor_pengajuan text,
  status text,
  nama text,
  nama_aset text,
  tanggal_mulai date,
  tanggal_selesai date,
  nama_admin text,
  jabatan_admin text,
  approved_at timestamptz
)
language sql
security definer
set search_path = ''
as $$
  select
    p.nomor_pengajuan,
    p.status,
    p.nama,
    a.nama as nama_aset,
    p.tanggal_mulai,
    p.tanggal_selesai,
    ua.nama as nama_admin,
    ua.jabatan as jabatan_admin,
    p.approved_at
  from public.pengajuan p
  join public.aset a on a.id = p.aset_id
  left join public.user_admin ua on ua.id = p.approved_by
  where p.nomor_pengajuan = trim(coalesce(p_nomor_pengajuan, ''))
    and p.status in ('approved', 'selesai')
  limit 1;
$$;

revoke execute on function public.verifikasi_surat_public(text) from public;
grant execute on function public.verifikasi_surat_public(text) to anon, authenticated;
