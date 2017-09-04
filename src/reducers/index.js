import { combineReducers } from 'redux'
import app from './app'
import albums from './albums'
import user from './user'

const reducers = combineReducers({
  app,
  albums,
  user
})

export default reducers
