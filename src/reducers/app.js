import {
  APP_STATUS_ALBUMS_FETCHED
} from '../dicts/app'

import {
  SPOTIFY_SEARCH_ALBUM,
  SPOTIFY_SEARCH_ALBUM_FAIL,
  SPOTIFY_SEARCH_ALBUM_SUCCESS,
  SPOTIFY_MATCHING_SUCCESS,
  SPOTIFY_EXPORT_STARTED,
  SPOTIFY_EXPORT_SUCCESS,
  SPOTIFY_EXPORT_ITEM,
  SPOTIFY_EXPORT_ITEM_SUCCESS
} from '../dicts/spotify'

const app = (state = {}, action) => {
  switch (action.type) {
    case APP_STATUS_ALBUMS_FETCHED:
    case SPOTIFY_SEARCH_ALBUM_SUCCESS:
    case SPOTIFY_SEARCH_ALBUM_FAIL:
      return Object.assign({}, state, {
        release_matching_ready: true
      })

    case SPOTIFY_SEARCH_ALBUM:
      return Object.assign({}, state, {
        release_process_ongoing: true,
        release_matching_ready: false
      })

    case SPOTIFY_MATCHING_SUCCESS:
      return Object.assign({}, state, {
        release_process_ongoing: false,
        release_matching_done: true
      })

    case SPOTIFY_EXPORT_STARTED:
      return Object.assign({}, state, {
        release_process_ongoing: true,
        release_export_ready: true,
        export_steps: action.steps
      })

    case SPOTIFY_EXPORT_ITEM_SUCCESS: {
      return Object.assign({}, state, {
        release_export_ready: true
      })
    }

    case SPOTIFY_EXPORT_ITEM: {
      return Object.assign({}, state, {
        release_export_ready: false
      })
    }

    case SPOTIFY_EXPORT_SUCCESS:
      return Object.assign({}, state, {
        release_process_ongoing: false,
        release_export_done: true
      })

    default:
      return state
  }
}

export default app
