export interface TwitterAccount {
  id: string;
  username: string;
  displayName: string;
  accessToken: string;        // from env
  accessTokenSecret: string;  // from env
}

// Reads from env vars — server side only
export function getTwitterAccounts(): TwitterAccount[] {
  const accounts: TwitterAccount[] = [];

  // Primary account
  if (process.env.TWITTER_ACCESS_TOKEN) {
    accounts.push({
      id: 'blueprint_os',
      username: process.env.TWITTER_USERNAME ?? 'blueprint_os',
      displayName: 'Blueprint OS',
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET ?? '',
    });
  }

  // Additional accounts (TWITTER_ACCOUNT_2_USERNAME, TWITTER_ACCOUNT_2_ACCESS_TOKEN, etc.)
  let i = 2;
  while (process.env[`TWITTER_ACCOUNT_${i}_ACCESS_TOKEN`]) {
    accounts.push({
      id: `account_${i}`,
      username: process.env[`TWITTER_ACCOUNT_${i}_USERNAME`] ?? `account_${i}`,
      displayName: process.env[`TWITTER_ACCOUNT_${i}_DISPLAY_NAME`] ?? `Account ${i}`,
      accessToken: process.env[`TWITTER_ACCOUNT_${i}_ACCESS_TOKEN`]!,
      accessTokenSecret: process.env[`TWITTER_ACCOUNT_${i}_ACCESS_TOKEN_SECRET`] ?? '',
    });
    i++;
  }

  return accounts;
}
