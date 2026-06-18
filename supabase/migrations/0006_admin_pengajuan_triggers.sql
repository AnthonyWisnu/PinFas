create or replace function private.sync_tanggal_terpakai_from_pengajuan()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    delete from public.tanggal_terpakai
    where pengajuan_id = old.id;
    return old;
  end if;

  if new.status in ('approved', 'terlambat') then
    delete from public.tanggal_terpakai
    where pengajuan_id = new.id;

    if exists (
      select 1
      from public.tanggal_terpakai tt
      where tt.aset_id = new.aset_id
        and tt.pengajuan_id <> new.id
        and daterange(tt.tanggal_mulai, tt.tanggal_selesai, '[]')
          && daterange(new.tanggal_mulai, new.tanggal_selesai, '[]')
    ) then
      raise exception 'Tanggal aset sudah terpakai untuk pengajuan lain.';
    end if;

    insert into public.tanggal_terpakai (
      aset_id,
      pengajuan_id,
      tanggal_mulai,
      tanggal_selesai
    ) values (
      new.aset_id,
      new.id,
      new.tanggal_mulai,
      new.tanggal_selesai
    )
    on conflict (pengajuan_id) do update set
      aset_id = excluded.aset_id,
      tanggal_mulai = excluded.tanggal_mulai,
      tanggal_selesai = excluded.tanggal_selesai;
  else
    delete from public.tanggal_terpakai
    where pengajuan_id = new.id;
  end if;

  return new;
end;
$$;

revoke execute on function private.sync_tanggal_terpakai_from_pengajuan() from public, anon, authenticated;

create unique index if not exists tanggal_terpakai_pengajuan_id_key
on public.tanggal_terpakai (pengajuan_id);

drop trigger if exists sync_tanggal_terpakai_after_pengajuan_change on public.pengajuan;
create trigger sync_tanggal_terpakai_after_pengajuan_change
after insert or update of status, aset_id, tanggal_mulai, tanggal_selesai or delete on public.pengajuan
for each row execute function private.sync_tanggal_terpakai_from_pengajuan();
