const DISCOGS_BASE_URL = 'https://api.discogs.com'

export const DISCOGS_REQUEST_TOKEN_ENDPOINT = new URL('/oauth/request_token', DISCOGS_BASE_URL)
export const DISCOGS_ACCESS_TOKEN_ENDPOINT = new URL('/oauth/access_token', DISCOGS_BASE_URL)
export const DISCOGS_AUTORIZE_TOKEN_URL = new URL('https://www.discogs.com/oauth/authorize')

export const DISCOGS_IDENTITY_ENDPOINT = {
  url: 'https://api.discogs.com/oauth/identity',
  method: 'GET'
}

export function DISCOGS_COLLECTION_ENDPOINT (username) {
  if (!username)
    throw new Error('Username needed!')

  return {
    url: new URL(`/users/${username}/collection/folders/0/releases`, DISCOGS_BASE_URL).href,
    method: 'GET'
  }
}
