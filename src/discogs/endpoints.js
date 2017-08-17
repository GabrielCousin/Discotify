const DISCOGS_BASE_URL = 'https://api.discogs.com'

export const DISCOGS_REQUEST_TOKEN_ENDPOINT = new URL('/oauth/request_token', DISCOGS_BASE_URL)
export const DISCOGS_ACCESS_TOKEN_ENDPOINT = new URL('/oauth/access_token', DISCOGS_BASE_URL)
export const DISCOGS_IDENTITY_ENDPOINT = new URL('/oauth/identity', DISCOGS_BASE_URL)
export const DISCOGS_AUTORIZE_TOKEN_URL = new URL('https://www.discogs.com/oauth/authorize')

export function DISCOGS_COLLECTION_ENDPOINT (username) {
  if (!username)
    throw new Error('Username needed!')

  return new URL(`/users/${username}/collection/folders/0/releases`, DISCOGS_BASE_URL)
}
