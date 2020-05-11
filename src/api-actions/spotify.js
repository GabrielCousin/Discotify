import logError from 'api-actions/sentry'

const SPOTIFY_BASE_URL = 'https://api.spotify.com'
const SPOTIFY_ACCOUNT_BASE_URL = 'https://accounts.spotify.com'

export function requestToken () {
  // https://developer.spotify.com/documentation/general/guides/authorization-guide/

  const newUrl = new URL('/authorize', SPOTIFY_ACCOUNT_BASE_URL)

  const params = {
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'token',
    redirect_uri: `${document.location.origin}/spotify_callback`,
    state: Math.random().toString(),
    scope: 'user-library-modify',
    show_dialog: true
  }

  for (const key in params) {
    newUrl.searchParams.append(key, params[key])
  }

  window.location.assign(newUrl.toString())
}

export async function fetchUserInfo () {
  // https://developer.spotify.com/documentation/web-api/reference-beta/#endpoint-get-current-users-profile

  const token = localStorage.getItem('spotify_access_token')

  const req = await fetch(new URL('/v1/me', SPOTIFY_BASE_URL), {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const res = await req.json()

  if (req.status !== 200) {
    throw new Error(`Spotify >> ${res.error.message}`)
  }

  return {
    spotifyDisplayName: res.display_name,
    spotifyUserId: res.id
  }
}

export async function searchAlbum (query) {
  // https://developer.spotify.com/documentation/web-api/reference-beta/#category-search

  const token = localStorage.getItem('spotify_access_token')
  const url = new URL('/v1/search', SPOTIFY_BASE_URL)
  url.searchParams.append('q', query)
  url.searchParams.append('type', 'album')
  url.searchParams.append('limit', 1)

  const req = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const res = await req.json()

  if (req.status !== 200) {
    logError('Spotify >> search album failed', res.error.message)

    analytics.track('spotify:match_error', {
      query
    })

    return {}
  }

  const results = res.albums.items
  return results.length ? results[0] : {}
}

export async function saveAlbums (ids) {
  // https://developer.spotify.com/documentation/web-api/reference-beta/#endpoint-save-albums-user

  const token = localStorage.getItem('spotify_access_token')

  const req = await fetch(new URL('/v1/me/albums', SPOTIFY_BASE_URL), {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(ids)
  })

  if (req.status !== 200) {
    logError('Spotify >> save albums failed')
    analytics.track('spotify:export_error')
    throw new Error('Export failed')
  }
}
