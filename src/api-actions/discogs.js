import logError from 'api-actions/sentry'
import request from 'request'
const queryString = require('query-string')

const DISCOGS_BASE_URL = 'https://api.discogs.com'
const DISCOGS_REQUEST_TOKEN_ENDPOINT = new URL('/oauth/request_token', DISCOGS_BASE_URL)
const DISCOGS_ACCESS_TOKEN_ENDPOINT = new URL('/oauth/access_token', DISCOGS_BASE_URL)
const DISCOGS_IDENTITY_ENDPOINT = new URL('/oauth/identity', DISCOGS_BASE_URL)
const DISCOGS_AUTORIZE_TOKEN_URL = new URL('https://www.discogs.com/oauth/authorize')

function DISCOGS_COLLECTION_ENDPOINT (username) {
  if (!username) { throw new Error('Username needed!') }

  return new URL(`/users/${username}/collection/folders/0/releases`, DISCOGS_BASE_URL)
}

export function requestToken () {
  return request.get({
    url: DISCOGS_REQUEST_TOKEN_ENDPOINT,
    qs: {
      oauth_consumer_key: DISCOGS_CONSUMER_KEY,
      oauth_signature: `${DISCOGS_CONSUMER_SECRET}%26`,
      oauth_nonce: Math.random().toString(),
      oauth_signature_method: 'PLAINTEXT',
      oauth_callback: `${document.location.origin}/discogs_callback`,
      oauth_timestamp: Date.now()
    }
  }, function (_error, res, body) {
    if (body && body.match(/Invalid/)) {
      // logError('Discogs >> request token failed', JSON.stringify(body))
      throw new Error(body.error)
    }

    const data = queryString.parse(body)
    localStorage.setItem('discogs_token', data.oauth_token)
    localStorage.setItem('discogs_token_secret', data.oauth_token_secret)
    window.location.assign(`${DISCOGS_AUTORIZE_TOKEN_URL}?oauth_token=${data.oauth_token}`)
  })
}

export function confirmConnect () {
  const qs = queryString.parse(window.location.search)
  return new Promise(function (resolve) {
    request.post({
      url: DISCOGS_ACCESS_TOKEN_ENDPOINT,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      qs: Object.assign(qs, {
        oauth_consumer_key: DISCOGS_CONSUMER_KEY,
        oauth_signature: `${DISCOGS_CONSUMER_SECRET}%26${localStorage.getItem('discogs_token_secret')}`,
        oauth_nonce: Math.random().toString(),
        oauth_signature_method: 'PLAINTEXT',
        oauth_timestamp: Date.now()
      })
    }, function (_error, res, body) {
      if (body && body.match(/Invalid/)) {
        // logError('Discogs >> oauth confirm failed', JSON.stringify(body))
        throw new Error(body.error)
      }

      const data = queryString.parse(body)
      localStorage.setItem('discogs_token', data.oauth_token)
      localStorage.setItem('discogs_token_secret', data.oauth_token_secret)

      resolve(Object.assign(data, { discogsAuthDate: new Date().toJSON() }))
    })
  })
}

export function fetchUserInfo () {
  const token = localStorage.getItem('discogs_token')
  const tokenSecret = localStorage.getItem('discogs_token_secret')

  return new Promise(function (resolve, reject) {
    if (!token || !tokenSecret) {
      reject(new Error('Not connected'))
      return
    }

    request.get({
      url: DISCOGS_IDENTITY_ENDPOINT,
      oauth: {
        consumer_key: DISCOGS_CONSUMER_KEY,
        consumer_secret: DISCOGS_CONSUMER_SECRET,
        token,
        token_secret: tokenSecret,
        signature_method: 'PLAINTEXT'
      }
    }, function (e, res, body) {
      if (body && body.error) {
        reject(new Error(body.error))
        return
      }
      const { id, username } = JSON.parse(body)

      analytics.identify(id, {
        discogs_username: username
      })

      resolve({
        discogsUsername: username,
        discogsUserId: id
      })
    })
  })
}

export async function fetchAlbums (username) {
  const token = localStorage.getItem('discogs_token')
  const tokenSecret = localStorage.getItem('discogs_token_secret')
  const albums = []

  let url = DISCOGS_COLLECTION_ENDPOINT(username)

  while (url) {
    const releases = await new Promise(function (resolve, reject) {
      request.get({
        url,
        qs: {
          per_page: 100
        },
        oauth: {
          consumer_key: DISCOGS_CONSUMER_KEY,
          consumer_secret: DISCOGS_CONSUMER_SECRET,
          token,
          token_secret: tokenSecret,
          signature_method: 'PLAINTEXT'
        }
      }, function (_error, res, body) {
        const data = JSON.parse(body)

        if (data && data.message) {
          url = null
          logError('Discogs album fetch failed', data.message)
          reject(data.message)
          return
        }

        url = data.pagination.urls.next
        resolve(data.releases)
      })
    })
    albums.push(...releases)
  }

  return albums
}
