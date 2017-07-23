import OAuth from 'oauth-1.0a';
import {
  DISCOGS_REQUEST_TOKEN_ENDPOINT,
  DISCOGS_ACCESS_TOKEN_ENDPOINT,
  DISCOGS_AUTORIZE_TOKEN_URL,
  DISCOGS_IDENTITY_ENDPOINT,
  DISCOGS_COLLECTION_ENDPOINT
} from './endpoints'

import {
  DISCOGS_CONSUMER_KEY,
  DISCOGS_CONSUMER_SECRET,
  DISCOGS_OAUTH_CALLBACK
} from '../config/settings'

export function requestToken() {
  const params = {
    oauth_consumer_key: DISCOGS_CONSUMER_KEY,
    oauth_signature: `${DISCOGS_CONSUMER_SECRET}%26`,
    oauth_nonce: Math.random().toString(),
    oauth_signature_method: 'PLAINTEXT',
    oauth_callback: DISCOGS_OAUTH_CALLBACK,
    oauth_timestamp: Date.now(),
  }

  const paramsKeys = Object.keys(params);
  let paramStr = '';

  for (let i = 0; i < paramsKeys.length; i++) {
    const key = paramsKeys[i]
    const param = params[key]
    paramStr = `${paramStr}${key}=${param}&`
  }

  return new Promise(function (resolve, reject) {
    fetch(
      `${DISCOGS_REQUEST_TOKEN_ENDPOINT}?${paramStr}`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    ).then((response) => (response.text())
    ).then((data) => {
      resolve(data)
    })
    // .catch((error) => console.log(error))
  });
}

export function generateDiscogsRequestTokenUrl (requestToken) {
  if (!requestToken)
    throw new Error('Request token needed!')

  return `${DISCOGS_AUTORIZE_TOKEN_URL}?oauth_token=${requestToken}`;
}

export function confirmConnect() {
  const params = {
    oauth_consumer_key: DISCOGS_CONSUMER_KEY,
    oauth_signature: `${DISCOGS_CONSUMER_SECRET}%26${localStorage.getItem('discogs_token_secret')}`,
    oauth_nonce: Math.random().toString(),
    oauth_signature_method: 'PLAINTEXT',
    oauth_timestamp: Date.now(),
  }

  const paramsKeys = Object.keys(params);
  let paramStr = `${window.location.search}&`;

  for (let i = 0; i < paramsKeys.length; i++) {
    const key = paramsKeys[i]
    const param = params[key]
    paramStr = `${paramStr}${key}=${param}&`
  }

  return new Promise(function (resolve, reject) {
    fetch(
      `${DISCOGS_ACCESS_TOKEN_ENDPOINT}${paramStr}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    ).then((response) => (response.text())
    ).then((data) => {
      resolve(data)
    })
    // .catch((error) => console.log(error))
  });
}

export function getUserInfo (token) {
  return new Promise(function (resolve, reject) {
    const oauth = OAuth({
      consumer: {
        key: DISCOGS_CONSUMER_KEY,
        secret: DISCOGS_CONSUMER_SECRET
      },
      signature_method: 'PLAINTEXT'
    });

    fetch(
      DISCOGS_IDENTITY_ENDPOINT.url, {
        headers: {...oauth.toHeader(oauth.authorize(DISCOGS_IDENTITY_ENDPOINT, token))}
      }
    ).then((response) => {
      return response.text()
    }).then((data) => {
      resolve(JSON.parse(data))
    })
    // .catch((error) => console.log(error))
  });
}

export function getUserCollection (username, token) {
  return new Promise(function (resolve, reject) {
    const oauth = OAuth({
      consumer: {
        key: DISCOGS_CONSUMER_KEY,
        secret: DISCOGS_CONSUMER_SECRET
      },
      signature_method: 'PLAINTEXT'
    });

    fetch(
      DISCOGS_COLLECTION_ENDPOINT(username).url, {
        headers: {...oauth.toHeader(oauth.authorize(DISCOGS_COLLECTION_ENDPOINT(username), token))}
      }
    ).then((response) => {
      return response.text()
    }).then((data) => {
      resolve(JSON.parse(data))
    })
    // .catch((error) => console.log(error))
  });
}
