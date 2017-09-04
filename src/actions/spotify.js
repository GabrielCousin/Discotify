import {
  SPOTIFY_REQUEST_AUTHORIZATION_ENDPOINT,
  SPOTIFY_CURRENT_PROFILE_ENDPOINT,
  SPOTIFY_SEARCH_ENDPOINT,
  SPOTIFY_SAVE_ALBUMS_ENDPOINT,
  SPOTIFY_OAUTH_CONFIRM_SUCCESS,
  SPOTIFY_FETCH_USER_INFO,
  SPOTIFY_FETCH_USER_INFO_FAIL,
  SPOTIFY_FETCH_USER_INFO_SUCCESS,
  SPOTIFY_SEARCH_ALBUM,
  SPOTIFY_SEARCH_ALBUM_FAIL,
  SPOTIFY_SEARCH_ALBUM_SUCCESS
} from '../dicts/spotify'

import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_OAUTH_CALLBACK
} from '../config/settings'

import request from 'request'
const queryString = require('query-string');

export function requestToken() {
  const params = {
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'token',
    redirect_uri: SPOTIFY_OAUTH_CALLBACK,
    state: Math.random().toString(),
    scope: 'user-library-modify',
    show_dialog: true
  }

  window.location.assign(`${SPOTIFY_REQUEST_AUTHORIZATION_ENDPOINT}?${queryString.stringify(params)}`)
}

export function confirmConnect() {
  return dispatch => {
    dispatch({
      type: SPOTIFY_OAUTH_CONFIRM_SUCCESS
    })
  }
}

export function fetchUserInfo () {
  const token = localStorage.getItem('spotify_access_token');

  return dispatch => {
    dispatch({
      type: SPOTIFY_FETCH_USER_INFO
    })

    request.get({
      url: SPOTIFY_CURRENT_PROFILE_ENDPOINT,
    }, function (e, r, body) {
      if (body && body.error) {
        return dispatch({
          type: SPOTIFY_FETCH_USER_INFO_FAIL,
          data: body.console.error
        })
      }

      dispatch({
        type: SPOTIFY_FETCH_USER_INFO_SUCCESS,
        data: JSON.parse(body)
      })
    }).auth(null, null, true, token);
  }
}

export function searchAlbum (index, { query }) {
  const token = localStorage.getItem('spotify_access_token');

  return dispatch => {
    dispatch({
      type: SPOTIFY_SEARCH_ALBUM,
      data: { index }
    })

    request.get({
      url: SPOTIFY_SEARCH_ENDPOINT,
      qs: {
        q: query,
        type: 'album',
        limit: 1
      },
      qsStringifyOptions: {
        encode: false
      }
    }, function (e, r, body) {
      if (body && body.error) {
        dispatch({
          type: SPOTIFY_SEARCH_ALBUM_FAIL,
          data: { index }
        })
      }

      dispatch({
        type: SPOTIFY_SEARCH_ALBUM_SUCCESS,
        data: { index, results: JSON.parse(body).albums.items }
      })
    }).auth(null, null, true, token);
  }
}

// export function saveAlbums (token, ids) {
//   return new Promise(function (resolve, reject) {
//     request.put({
//       url: SPOTIFY_SAVE_ALBUMS_ENDPOINT,
//       json: {
//         ids
//       },
//     }, function (e, r, body) {
//       if (body && body.error) {
//         reject(body.error)
//       }
//
//       resolve()
//     }).auth(null, null, true, token);
//   });
// }
