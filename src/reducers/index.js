import {combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'

import messages from './messages'
import reviews from './reviews'
import profile from './profile'
import users from './users'
import {liveReducer} from '../live'

export default combineReducers({
  messages,
  reviews,
  profile,
  users,
  live: liveReducer,
  routing: routerReducer
})
