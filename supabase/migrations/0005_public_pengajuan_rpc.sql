create or replace function public.lacak_pengajuan(p_query text)
returns table (
  id uuid,
  nomor_pengajuan text,
  aset_id uuid,
  nama_aset text,
  keperluan text,
  tanggal_mulai date,
  tanggal_selesai date,
  durasi_hari integer,
  kategori_tarif text,
  tarif_per_hari integer,
  total_biaya integer,
  bukti_transfer_url text,
  status text,
  alasan_tolak text,
  catatan_pembayaran text,
  denda_keterlambatan integer,
  created_at timestamptz
)
language sql
security definer
set search_path = ''
as $$
  select
    p.id,
    p.nomor_pengajuan,
    p.aset_id,
    a.nama as nama_aset,
    p.keperluan,
    p.tanggal_mulai,
    p.tanggal_selesai,
    p.durasi_hari,
    p.kategori_tarif,
    p.tarif_per_hari,
    p.total_biaya,
    p.bukti_transfer_url,
    p.status,
    p.alasan_tolak,
    p.catatan_pembayaran,
    p.denda_keterlambatan,
    p.created_at
  from public.pengajuan p
  join public.aset a on a.id = p.aset_id
  where length(trim(coalesce(p_query, ''))) >= 8
    and (p.nik = trim(p_query) or p.nomor_hp = trim(p_query) or p.nomor_pengajuan = trim(p_query))
  order by p.created_at desc;
$$;

revoke execute on function public.lacak_pengajuan(text) from public;
grant execute on function public.lacak_pengajuan(text) to anon, authenticated;

create or replace function public.hitung_pengajuan_aktif(p_nik text)
returns integer
language sql
security definer
set search_path = ''
as $$
  select count(*)::integer
  from public.pengajuan p
  where p.nik = trim(coalesce(p_nik, ''))
    and p.status in ('pending', 'menunggu_pembayaran', 'menunggu_konfirmasi_bayar', 'approved', 'terlambat');
$$;

revoke execute on function public.hitung_pengajuan_aktif(text) from public;
grant execute on function public.hitung_pengajuan_aktif(text) to anon, authenticated;

create or replace function public.update_bukti_transfer_public(
  p_nomor_pengajuan text,
  p_identifier text,
  p_bukti_transfer_url text
)
returns table (
  id uuid,
  nomor_pengajuan text,
  status text,
  bukti_transfer_url text,
  catatan_pembayaran text
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  return query
  update public.pengajuan p
  set
    bukti_transfer_url = p_bukti_transfer_url,
    status = 'menunggu_konfirmasi_bayar',
    catatan_pembayaran = null,
    updated_at = now()
  where p.nomor_pengajuan = trim(coalesce(p_nomor_pengajuan, ''))
    and (p.nik = trim(coalesce(p_identifier, '')) or p.nomor_hp = trim(coalesce(p_identifier, '')))
    and p.status = 'menunggu_pembayaran'
  returning p.id, p.nomor_pengajuan, p.status, p.bukti_transfer_url, p.catatan_pembayaran;
end;
$$;

revoke execute on function public.update_bukti_transfer_public(text, text, text) from public;
grant execute on function public.update_bukti_transfer_public(text, text, text) to anon, authenticated;

create or replace function public.batalkan_pengajuan_public(
  p_nomor_pengajuan text,
  p_identifier text
)
returns table (
  id uuid,
  nomor_pengajuan text,
  status text
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  return query
  update public.pengajuan p
  set status = 'dibatalkan', updated_at = now()
  where p.nomor_pengajuan = trim(coalesce(p_nomor_pengajuan, ''))
    and (p.nik = trim(coalesce(p_identifier, '')) or p.nomor_hp = trim(coalesce(p_identifier, '')))
    and p.status = 'pending'
  returning p.id, p.nomor_pengajuan, p.status;
end;
$$;

revoke execute on function public.batalkan_pengajuan_public(text, text) from public;
grant execute on function public.batalkan_pengajuan_public(text, text) to anon, authenticated;
