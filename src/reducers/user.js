import {
  DISCOGS_FETCH_USER_INFO_SUCCESS,
  DISCOGS_OAUTH_CONFIRM_SUCCESS
} from '../dicts/discogs'

const user = (state = {}, action) => {
  switch (action.type) {
    case DISCOGS_FETCH_USER_INFO_SUCCESS:
      return Object.assign({}, state, {
        discogs_username: action.data.username,
        discogs_id: action.data.id
      })

    case DISCOGS_OAUTH_CONFIRM_SUCCESS:
      return Object.assign({}, state, {
        discogs_auth_date: new Date().toJSON()
      })

    default:
      return state
  }
}

export default user
