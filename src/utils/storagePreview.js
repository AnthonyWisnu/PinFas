import { supabase } from '../lib/supabase'

const SIGNED_URL_TTL_SECONDS = 60 * 60
const SIGNED_URL_REUSE_MS = 55 * 60 * 1000
const signedUrlCache = new Map()
const imagePreloadCache = new Map()

function cacheKey(bucket, path) {
  return `${bucket}:${path}`
}

export async function getCachedSignedUrl(bucket, path) {
  if (!path || path.startsWith('http')) return path

  const key = cacheKey(bucket, path)
  const cached = signedUrlCache.get(key)

  if (cached && cached.expiresAt > Date.now()) {
    return cached.url
  }

  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, SIGNED_URL_TTL_SECONDS)
  const url = error ? path : data?.signedUrl

  if (url) {
    signedUrlCache.set(key, { url, expiresAt: Date.now() + SIGNED_URL_REUSE_MS })
  }

  return url
}

export function preloadImage(url) {
  if (!url || typeof window === 'undefined') return Promise.resolve(false)
  if (imagePreloadCache.has(url)) return imagePreloadCache.get(url)

  const promise = new Promise((resolve) => {
    const image = new Image()

    image.decoding = 'async'
    image.onload = () => resolve(true)
    image.onerror = () => resolve(false)
    image.src = url

    if (image.complete && image.naturalWidth > 0) resolve(true)
  })

  imagePreloadCache.set(url, promise)
  return promise
}
