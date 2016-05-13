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

    const newLessons = action.payload.lessons || {}
    const lessons = {...state.lessons}
    for (let key of Object.keys(newLessons)) {
      const newLesson = newLessons[key]
      if (newLesson === undefined) {
        delete lessons[key]
      } else {
        lessons[key] = {...lessons[key], ...newLesson}
      }
    }

    const newState = {
      ...state,
      ...action.payload,
      lessons
    }

    return newState
  }
}, {
  active: true,
  connected: false,
  ready: false,
  readyUsers: [],
  online: {},
  lessons: {}
})
