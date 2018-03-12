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
  SPOTIFY_SEARCH_ALBUM_SUCCESS,
  SPOTIFY_MATCHING_SUCCESS,
  SPOTIFY_EXPORT_STARTED,
  SPOTIFY_EXPORT_SUCCESS,
  SPOTIFY_EXPORT_ITEM,
  // SPOTIFY_EXPORT_ITEM_FAIL,
  SPOTIFY_EXPORT_ITEM_SUCCESS
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
      const data = JSON.parse(body);

      if (data && data.error) {
        return dispatch({
          type: SPOTIFY_FETCH_USER_INFO_FAIL,
          data: data.error
        })
      }

      dispatch({
        type: SPOTIFY_FETCH_USER_INFO_SUCCESS,
        data
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
        q: encodeURIComponent(query),
        type: 'album',
        limit: 1
      },
      qsStringifyOptions: {
        encode: false
      }
    }, function (e, r, body) {
      const data = JSON.parse(body)
      const res = r.toJSON()

      if (res.statusCode !== 200) {
        return dispatch({
          type: SPOTIFY_SEARCH_ALBUM_FAIL,
          data: { index }
        })
      }

      dispatch({
        type: SPOTIFY_SEARCH_ALBUM_SUCCESS,
        data: { index, results: data.albums.items }
      })
    }).auth(null, null, true, token);
  }
}

export function completeMatch() {
  return dispatch => {
    dispatch({
      type: SPOTIFY_MATCHING_SUCCESS
    })
  }
}

export function startExport() {
  return dispatch => {
    dispatch({
      type: SPOTIFY_EXPORT_STARTED
    })
  }
}

export function completeExport() {
  return dispatch => {
    dispatch({
      type: SPOTIFY_EXPORT_SUCCESS
    })
  }
}

export function saveAlbums (ids) {
  const token = localStorage.getItem('spotify_access_token');

  return dispatch => {
    dispatch({
      type: SPOTIFY_EXPORT_ITEM,
    })

    request.put({
      url: SPOTIFY_SAVE_ALBUMS_ENDPOINT,
      json: {
        ids
      },
    }, function (/* e, r, body */) {
      // const res = r.toJSON()
      //
      // if (data && data.error) {
      //   return dispatch({
      //     type: SPOTIFY_EXPORT_ITEM_FAIL
      //   })
      // }

      dispatch({
        type: SPOTIFY_EXPORT_ITEM_SUCCESS
      })
    }).auth(null, null, true, token);
  }
}

export function splitIdsInSteps (ids) {
  const total = Math.ceil(ids.length / 50);
  let steps = new Array(total);

  for (let i = 0; i < total; i++) {
    const end = i + 1 === total ? ids.length : (i + 1) * 50;
    steps[i] = ids.slice(i * 50, end);
  }

  return dispatch => {
    dispatch({
      type: SPOTIFY_EXPORT_STARTED,
      steps
    })
  }
}
