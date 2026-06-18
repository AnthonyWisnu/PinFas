create schema if not exists private;

create or replace function private.current_admin_role()
returns text
language sql
security definer
set search_path = ''
stable
as $$
  select ua.role
  from public.user_admin ua
  where ua.auth_id = (select auth.uid())
  limit 1
$$;

create or replace function private.current_admin_banjar_id()
returns text
language sql
security definer
set search_path = ''
stable
as $$
  select ua.banjar_id::text
  from public.user_admin ua
  where ua.auth_id = (select auth.uid())
  limit 1
$$;

create or replace function private.is_admin_desa()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select coalesce(private.current_admin_role() = 'admin_desa', false)
$$;

create or replace function private.is_lurah()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select coalesce(private.current_admin_role() = 'lurah', false)
$$;

create or replace function private.is_kelian_for_banjar(target_banjar_id text)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select coalesce(private.current_admin_role() = 'kelian_banjar'
    and private.current_admin_banjar_id() = target_banjar_id, false)
$$;

grant usage on schema private to anon, authenticated;
grant execute on function private.current_admin_role() to anon, authenticated;
grant execute on function private.current_admin_banjar_id() to anon, authenticated;
grant execute on function private.is_admin_desa() to anon, authenticated;
grant execute on function private.is_lurah() to anon, authenticated;
grant execute on function private.is_kelian_for_banjar(text) to anon, authenticated;

alter table public.konfigurasi_instansi enable row level security;
alter table public.banjar enable row level security;
alter table public.warga_profile enable row level security;
alter table public.user_admin enable row level security;
alter table public.aset enable row level security;
alter table public.blacklist_tanggal enable row level security;
alter table public.pengajuan enable row level security;
alter table public.tanggal_terpakai enable row level security;
alter table public.template_alasan_tolak enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.konfigurasi_instansi, public.banjar, public.aset, public.blacklist_tanggal, public.tanggal_terpakai to anon, authenticated;
grant select, insert, update on public.pengajuan to anon, authenticated;
grant select, insert, update on public.warga_profile to authenticated;
grant select on public.user_admin, public.template_alasan_tolak to authenticated;
grant insert, update, delete on public.aset, public.blacklist_tanggal, public.template_alasan_tolak, public.tanggal_terpakai to authenticated;
grant update on public.konfigurasi_instansi to authenticated;
grant insert, update on public.user_admin to authenticated;

drop policy if exists konfigurasi_public_select on public.konfigurasi_instansi;
create policy konfigurasi_public_select on public.konfigurasi_instansi
for select to anon, authenticated
using (true);

drop policy if exists konfigurasi_admin_update on public.konfigurasi_instansi;
create policy konfigurasi_admin_update on public.konfigurasi_instansi
for update to authenticated
using ((select private.is_admin_desa()))
with check ((select private.is_admin_desa()));

drop policy if exists banjar_public_select on public.banjar;
create policy banjar_public_select on public.banjar
for select to anon, authenticated
using (true);

drop policy if exists banjar_admin_all on public.banjar;
create policy banjar_admin_all on public.banjar
for all to authenticated
using ((select private.is_admin_desa()))
with check ((select private.is_admin_desa()));

drop policy if exists warga_profile_own_select on public.warga_profile;
create policy warga_profile_own_select on public.warga_profile
for select to authenticated
using (auth_id = (select auth.uid()));

drop policy if exists warga_profile_own_insert on public.warga_profile;
create policy warga_profile_own_insert on public.warga_profile
for insert to authenticated
with check (auth_id = (select auth.uid()));

drop policy if exists warga_profile_own_update on public.warga_profile;
create policy warga_profile_own_update on public.warga_profile
for update to authenticated
using (auth_id = (select auth.uid()))
with check (auth_id = (select auth.uid()));

drop policy if exists user_admin_read_scope on public.user_admin;
create policy user_admin_read_scope on public.user_admin
for select to authenticated
using (auth_id = (select auth.uid()) or (select private.is_admin_desa()) or (select private.is_lurah()));

drop policy if exists user_admin_admin_manage on public.user_admin;
create policy user_admin_admin_manage on public.user_admin
for all to authenticated
using ((select private.is_admin_desa()))
with check ((select private.is_admin_desa()));

drop policy if exists aset_public_select on public.aset;
create policy aset_public_select on public.aset
for select to anon, authenticated
using (true);

drop policy if exists aset_kelian_manage on public.aset;
create policy aset_kelian_manage on public.aset
for all to authenticated
using (kategori_pemilik = 'banjar' and (select private.is_kelian_for_banjar(banjar_id::text)))
with check (kategori_pemilik = 'banjar' and (select private.is_kelian_for_banjar(banjar_id::text)));

drop policy if exists aset_admin_manage on public.aset;
create policy aset_admin_manage on public.aset
for all to authenticated
using ((select private.is_admin_desa()))
with check ((select private.is_admin_desa()));

drop policy if exists blacklist_public_select on public.blacklist_tanggal;
create policy blacklist_public_select on public.blacklist_tanggal
for select to anon, authenticated
using (true);

drop policy if exists blacklist_admin_manage on public.blacklist_tanggal;
create policy blacklist_admin_manage on public.blacklist_tanggal
for all to authenticated
using ((select private.is_admin_desa()))
with check ((select private.is_admin_desa()));

drop policy if exists template_authenticated_select on public.template_alasan_tolak;
create policy template_authenticated_select on public.template_alasan_tolak
for select to authenticated
using (true);

