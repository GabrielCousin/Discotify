const DISCOGS_BASE_URL = 'https://api.discogs.com'

export const DISCOGS_REQUEST_TOKEN_ENDPOINT = new URL('/oauth/request_token', DISCOGS_BASE_URL);
export const DISCOGS_ACCESS_TOKEN_ENDPOINT = new URL('/oauth/access_token', DISCOGS_BASE_URL);

export function generateDiscogsRequestTokenUrl (requestToken) {
  if (!requestToken)
    throw new Error('Request token needed!')

  const DISCOGS_AUTORIZE_TOKEN_URL = new URL('https://www.discogs.com/oauth/authorize');

  return `${DISCOGS_AUTORIZE_TOKEN_URL}?oauth_token=${requestToken}`;
}
