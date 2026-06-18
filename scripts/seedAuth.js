import { readFileSync, existsSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

function loadLocalEnv() {
  for (const fileName of ['.env.local', '.env']) {
    if (!existsSync(fileName)) continue

    const lines = readFileSync(fileName, 'utf8').split(/\r?\n/)
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue

      const [key, ...valueParts] = trimmed.split('=')
      if (!process.env[key]) {
        process.env[key] = valueParts.join('=').replace(/^["']|["']$/g, '')
      }
    }
  }
}

loadLocalEnv()

const supabaseUrl = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib diisi.')
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const banjarAccounts = [
  ['kaja', 'Banjar Kaja'],
  ['kelod', 'Banjar Kelod'],
  ['kangin', 'Banjar Kangin'],
  ['kauh', 'Banjar Kauh'],
].map(([slug, banjarNama]) => ({
  email: `kelian.${slug}@pinfas.id`,
  password: `Pinfas${slug[0].toUpperCase()}${slug.slice(1)}2026`,
  nama: `Kelian ${banjarNama}`,
  jabatan: `Kelian ${banjarNama}`,
  role: 'kelian_banjar',
  banjarNama,
}))

const adminAccounts = [
  ...banjarAccounts,
  {
    email: 'admin.desa@pinfas.id',
    password: 'PinfasDesa2026',
    nama: 'Admin Desa',
    jabatan: 'Admin Desa',
    role: 'admin_desa',
    banjarNama: null,
  },
  {
    email: 'lurah@pinfas.id',
    password: 'PinfasLurah2026',
    nama: 'Lurah',
    jabatan: 'Lurah',
    role: 'lurah',
    banjarNama: null,
  },
]

async function findUserByEmail(email) {
  const { data, error } = await supabase.auth.admin.listUsers()
  if (error) throw error

  return data.users.find((user) => user.email === email) ?? null
}

async function upsertAdminProfile(account, authId) {
  let banjarId = null

  if (account.banjarNama) {
    const { data, error } = await supabase
      .from('banjar')
      .select('id')
      .eq('nama', account.banjarNama)
      .single()

    if (error) throw error
    banjarId = data.id
  }

  const payload = {
    auth_id: authId,
    email: account.email,
    nama: account.nama,
    jabatan: account.jabatan,
    role: account.role,
    banjar_id: banjarId,
    is_active: true,
  }

  const { data: existingByEmail, error: readError } = await supabase
    .from('user_admin')
    .select('id')
    .eq('email', account.email)
    .maybeSingle()

  if (readError) throw readError

  const { error } = existingByEmail
    ? await supabase.from('user_admin').update(payload).eq('id', existingByEmail.id)
    : await supabase.from('user_admin').upsert(payload, { onConflict: 'auth_id' })

  if (error) throw error
}

async function seedAuth() {
  for (const account of adminAccounts) {
    let user = await findUserByEmail(account.email)

    if (!user) {
      const { data, error } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
      })

      if (error) throw error
      user = data.user
    } else {
      const { error } = await supabase.auth.admin.updateUserById(user.id, {
        password: account.password,
        email_confirm: true,
      })

      if (error) throw error
    }

    await upsertAdminProfile(account, user.id)
  }
}

seedAuth()
  .then(() => {
    console.log('Seed akun admin selesai.')
  })
  .catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
