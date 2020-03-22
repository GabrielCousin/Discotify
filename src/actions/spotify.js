import logger from 'services/logger'

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
  SPOTIFY_EXPORT_ITEM_SUCCESS,
  SPOTIFY_MAX_ALBUMS_PER_SAVE_CHUNK
} from '../dicts/spotify'

import request from 'request'
const queryString = require('query-string')

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

export function confirmConnect () {
  return dispatch => {
    dispatch({
      type: SPOTIFY_OAUTH_CONFIRM_SUCCESS
    })
  }
}

export function fetchUserInfo () {
  const token = localStorage.getItem('spotify_access_token')

  return dispatch => {
    dispatch({
      type: SPOTIFY_FETCH_USER_INFO
    })

    request.get({
      url: SPOTIFY_CURRENT_PROFILE_ENDPOINT
    }, function (e, r, body) {
      const data = JSON.parse(body)

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
    }).auth(null, null, true, token)
  }
}

export function searchAlbum (index, { query }) {
  const token = localStorage.getItem('spotify_access_token')

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
    }, function (_error, res, body) {
      const data = JSON.parse(body)

      if (res.statusCode !== 200) {
        logger('Spotify >> search album failed', data.error.message)

        analytics.track('spotify:match_error', {
          query: query
        })

        return dispatch({
          type: SPOTIFY_SEARCH_ALBUM_FAIL,
          data: { index, query }
        })
      }

      dispatch({
        type: SPOTIFY_SEARCH_ALBUM_SUCCESS,
        data: { index, query, results: data.albums.items }
      })
    }).auth(null, null, true, token)
  }
}

export function completeMatch () {
  return dispatch => {
    dispatch({
      type: SPOTIFY_MATCHING_SUCCESS
    })
  }
}

export function startExport () {
  return dispatch => {
    dispatch({
      type: SPOTIFY_EXPORT_STARTED
    })
  }
}

export function completeExport () {
  return dispatch => {
    dispatch({
      type: SPOTIFY_EXPORT_SUCCESS
    })
  }
}

export function saveAlbums (ids) {
  const token = localStorage.getItem('spotify_access_token')

  return dispatch => {
    dispatch({
      type: SPOTIFY_EXPORT_ITEM
    })

    request.put({
      url: SPOTIFY_SAVE_ALBUMS_ENDPOINT,
      json: {
        ids
      }
    }, function (_error, res, body) {
      if (res.statusCode !== 200) {
        logger('Spotify >> save albums failed', body.error.message)

        analytics.track('spotify:export_error')

        // return dispatch({
        //   type: SPOTIFY_EXPORT_ITEM_FAIL
        // })
      }

      dispatch({
        type: SPOTIFY_EXPORT_ITEM_SUCCESS
      })
    }).auth(null, null, true, token)
  }
}

export function splitIdsInSteps (ids) {
  const total = Math.ceil(ids.length / SPOTIFY_MAX_ALBUMS_PER_SAVE_CHUNK)
  const steps = new Array(total)

  for (let i = 0; i < total; i++) {
    const end = i + 1 === total ? ids.length : (i + 1) * SPOTIFY_MAX_ALBUMS_PER_SAVE_CHUNK
    steps[i] = ids.slice(i * SPOTIFY_MAX_ALBUMS_PER_SAVE_CHUNK, end)
  }

  return dispatch => {
    dispatch({
      type: SPOTIFY_EXPORT_STARTED,
      steps
    })
  }
}
