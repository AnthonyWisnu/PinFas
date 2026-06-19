create or replace function public.upsert_warga_profile_self(
  p_nik text,
  p_nama text,
  p_nomor_hp text,
  p_banjar_asal text
)
returns public.warga_profile
language plpgsql
security definer
set search_path = ''
as $$
declare
  result public.warga_profile;
begin
  if (select auth.uid()) is null then
    raise exception 'Anda harus masuk sebagai warga terlebih dahulu.';
  end if;

  insert into public.warga_profile (
    auth_id,
    nik,
    nama,
    nomor_hp,
    banjar_asal
  )
  values (
    (select auth.uid()),
    trim(p_nik),
    trim(p_nama),
    trim(p_nomor_hp),
    trim(p_banjar_asal)
  )
  on conflict (auth_id) do update set
    nik = excluded.nik,
    nama = excluded.nama,
    nomor_hp = excluded.nomor_hp,
    banjar_asal = excluded.banjar_asal,
    updated_at = now()
  returning * into result;

  return result;
end;
$$;

revoke execute on function public.upsert_warga_profile_self(text, text, text, text) from public, anon;
grant execute on function public.upsert_warga_profile_self(text, text, text, text) to authenticated;

create or replace function public.handle_new_warga_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if coalesce(new.raw_user_meta_data->>'account_type', '') = 'warga'
    and nullif(trim(coalesce(new.raw_user_meta_data->>'nik', '')), '') is not null
  then
    insert into public.warga_profile (
      auth_id,
      nik,
      nama,
      nomor_hp,
      banjar_asal
    )
    values (
      new.id,
      trim(new.raw_user_meta_data->>'nik'),
      trim(coalesce(new.raw_user_meta_data->>'nama', '')),
      trim(coalesce(new.raw_user_meta_data->>'nomor_hp', '')),
      trim(coalesce(new.raw_user_meta_data->>'banjar_asal', ''))
    )
    on conflict (auth_id) do update set
      nik = excluded.nik,
      nama = excluded.nama,
      nomor_hp = excluded.nomor_hp,
      banjar_asal = excluded.banjar_asal,
      updated_at = now();
  end if;

  return new;
end;
$$;

revoke execute on function public.handle_new_warga_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created_warga_profile on auth.users;
create trigger on_auth_user_created_warga_profile
after insert on auth.users
for each row execute function public.handle_new_warga_user();
