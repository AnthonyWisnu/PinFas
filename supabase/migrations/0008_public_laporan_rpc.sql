create or replace function public.laporan_publik_ringkas()
returns jsonb
language sql
security definer
set search_path = ''
as $$
  with selesai as (
    select
      p.id,
      p.tanggal_kembali_aktual,
      p.total_biaya,
      p.denda_keterlambatan,
      a.id as aset_id,
      a.nama as nama_aset,
      coalesce(b.nama, 'Desa/Kelurahan') as nama_banjar
    from public.pengajuan p
    join public.aset a on a.id = p.aset_id
    left join public.banjar b on b.id = a.banjar_id
    where p.status = 'selesai'
  ),
  kpi as (
    select jsonb_build_object(
      'totalPemasukan', coalesce(sum(total_biaya + denda_keterlambatan), 0),
      'totalPenyewaan', count(*),
      'pemasukanBulanIni', coalesce(sum(total_biaya + denda_keterlambatan)
        filter (where date_trunc('month', tanggal_kembali_aktual) = date_trunc('month', current_date)), 0)
    ) as data
    from selesai
  ),
  per_aset as (
    select coalesce(jsonb_agg(row_to_json(rows) order by rows.total_penyewaan desc), '[]'::jsonb) as data
    from (
      select
        aset_id,
        nama_aset,
        count(*)::integer as total_penyewaan,
        coalesce(sum(total_biaya + denda_keterlambatan), 0)::integer as total_pemasukan
      from selesai
      group by aset_id, nama_aset
      order by total_penyewaan desc
      limit 10
    ) rows
  ),
  per_banjar as (
    select coalesce(jsonb_agg(row_to_json(rows) order by rows.total_pemasukan desc), '[]'::jsonb) as data
    from (
      select
        nama_banjar,
        count(*)::integer as total_penyewaan,
        coalesce(sum(total_biaya + denda_keterlambatan), 0)::integer as total_pemasukan
      from selesai
      group by nama_banjar
    ) rows
  ),
  tren as (
    select coalesce(jsonb_agg(row_to_json(rows) order by rows.bulan), '[]'::jsonb) as data
    from (
      select
        to_char(months.bulan, 'YYYY-MM') as bulan,
        coalesce(count(s.id), 0)::integer as total_penyewaan,
        coalesce(sum(s.total_biaya + s.denda_keterlambatan), 0)::integer as total_pemasukan
      from generate_series(
        date_trunc('month', current_date) - interval '5 months',
        date_trunc('month', current_date),
        interval '1 month'
      ) months(bulan)
      left join selesai s on date_trunc('month', s.tanggal_kembali_aktual) = months.bulan
      group by months.bulan
    ) rows
  )
  select jsonb_build_object(
    'kpi', (select data from kpi),
    'perAset', (select data from per_aset),
    'perBanjar', (select data from per_banjar),
    'tren', (select data from tren)
  );
$$;

revoke execute on function public.laporan_publik_ringkas() from public;
grant execute on function public.laporan_publik_ringkas() to anon, authenticated;
