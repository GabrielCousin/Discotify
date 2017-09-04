import {
  APP_STATUS_ALBUMS_FETCHED
} from '../dicts/app'

import {
  SPOTIFY_SEARCH_ALBUM,
  SPOTIFY_SEARCH_ALBUM_SUCCESS
} from '../dicts/spotify'

const app = (state = {}, action) => {
  switch (action.type) {
    case APP_STATUS_ALBUMS_FETCHED:
    case SPOTIFY_SEARCH_ALBUM_SUCCESS:
      return Object.assign({}, state, {
        release_matching_ready: true
      })

    case SPOTIFY_SEARCH_ALBUM:
      return Object.assign({}, state, {
        release_matching_ready: false
      })

    default:
      return state
  }
}

export default app
