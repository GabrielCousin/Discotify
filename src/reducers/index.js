import { combineReducers } from 'redux'
import albums from './albums'
import user from './user'

const reducers = combineReducers({
  albums,
  user
})

export default reducers
