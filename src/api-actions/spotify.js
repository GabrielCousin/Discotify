import logError from 'api-actions/sentry'
import request from 'request'
const queryString = require('query-string')

const SPOTIFY_BASE_URL = 'https://api.spotify.com'
const SPOTIFY_ACCOUNT_BASE_URL = 'https://accounts.spotify.com'
const SPOTIFY_REQUEST_AUTHORIZATION_ENDPOINT = new URL('/authorize', SPOTIFY_ACCOUNT_BASE_URL)
const SPOTIFY_CURRENT_PROFILE_ENDPOINT = new URL('/v1/me', SPOTIFY_BASE_URL)
const SPOTIFY_SEARCH_ENDPOINT = new URL('/v1/search', SPOTIFY_BASE_URL)
const SPOTIFY_SAVE_ALBUMS_ENDPOINT = new URL('/v1/me/albums', SPOTIFY_BASE_URL)

export function requestToken () {
  const params = {
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'token',
    redirect_uri: `${document.location.origin}/spotify_callback`,
    state: Math.random().toString(),
    scope: 'user-library-modify',
    show_dialog: true
  }

  window.location.assign(`${SPOTIFY_REQUEST_AUTHORIZATION_ENDPOINT}?${queryString.stringify(params)}`)
}

export function fetchUserInfo () {
  const token = localStorage.getItem('spotify_access_token')

  return new Promise(function (resolve, reject) {
    request.get({
      url: SPOTIFY_CURRENT_PROFILE_ENDPOINT
    }, function (e, r, body) {
      const data = JSON.parse(body)

      if (data && data.error) {
        reject(Error(`Spotify >> ${data.error.message}`))
        return
      }

      resolve({
        spotifyDisplayName: data.display_name,
        spotifyUserId: data.id
      })
    }).auth(null, null, true, token)
  })
}

export function searchAlbum (query) {
  const token = localStorage.getItem('spotify_access_token')

  return new Promise(function (resolve, reject) {
    request.get({
      url: SPOTIFY_SEARCH_ENDPOINT,
      qs: {
        q: encodeURIComponent(query),
        type: 'album',
        limit: 1
      },
      qsStringifyOptions: {
        encode: false
      }
    }, function (_error, res, body) {
      const data = JSON.parse(body)

      if (res.statusCode !== 200) {
        logError('Spotify >> search album failed', data.error.message)

        analytics.track('spotify:match_error', {
          query: query
        })

        resolve({})
        return
      }
      const results = data.albums.items
      resolve(
        results.length ? results[0] : {}
      )
    }).auth(null, null, true, token)
  })
}

export function saveAlbums (ids) {
  const token = localStorage.getItem('spotify_access_token')

  return new Promise(function (resolve, reject) {
    request.put({
      url: SPOTIFY_SAVE_ALBUMS_ENDPOINT,
      json: {
        ids
      }
    }, function (_error, res, body) {
      if (res.statusCode !== 200) {
        logError('Spotify >> save albums failed', body.error.message)
        analytics.track('spotify:export_error')
        reject(new Error(body.error.message))
      }

      resolve()
    }).auth(null, null, true, token)
  })
}