drop policy if exists template_admin_manage on public.template_alasan_tolak;
create policy template_admin_manage on public.template_alasan_tolak
for all to authenticated
using ((select private.is_admin_desa()))
with check ((select private.is_admin_desa()));

drop policy if exists pengajuan_public_insert on public.pengajuan;
create policy pengajuan_public_insert on public.pengajuan
for insert to anon, authenticated
with check (
  status = 'pending'
  and (
    warga_profile_id is null
    or warga_profile_id in (
      select wp.id from public.warga_profile wp where wp.auth_id = (select auth.uid())
    )
  )
);

drop policy if exists pengajuan_warga_select_own on public.pengajuan;
create policy pengajuan_warga_select_own on public.pengajuan
for select to authenticated
using (
  warga_profile_id in (
    select wp.id from public.warga_profile wp where wp.auth_id = (select auth.uid())
  )
);

drop policy if exists pengajuan_warga_cancel_pending on public.pengajuan;
create policy pengajuan_warga_cancel_pending on public.pengajuan
for update to authenticated
using (
  status = 'pending'
  and warga_profile_id in (
    select wp.id from public.warga_profile wp where wp.auth_id = (select auth.uid())
  )
)
with check (
  status = 'dibatalkan'
  and warga_profile_id in (
    select wp.id from public.warga_profile wp where wp.auth_id = (select auth.uid())
  )
);

drop policy if exists pengajuan_admin_select_scope on public.pengajuan;
create policy pengajuan_admin_select_scope on public.pengajuan
for select to authenticated
using (
  (select private.is_admin_desa())
  or (select private.is_lurah())
  or exists (
    select 1
    from public.aset a
    where a.id = pengajuan.aset_id
      and a.kategori_pemilik = 'banjar'
      and (select private.is_kelian_for_banjar(a.banjar_id::text))
  )
);

drop policy if exists pengajuan_admin_update_scope on public.pengajuan;
create policy pengajuan_admin_update_scope on public.pengajuan
for update to authenticated
using (
  (select private.is_admin_desa())
  or exists (
    select 1
    from public.aset a
    where a.id = pengajuan.aset_id
      and a.kategori_pemilik = 'banjar'
      and (select private.is_kelian_for_banjar(a.banjar_id::text))
  )
)
with check (
  (select private.is_admin_desa())
  or exists (
    select 1
    from public.aset a
    where a.id = pengajuan.aset_id
      and a.kategori_pemilik = 'banjar'
      and (select private.is_kelian_for_banjar(a.banjar_id::text))
  )
);

drop policy if exists tanggal_public_select on public.tanggal_terpakai;
create policy tanggal_public_select on public.tanggal_terpakai
for select to anon, authenticated
using (true);

drop policy if exists tanggal_admin_manage on public.tanggal_terpakai;
create policy tanggal_admin_manage on public.tanggal_terpakai
for all to authenticated
using (
  (select private.is_admin_desa())
  or exists (
    select 1
    from public.aset a
    where a.id = tanggal_terpakai.aset_id
      and a.kategori_pemilik = 'banjar'
      and (select private.is_kelian_for_banjar(a.banjar_id::text))
  )
)
with check (
  (select private.is_admin_desa())
  or exists (
    select 1
    from public.aset a
    where a.id = tanggal_terpakai.aset_id
      and a.kategori_pemilik = 'banjar'
      and (select private.is_kelian_for_banjar(a.banjar_id::text))
  )
);

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

drop policy if exists pinfas_uploads_all on storage.objects;

do $$
begin
  if exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'rls_auto_enable'
  ) then
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end $$;

drop policy if exists storage_public_read_pinfas_public_assets on storage.objects;
create policy storage_public_read_pinfas_public_assets on storage.objects
for select to anon, authenticated
using (bucket_id in ('pinfas-aset', 'pinfas-logo', 'pinfas-avatar'));

drop policy if exists storage_public_upload_pengajuan_files on storage.objects;
create policy storage_public_upload_pengajuan_files on storage.objects
for insert to anon, authenticated
with check (bucket_id in ('pinfas-ktp', 'pinfas-bukti-transfer'));

drop policy if exists storage_authenticated_update_pengajuan_files on storage.objects;
create policy storage_authenticated_update_pengajuan_files on storage.objects
for update to authenticated
using (bucket_id in ('pinfas-ktp', 'pinfas-bukti-transfer'))
with check (bucket_id in ('pinfas-ktp', 'pinfas-bukti-transfer'));

drop policy if exists storage_admin_read_private_pinfas_files on storage.objects;
create policy storage_admin_read_private_pinfas_files on storage.objects
for select to authenticated
using (
  bucket_id in ('pinfas-ktp', 'pinfas-bukti-transfer')
  and ((select private.is_admin_desa()) or private.current_admin_role() = 'kelian_banjar' or (select private.is_lurah()))
);

drop policy if exists storage_admin_manage_public_assets on storage.objects;
create policy storage_admin_manage_public_assets on storage.objects
for all to authenticated
using (
  bucket_id in ('pinfas-aset', 'pinfas-logo', 'pinfas-avatar')
  and ((select private.is_admin_desa()) or private.current_admin_role() = 'kelian_banjar')
)
with check (
  bucket_id in ('pinfas-aset', 'pinfas-logo', 'pinfas-avatar')
  and ((select private.is_admin_desa()) or private.current_admin_role() = 'kelian_banjar')
);
