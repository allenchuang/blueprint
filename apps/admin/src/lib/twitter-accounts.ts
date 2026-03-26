export interface TwitterAccount {
  id: string;
  name: string;
  handle: string;
  accessToken: string;
  accessTokenSecret: string;
}

/**
 * Returns the list of configured Twitter accounts from environment variables.
 * Additional accounts can be added via TWITTER_ACCOUNTS_JSON env var as a JSON array.
 */
export function getTwitterAccounts(): TwitterAccount[] {
  const json = process.env.TWITTER_ACCOUNTS_JSON;
  if (!json) return [];
  try {
    return JSON.parse(json) as TwitterAccount[];
  } catch {
    console.error("[twitter-accounts] Failed to parse TWITTER_ACCOUNTS_JSON");
    return [];
  }
}
