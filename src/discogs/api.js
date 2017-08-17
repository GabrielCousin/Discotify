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

import request from 'request'
const queryString = require('query-string');

export function requestToken() {
  return new Promise(function (resolve, reject) {
    request.get({
      url: DISCOGS_REQUEST_TOKEN_ENDPOINT,
      qs: {
        oauth_consumer_key: DISCOGS_CONSUMER_KEY,
        oauth_signature: `${DISCOGS_CONSUMER_SECRET}%26`,
        oauth_nonce: Math.random().toString(),
        oauth_signature_method: 'PLAINTEXT',
        oauth_callback: DISCOGS_OAUTH_CALLBACK,
        oauth_timestamp: Date.now()
      }
    }, function (e, r, body) {
      if (body && body.error) {
        reject(body.error)
      }
      resolve(queryString.parse(body))
    });
  });
}

export function generateDiscogsRequestTokenUrl (requestToken) {
  if (!requestToken)
    throw new Error('Request token needed!')

  return `${DISCOGS_AUTORIZE_TOKEN_URL}?oauth_token=${requestToken}`;
}

export function confirmConnect() {
  const qs = queryString.parse(window.location.search)
  return new Promise(function (resolve, reject) {
    request.post({
      url: DISCOGS_ACCESS_TOKEN_ENDPOINT,
      qs: Object.assign(qs, {
        oauth_consumer_key: DISCOGS_CONSUMER_KEY,
        oauth_signature: `${DISCOGS_CONSUMER_SECRET}%26${localStorage.getItem('discogs_token_secret')}`,
        oauth_nonce: Math.random().toString(),
        oauth_signature_method: 'PLAINTEXT',
        oauth_timestamp: Date.now(),
      })
    }, function (e, r, body) {
      if (body && body.error) {
        reject(body.error)
      }
      resolve(queryString.parse(body))
    });
  });
}

export function getUserInfo ({token, token_secret}) {
  return new Promise(function (resolve, reject) {
    request.get({
      url: DISCOGS_IDENTITY_ENDPOINT,
      oauth: {
        consumer_key: DISCOGS_CONSUMER_KEY,
        consumer_secret: DISCOGS_CONSUMER_SECRET,
        token,
        token_secret,
        signature_method : 'PLAINTEXT'
      }
    }, function (e, r, body) {
      if (body && body.error) {
        reject(body.error)
      }
      resolve(JSON.parse(body))
    })
  });
}

export function getUserCollection (username, {token, token_secret}) {
  return new Promise(function (resolve, reject) {
    request.get({
      url: DISCOGS_COLLECTION_ENDPOINT(username),
      oauth: {
        consumer_key: DISCOGS_CONSUMER_KEY,
        consumer_secret: DISCOGS_CONSUMER_SECRET,
        token,
        token_secret,
        signature_method : 'PLAINTEXT'
      }
    }, function (e, r, body) {
      if (body && body.error) {
        reject(body.error)
      }
      resolve(JSON.parse(body).releases)
    })
  });
}
