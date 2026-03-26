import { getTwitterAccounts } from '@/lib/twitter-accounts'

export async function GET() {
  const accounts = getTwitterAccounts().map(({ id, username, displayName }) => ({
    id,
    username,
    displayName,
  }))
  return Response.json(accounts)
}
