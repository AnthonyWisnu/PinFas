export function WargaDashboardCard({ profile, stats }) {
  const items = [
    { label: 'Total Pengajuan', value: stats.total },
    { label: 'Menunggu', value: stats.menunggu },
    { label: 'Disetujui', value: stats.disetujui },
    { label: 'Selesai', value: stats.selesai },
  ]

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">Profil Warga</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-primary">{profile.nama}</h2>
          <p className="mt-2 font-mono text-sm text-slate-600">{profile.nik}</p>
          <p className="text-sm text-slate-600">{profile.nomorHp} · {profile.banjarAsal}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className="rounded-xl bg-surface p-4 text-center">
              <p className="font-display text-2xl font-black text-primary">{item.value}</p>
              <p className="mt-1 text-xs text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
