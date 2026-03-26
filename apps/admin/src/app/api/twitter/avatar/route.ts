import { NextResponse } from 'next/server'

let cache: { url: string; name: string; cachedAt: number } | null = null
const CACHE_MS = 60 * 60 * 1000

export async function GET() {
  if (cache && Date.now() - cache.cachedAt < CACHE_MS) {
    return NextResponse.json(cache)
  }
  try {
    const res = await fetch(
      'https://api.twitter.com/2/users/by/username/blueprint_os?user.fields=profile_image_url,name',
      { headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` } }
    )
    const data = await res.json() as { data?: { profile_image_url?: string; name?: string } }
    const url = data.data?.profile_image_url?.replace('_normal', '_bigger') ?? null
    const name = data.data?.name ?? 'Blueprint OS'
    if (url) {
      cache = { url, name, cachedAt: Date.now() }
      return NextResponse.json({ url, name })
    }
    return NextResponse.json({ url: null, name })
  } catch {
    return NextResponse.json({ url: null, name: 'Blueprint OS' })
  }
}
