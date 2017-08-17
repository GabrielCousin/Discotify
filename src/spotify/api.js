import {
  SPOTIFY_REQUEST_AUTHORIZATION_ENDPOINT,
  SPOTIFY_CURRENT_PROFILE_ENDPOINT,
  SPOTIFY_SEARCH_ENDPOINT,
  SPOTIFY_SAVE_ALBUMS_ENDPOINT
} from './endpoints'

import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_OAUTH_CALLBACK
} from '../config/settings'

import request from 'request'
const queryString = require('query-string');

export function generateRequestAuthorizationUrl() {
  const params = {
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'token',
    redirect_uri: SPOTIFY_OAUTH_CALLBACK,
    state: Math.random().toString(),
    scope: 'user-library-modify',
    show_dialog: true
  }

  return `${SPOTIFY_REQUEST_AUTHORIZATION_ENDPOINT}?${queryString.stringify(params)}`
}

export function getUserInfo (token) {
  return new Promise(function (resolve, reject) {
    request.get({
      url: SPOTIFY_CURRENT_PROFILE_ENDPOINT,
    }, function (e, r, body) {
      if (body && body.error) {
        reject(body.error)
      }

      resolve(JSON.parse(body))
    }).auth(null, null, true, token);
  });
}

export function searchAlbum (token, query) {
  return new Promise(function (resolve, reject) {
    request.get({
      url: SPOTIFY_SEARCH_ENDPOINT,
      qs: {
        q: encodeURIComponent(query),
        type: 'album',
        limit: 1
      },
    }, function (e, r, body) {
      if (body && body.error) {
        reject(body.error)
      }

      resolve(JSON.parse(body))
    }).auth(null, null, true, token);
  });
}

export function saveAlbums (token, ids) {
  return new Promise(function (resolve, reject) {
    request.put({
      url: SPOTIFY_SAVE_ALBUMS_ENDPOINT,
      json: {
        ids
      },
    }, function (e, r, body) {
      if (body && body.error) {
        reject(body.error)
      }

      resolve()
    }).auth(null, null, true, token);
  });
}
