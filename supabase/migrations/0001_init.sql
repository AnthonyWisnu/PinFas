create extension if not exists pgcrypto;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'banjar'
      and column_name = 'id'
      and data_type <> 'uuid'
  ) then
    drop table if exists public.tanggal_terpakai cascade;
    drop table if exists public.pengajuan cascade;
    drop table if exists public.aset cascade;
    drop table if exists public.blacklist_tanggal cascade;
    drop table if exists public.template_alasan_tolak cascade;
    drop table if exists public.user_admin cascade;
    drop table if exists public.warga_profile cascade;
    drop table if exists public.banjar cascade;
    drop table if exists public.konfigurasi_instansi cascade;
  end if;
end $$;

create table if not exists public.konfigurasi_instansi (
  id uuid primary key default gen_random_uuid(),
  tipe_instansi text not null default 'desa' check (tipe_instansi in ('desa', 'kelurahan')),
  nama_instansi text not null default 'Desa',
  alamat text,
  nomor_telepon text,
  logo_url text,
  rekening_bank text,
  rekening_nomor text,
  rekening_atas_nama text,
  batas_hari_gratis_lokal integer not null default 3,
  batas_hari_gratis_luar integer not null default 1,
  minimal_hari_pengajuan integer not null default 3,
  tarif_denda_gratis integer not null default 50000,
  updated_at timestamptz default now()
);

create table if not exists public.banjar (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  created_at timestamptz default now()
);

