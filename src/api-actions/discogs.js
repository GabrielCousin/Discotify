import logError from 'api-actions/sentry'

const DISCOGS_BASE_URL = 'https://api.discogs.com'
const DISCOGS_AUTORIZE_TOKEN_URL = new URL('https://www.discogs.com/oauth/authorize')

function DISCOGS_COLLECTION_ENDPOINT (username) {
  // https://www.discogs.com/developers#page:user-collection,header:user-collection-collection-items-by-folder

  if (!username) { throw new Error('Username needed!') }

  return new URL(`/users/${username}/collection/folders/0/releases`, DISCOGS_BASE_URL)
}

export async function requestToken () {
  // https://www.discogs.com/developers#page:authentication,header:authentication-oauth-flow

  const url = new URL('/oauth/request_token', DISCOGS_BASE_URL)
  const params = {
    oauth_consumer_key: DISCOGS_CONSUMER_KEY,
    oauth_signature: `${DISCOGS_CONSUMER_SECRET}%26`,
    oauth_nonce: Math.random().toString(),
    oauth_signature_method: 'PLAINTEXT',
    oauth_callback: `${document.location.origin}/discogs_callback`,
    oauth_timestamp: Date.now()
  }

  for (const key in params) {
    url.searchParams.append(key, params[key])
  }

  const req = await fetch(url)
  const res = await req.text()

  if (req.status !== 200) {
    const error = JSON.parse(res)
    throw new Error(error.message)
  }

  const data = new URLSearchParams(res)
  const token = data.get('oauth_token')
  const secret = data.get('oauth_token_secret')

  localStorage.setItem('discogs_token', token)
  localStorage.setItem('discogs_token_secret', secret)
  window.location.assign(`${DISCOGS_AUTORIZE_TOKEN_URL}?oauth_token=${token}`)
}

export async function confirmConnect () {
  // https://www.discogs.com/developers#page:authentication,header:authentication-access-token-url

  const url = new URL('/oauth/access_token', DISCOGS_BASE_URL)

  const params = {
    oauth_consumer_key: DISCOGS_CONSUMER_KEY,
    oauth_signature: `${DISCOGS_CONSUMER_SECRET}%26${localStorage.getItem('discogs_token_secret')}`,
    oauth_nonce: Math.random().toString(),
    oauth_signature_method: 'PLAINTEXT',
    oauth_timestamp: Date.now()
  }

  for(const key in params) {
    url.searchParams.append(key, params[key])
  }

  const searchParams = new URLSearchParams(window.location.search)

  for(const pair of searchParams.entries()) {
    const [key, value] = pair
    url.searchParams.append(key, value)
  }

  const req = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  const res = await req.text()

  if (req.status !== 200) {
    const error = JSON.parse(res)
    throw new Error(error.message)
  }

  const data = new URLSearchParams(res)
  const token = data.get('oauth_token')
  const secret = data.get('oauth_token_secret')

  localStorage.setItem('discogs_token', token)
  localStorage.setItem('discogs_token_secret', secret)

  return {
    discogsAuthDate: new Date().toJSON()
  }
}

export async function fetchUserInfo () {
  // https://www.discogs.com/developers#page:user-identity,header:user-identity-identity

  const token = localStorage.getItem('discogs_token')
  const tokenSecret = localStorage.getItem('discogs_token_secret')

  if (!token || !tokenSecret) {
    throw new Error('Not connected')
  }

  const url = new URL('/oauth/identity', DISCOGS_BASE_URL)

  const oauth = [
    `OAuth oauth_consumer_key="${DISCOGS_CONSUMER_KEY}"`,
    `oauth_nonce="${Math.random().toString()}"`,
    `oauth_signature="${DISCOGS_CONSUMER_SECRET}%26${tokenSecret}"`,
    `oauth_signature_method="PLAINTEXT"`,
    `oauth_timestamp="${Date.now()}"`,
    `oauth_token="${token}"`,
    `oauth_version="1.0"`
  ]

  const req = await fetch(url.toString(), {
    headers: {
      Authorization: oauth.join(',')
    }
  })

  const res = await req.json()

  if (req.status !== 200) {
    const error = JSON.parse(res)
    throw new Error(error.message)
  }

  const { id, username } = res

  analytics.identify(id, {
    discogs_username: username
  })

  return {
    discogsUsername: username,
    discogsUserId: id
  }
}

export async function fetchAlbums (username) {
  // https://www.discogs.com/developers#page:user-collection,header:user-collection-collection-items-by-folder

  const token = localStorage.getItem('discogs_token')
  const tokenSecret = localStorage.getItem('discogs_token_secret')
  const albums = []

  const oauth = [
    `OAuth oauth_consumer_key="${DISCOGS_CONSUMER_KEY}"`,
    `oauth_nonce="${Math.random().toString()}"`,
    `oauth_signature="${DISCOGS_CONSUMER_SECRET}%26${tokenSecret}"`,
    `oauth_signature_method="PLAINTEXT"`,
    `oauth_timestamp="${Date.now()}"`,
    `oauth_token="${token}"`,
    `oauth_version="1.0"`
  ]

  let url = DISCOGS_COLLECTION_ENDPOINT(username)

  while (url) {
    url.searchParams.append('per_page', 100)
    const req = await fetch(url.toString(), {
      headers: {
        Authorization: oauth.join(',')
      }
    })

    const res = await req.json()

    if (req.status !== 200) {
      url = null
      logError('Discogs album fetch failed', res.message)
      throw new Error(res.message)
    }

    url = res.pagination.urls.next
    albums.push(...res.releases)
  }

  return albums
}
