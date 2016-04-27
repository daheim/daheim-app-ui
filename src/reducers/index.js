import {combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'

import messages from './messages'
import reviews from './reviews'

export default combineReducers({
  messages,
  reviews,
  routing: routerReducer
})
