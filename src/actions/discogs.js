import {
  DISCOGS_REQUEST_TOKEN_ENDPOINT,
  DISCOGS_ACCESS_TOKEN_ENDPOINT,
  DISCOGS_AUTORIZE_TOKEN_URL,
  DISCOGS_IDENTITY_ENDPOINT,
  DISCOGS_COLLECTION_ENDPOINT,
  DISCOGS_REQUEST_TOKEN_FAIL,
  DISCOGS_OAUTH_CONFIRM,
  DISCOGS_OAUTH_CONFIRM_SUCCESS,
  DISCOGS_OAUTH_CONFIRM_FAIL,
  DISCOGS_FETCH_ALBUMS,
  DISCOGS_FETCH_ALBUMS_SUCCESS,
  DISCOGS_FETCH_ALBUMS_FAIL,
  DISCOGS_FETCH_USER_INFO,
  DISCOGS_FETCH_USER_INFO_SUCCESS,
  DISCOGS_FETCH_USER_INFO_FAIL
} from '../dicts/discogs'

import { APP_STATUS_ALBUMS_FETCHED } from '../dicts/app'

import {
  DISCOGS_CONSUMER_KEY,
  DISCOGS_CONSUMER_SECRET,
  DISCOGS_OAUTH_CALLBACK
} from '../config/settings'

import request from 'request'
const queryString = require('query-string');

export function requestToken () {
  return dispatch => {
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
      if (body && body.match(/Invalid/)) {
        return dispatch({
          type: DISCOGS_REQUEST_TOKEN_FAIL,
          error: body.error
        })
      }

      const data = queryString.parse(body)
      localStorage.setItem('discogs_token', data.oauth_token)
      localStorage.setItem('discogs_token_secret', data.oauth_token_secret)
      window.location.assign(`${DISCOGS_AUTORIZE_TOKEN_URL}?oauth_token=${data.oauth_token}`)
    });
  }
}

export function confirmConnect () {
  const qs = queryString.parse(window.location.search)
  return dispatch => {
    dispatch({
      type: DISCOGS_OAUTH_CONFIRM
    })

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
        oauth_timestamp: Date.now(),
      })
    }, function (e, r, body) {
      if (body && body.match(/Invalid/)) {
        return dispatch({
          type: DISCOGS_OAUTH_CONFIRM_FAIL,
          data: body.error
        })
      }

      const data = queryString.parse(body)
      localStorage.setItem('discogs_token', data.oauth_token)
      localStorage.setItem('discogs_token_secret', data.oauth_token_secret)

      return dispatch({
        type: DISCOGS_OAUTH_CONFIRM_SUCCESS,
        data
      })
    });
  };
}

export function fetchDiscogsAlbums (username, url) {
  const token = localStorage.getItem('discogs_token')
  const token_secret = localStorage.getItem('discogs_token_secret')

  return dispatch => {
    dispatch({
      type: DISCOGS_FETCH_ALBUMS,
    })

    request.get({
      url: url ? url : DISCOGS_COLLECTION_ENDPOINT(username),
      qs: {
        per_page: 100
      },
      oauth: {
        consumer_key: DISCOGS_CONSUMER_KEY,
        consumer_secret: DISCOGS_CONSUMER_SECRET,
        token,
        token_secret,
        signature_method : 'PLAINTEXT'
      }
    }, function (e, r, body) {
      if (body && body.error) {
        return dispatch({
          type: DISCOGS_FETCH_ALBUMS_FAIL,
          error: body.error
        })
      }

      const data = JSON.parse(body);
      const nextUrl = data.pagination.urls.next;

      dispatch({
        type: DISCOGS_FETCH_ALBUMS_SUCCESS,
        data: data.releases
      })

      return dispatch(nextUrl ? fetchDiscogsAlbums(null, nextUrl) : { type: APP_STATUS_ALBUMS_FETCHED })
    })

  }
}

export function fetchUserInfo () {
  const token = localStorage.getItem('discogs_token')
  const token_secret = localStorage.getItem('discogs_token_secret')

  return dispatch => {
    dispatch({
      type: DISCOGS_FETCH_USER_INFO,
    })

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
        return dispatch({
          type: DISCOGS_FETCH_USER_INFO_FAIL,
          error: body.error
        })
      }

      return dispatch({
        type: DISCOGS_FETCH_USER_INFO_SUCCESS,
        data: JSON.parse(body)
      })
    })
  }
}