create table if not exists public.warga_profile (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid unique references auth.users(id) on delete cascade,
  nik text unique not null,
  nama text not null,
  nomor_hp text not null,
  banjar_asal text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.user_admin (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid unique references auth.users(id) on delete set null,
  nama text not null,
  jabatan text not null,
  role text not null check (role in ('kelian_banjar', 'admin_desa', 'lurah')),
  banjar_id uuid references public.banjar(id) on delete set null,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists public.aset (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  kategori_pemilik text not null check (kategori_pemilik in ('desa', 'banjar')),
  banjar_id uuid references public.banjar(id) on delete set null,
  foto_urls text[] not null default '{}',
  deskripsi text,
  lokasi text,
  syarat_ketentuan text[] default '{}',
  kapasitas integer,
  status_biaya text not null default 'gratis' check (status_biaya in ('gratis', 'berbayar')),
  tarif_lokal integer default 0,
  tarif_antar_banjar integer default 0,
  tarif_luar_desa integer default 0,
  status_aset text not null default 'tersedia' check (status_aset in ('tersedia', 'maintenance')),
  checklist_kondisi text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.blacklist_tanggal (
  id uuid primary key default gen_random_uuid(),
  tanggal date not null unique,
  keterangan text,
  created_by uuid references public.user_admin(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.template_alasan_tolak (
  id uuid primary key default gen_random_uuid(),
  teks text not null,
  created_at timestamptz default now()
);

create table if not exists public.pengajuan (
  id uuid primary key default gen_random_uuid(),
  nomor_pengajuan text unique not null,
  aset_id uuid not null references public.aset(id) on delete restrict,
  warga_profile_id uuid references public.warga_profile(id) on delete set null,
  nik text not null,
  nama text not null,
  nomor_hp text not null,
  banjar_asal text not null,
  keperluan text not null,
  estimasi_tamu integer,
  tanggal_mulai date not null,
  tanggal_selesai date not null,
  durasi_hari integer generated always as ((tanggal_selesai - tanggal_mulai) + 1) stored,
  kategori_tarif text not null check (kategori_tarif in ('lokal', 'antar_banjar', 'luar_desa')),
  tarif_per_hari integer not null default 0,
  total_biaya integer not null default 0,
  foto_ktp_url text,
  bukti_transfer_url text,
  status text not null default 'pending' check (status in (
    'pending',
    'menunggu_pembayaran',
    'menunggu_konfirmasi_bayar',
    'approved',
    'rejected',
    'dibatalkan',
    'terlambat',
    'selesai'
  )),
  alasan_tolak text,
  template_alasan_id uuid references public.template_alasan_tolak(id) on delete set null,
  catatan_pembayaran text,
  checklist_sebelum jsonb,
  checklist_sesudah jsonb,
  kondisi_kembali text check (kondisi_kembali in ('baik', 'ada_kerusakan')),
  catatan_pengembalian text,
  denda_keterlambatan integer default 0,
  tanggal_kembali_aktual date,
  alasan_paksa_batal text,
  approved_by uuid references public.user_admin(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.tanggal_terpakai (
  id uuid primary key default gen_random_uuid(),
  aset_id uuid not null references public.aset(id) on delete cascade,
  pengajuan_id uuid not null references public.pengajuan(id) on delete cascade,
  tanggal_mulai date not null,
  tanggal_selesai date not null
);

alter table public.konfigurasi_instansi add column if not exists tarif_denda_gratis integer not null default 50000;
alter table public.warga_profile add column if not exists updated_at timestamptz default now();
alter table public.user_admin add column if not exists avatar_url text;
alter table public.aset add column if not exists foto_urls text[] not null default '{}';
alter table public.aset add column if not exists kapasitas integer;
alter table public.aset add column if not exists checklist_kondisi text[] default '{}';
alter table public.aset add column if not exists updated_at timestamptz default now();
alter table public.pengajuan add column if not exists warga_profile_id uuid references public.warga_profile(id) on delete set null;
alter table public.pengajuan add column if not exists estimasi_tamu integer;
alter table public.pengajuan add column if not exists durasi_hari integer generated always as ((tanggal_selesai - tanggal_mulai) + 1) stored;
alter table public.pengajuan add column if not exists tarif_per_hari integer not null default 0;
alter table public.pengajuan add column if not exists foto_ktp_url text;
alter table public.pengajuan add column if not exists bukti_transfer_url text;
alter table public.pengajuan add column if not exists template_alasan_id uuid references public.template_alasan_tolak(id) on delete set null;
alter table public.pengajuan add column if not exists checklist_sebelum jsonb;
alter table public.pengajuan add column if not exists checklist_sesudah jsonb;
alter table public.pengajuan add column if not exists denda_keterlambatan integer default 0;
alter table public.pengajuan add column if not exists tanggal_kembali_aktual date;
alter table public.pengajuan add column if not exists alasan_paksa_batal text;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'user_admin' and column_name = 'avatar'
  ) then
    execute 'update public.user_admin set avatar_url = avatar where avatar_url is null';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'aset' and column_name = 'foto'
  ) then
    execute 'update public.aset set foto_urls = foto where foto_urls = ''{}''';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'pengajuan' and column_name = 'foto_ktp'
  ) then
    execute 'update public.pengajuan set foto_ktp_url = foto_ktp where foto_ktp_url is null';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'pengajuan' and column_name = 'bukti_transfer'
  ) then
    execute 'update public.pengajuan set bukti_transfer_url = bukti_transfer where bukti_transfer_url is null';
  end if;
end $$;

update public.pengajuan
set kategori_tarif = case kategori_tarif
  when 'antarBanjar' then 'antar_banjar'
  when 'luarDesa' then 'luar_desa'
  else kategori_tarif
end;

alter table public.pengajuan drop constraint if exists pengajuan_kategori_tarif_check;
alter table public.pengajuan add constraint pengajuan_kategori_tarif_check
  check (kategori_tarif in ('lokal', 'antar_banjar', 'luar_desa'));

alter table public.pengajuan drop constraint if exists pengajuan_status_check;
alter table public.pengajuan add constraint pengajuan_status_check
  check (status in (
    'pending',
    'menunggu_pembayaran',
    'menunggu_konfirmasi_bayar',
    'approved',
    'rejected',
    'dibatalkan',
    'terlambat',
    'selesai'
  ));

create unique index if not exists banjar_nama_key on public.banjar (nama);
create index if not exists user_admin_auth_id_idx on public.user_admin (auth_id);
create index if not exists user_admin_role_idx on public.user_admin (role);
create index if not exists user_admin_banjar_id_idx on public.user_admin (banjar_id);
create index if not exists warga_profile_auth_id_idx on public.warga_profile (auth_id);
create index if not exists warga_profile_nik_idx on public.warga_profile (nik);
create index if not exists aset_banjar_id_idx on public.aset (banjar_id);
create index if not exists aset_kategori_pemilik_idx on public.aset (kategori_pemilik);
create index if not exists aset_status_aset_idx on public.aset (status_aset);
create index if not exists pengajuan_aset_id_idx on public.pengajuan (aset_id);
create index if not exists pengajuan_warga_profile_id_idx on public.pengajuan (warga_profile_id);
create index if not exists pengajuan_template_alasan_id_idx on public.pengajuan (template_alasan_id);
create index if not exists pengajuan_approved_by_idx on public.pengajuan (approved_by);
create index if not exists pengajuan_nik_idx on public.pengajuan (nik);
create index if not exists pengajuan_nomor_hp_idx on public.pengajuan (nomor_hp);
create index if not exists pengajuan_status_idx on public.pengajuan (status);
create index if not exists pengajuan_pending_active_idx on public.pengajuan (nik, status)
  where status in ('pending', 'approved');
create index if not exists tanggal_terpakai_aset_id_idx on public.tanggal_terpakai (aset_id);
create index if not exists tanggal_terpakai_pengajuan_id_idx on public.tanggal_terpakai (pengajuan_id);
create index if not exists blacklist_tanggal_tanggal_idx on public.blacklist_tanggal (tanggal);
create index if not exists blacklist_tanggal_created_by_idx on public.blacklist_tanggal (created_by);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_konfigurasi_instansi_updated_at on public.konfigurasi_instansi;
create trigger set_konfigurasi_instansi_updated_at
before update on public.konfigurasi_instansi
for each row execute function public.set_updated_at();

drop trigger if exists set_warga_profile_updated_at on public.warga_profile;
create trigger set_warga_profile_updated_at
before update on public.warga_profile
for each row execute function public.set_updated_at();

drop trigger if exists set_aset_updated_at on public.aset;
create trigger set_aset_updated_at
before update on public.aset
for each row execute function public.set_updated_at();

drop trigger if exists set_pengajuan_updated_at on public.pengajuan;
create trigger set_pengajuan_updated_at
before update on public.pengajuan
for each row execute function public.set_updated_at();
