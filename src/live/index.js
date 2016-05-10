import {handleActions} from 'redux-actions'

import Live from './Live'
import {
  SET_STATE,
  CALL_METHOD
} from '../actions/live'

export const liveMiddleware = (store) => (next) => {
  const live = new Live(store)
  return (action) => {
    if (action.type !== CALL_METHOD) return next(action)
    const {payload: {method, args}} = action
    return live[method](...args)
  }
}

export const liveReducer = handleActions({
  [SET_STATE]: (state, action) => {
    return {
      ...state,
      ...action.payload
    }
  }
}, {
  active: true,
  connected: false,
  ready: false,
  readyUsers: [],
  online: {},
  lessons: {}
})
