drop view if exists public.riwayat_aset_publik;

create table if not exists public.riwayat_aset_publik (
  id uuid primary key,
  nomor_pengajuan text not null,
  aset_id uuid not null references public.aset(id) on delete cascade,
  nama_aset text not null,
  keperluan text not null,
  tanggal_mulai date not null,
  tanggal_selesai date not null,
  durasi_hari integer not null,
  kategori_tarif text not null,
  total_biaya integer not null default 0,
  status text not null check (status in ('approved', 'terlambat', 'selesai')),
  created_at timestamptz
);

alter table public.riwayat_aset_publik enable row level security;

drop policy if exists riwayat_aset_publik_select on public.riwayat_aset_publik;
create policy riwayat_aset_publik_select on public.riwayat_aset_publik
for select
to anon, authenticated
using (true);

grant select on public.riwayat_aset_publik to anon, authenticated;

insert into public.riwayat_aset_publik (
  id,
  nomor_pengajuan,
  aset_id,
  nama_aset,
  keperluan,
  tanggal_mulai,
  tanggal_selesai,
  durasi_hari,
  kategori_tarif,
  total_biaya,
  status,
  created_at
)
select
  p.id,
  p.nomor_pengajuan,
  p.aset_id,
  a.nama,
  p.keperluan,
  p.tanggal_mulai,
  p.tanggal_selesai,
  p.durasi_hari,
  p.kategori_tarif,
  p.total_biaya,
  p.status,
  p.created_at
from public.pengajuan p
join public.aset a on a.id = p.aset_id
where p.status in ('approved', 'terlambat', 'selesai')
on conflict (id) do update set
  nama_aset = excluded.nama_aset,
  keperluan = excluded.keperluan,
  tanggal_mulai = excluded.tanggal_mulai,
  tanggal_selesai = excluded.tanggal_selesai,
  durasi_hari = excluded.durasi_hari,
  kategori_tarif = excluded.kategori_tarif,
  total_biaya = excluded.total_biaya,
  status = excluded.status;

create or replace function private.sync_riwayat_aset_publik()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  asset_name text;
begin
  if tg_op = 'DELETE' then
    delete from public.riwayat_aset_publik where id = old.id;
    return old;
  end if;

  if new.status not in ('approved', 'terlambat', 'selesai') then
    delete from public.riwayat_aset_publik where id = new.id;
    return new;
  end if;

  select nama into asset_name from public.aset where id = new.aset_id;

  insert into public.riwayat_aset_publik (
    id,
    nomor_pengajuan,
    aset_id,
    nama_aset,
    keperluan,
    tanggal_mulai,
    tanggal_selesai,
    durasi_hari,
    kategori_tarif,
    total_biaya,
    status,
    created_at
  )
  values (
    new.id,
    new.nomor_pengajuan,
    new.aset_id,
    coalesce(asset_name, 'Aset'),
    new.keperluan,
    new.tanggal_mulai,
    new.tanggal_selesai,
    new.durasi_hari,
    new.kategori_tarif,
    new.total_biaya,
    new.status,
    new.created_at
  )
  on conflict (id) do update set
    nama_aset = excluded.nama_aset,
    keperluan = excluded.keperluan,
    tanggal_mulai = excluded.tanggal_mulai,
    tanggal_selesai = excluded.tanggal_selesai,
    durasi_hari = excluded.durasi_hari,
    kategori_tarif = excluded.kategori_tarif,
    total_biaya = excluded.total_biaya,
    status = excluded.status;

  return new;
end;
$$;

revoke execute on function private.sync_riwayat_aset_publik() from public, anon, authenticated;

drop trigger if exists pengajuan_sync_riwayat_aset_publik on public.pengajuan;
create trigger pengajuan_sync_riwayat_aset_publik
after insert or update or delete on public.pengajuan
for each row execute function private.sync_riwayat_aset_publik();
