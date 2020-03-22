import {
  DISCOGS_FETCH_USER_INFO_SUCCESS,
  DISCOGS_OAUTH_CONFIRM_SUCCESS
} from '../dicts/discogs'

import {
  SPOTIFY_OAUTH_CONFIRM_SUCCESS,
  SPOTIFY_FETCH_USER_INFO_SUCCESS
} from '../dicts/spotify'

const user = (state = {}, action) => {
  switch (action.type) {
    case DISCOGS_FETCH_USER_INFO_SUCCESS:
      analytics.identify(action.data.id, {
        discogs_username: action.data.username
      })

      return Object.assign({}, state, {
        discogs_username: action.data.username,
        discogs_id: action.data.id
      })

    case SPOTIFY_FETCH_USER_INFO_SUCCESS:
      return Object.assign({}, state, {
        spotify_display_name: action.data.display_name,
        spotify_id: action.data.id
      })

    case DISCOGS_OAUTH_CONFIRM_SUCCESS:
      return Object.assign({}, state, {
        discogs_auth_date: new Date().toJSON()
      })

    case SPOTIFY_OAUTH_CONFIRM_SUCCESS:
      return Object.assign({}, state, {
        spotify_auth_date: new Date().toJSON()
      })

    default:
      return state
  }
}

export default user
