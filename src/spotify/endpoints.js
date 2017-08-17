const SPOTIFY_BASE_URL = 'https://api.spotify.com'
const SPOTIFY_ACCOUNT_BASE_URL = 'https://accounts.spotify.com'

export const SPOTIFY_REQUEST_AUTHORIZATION_ENDPOINT = new URL('/authorize', SPOTIFY_ACCOUNT_BASE_URL)
export const SPOTIFY_REQUEST_TOKEN_ENDPOINT = new URL('/api/token', SPOTIFY_ACCOUNT_BASE_URL)

export const SPOTIFY_CURRENT_PROFILE_ENDPOINT = new URL('/v1/me', SPOTIFY_BASE_URL)
export const SPOTIFY_SEARCH_ENDPOINT = new URL('/v1/search', SPOTIFY_BASE_URL)
export const SPOTIFY_SAVE_ALBUMS_ENDPOINT = new URL('/v1/me/albums', SPOTIFY_BASE_URL)
