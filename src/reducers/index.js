import {combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'

import messages from './messages'
import reviews from './reviews'
import {liveReducer} from '../live'

export default combineReducers({
  messages,
  reviews,
  live: liveReducer,
  routing: routerReducer
})
