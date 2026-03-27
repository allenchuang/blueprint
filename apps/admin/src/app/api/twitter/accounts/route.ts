import { getTwitterAccounts } from '@/lib/twitter-accounts'

export async function GET() {
  const accounts = getTwitterAccounts().map(({ id, handle, name }) => ({
    id,
    username: handle,
    displayName: name,
  }))
  return Response.json(accounts)
}
