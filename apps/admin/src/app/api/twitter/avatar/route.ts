import { NextRequest, NextResponse } from 'next/server'
import { getTwitterAccounts } from '@/lib/twitter-accounts'

// Per-account cache: accountId → { url, name, cachedAt }
const cache = new Map<string, { url: string; name: string; cachedAt: number }>()
const CACHE_MS = 60 * 60 * 1000

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const accountId = searchParams.get('accountId') ?? 'blueprint_os'

  // Determine the username to look up
  let username = 'blueprint_os'
  if (accountId !== 'blueprint_os') {
    const accounts = getTwitterAccounts()
    const account = accounts.find((a) => a.id === accountId)
    if (account) {
      username = account.username
    }
  } else {
    // Primary account: check env for configured username
    username = process.env.TWITTER_USERNAME ?? 'blueprint_os'
  }

  const cached = cache.get(accountId)
  if (cached && Date.now() - cached.cachedAt < CACHE_MS) {
    return NextResponse.json(cached)
  }

  try {
    const res = await fetch(
      `https://api.twitter.com/2/users/by/username/${username}?user.fields=profile_image_url,name`,
      { headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` } }
    )
    const data = await res.json() as { data?: { profile_image_url?: string; name?: string } }
    const url = data.data?.profile_image_url?.replace('_normal', '_bigger') ?? null
    const name = data.data?.name ?? username

    if (url) {
      const entry = { url, name, cachedAt: Date.now() }
      cache.set(accountId, entry)
      return NextResponse.json({ url, name })
    }
    return NextResponse.json({ url: null, name })
  } catch {
    return NextResponse.json({ url: null, name: username })
  }
}
