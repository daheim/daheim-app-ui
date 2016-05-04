import {createAction} from 'redux-actions'

export const SET_STATE = 'live/setState'
export const setState = createAction(SET_STATE)

export const SET_ACTIVE = 'live/setActive'
export const setActive = createAction(SET_ACTIVE)

export const CALL_METHOD = 'live/callMethod'
export const callMethod = createAction(CALL_METHOD)

export const connect = createAction(CALL_METHOD, (...args) => {
  return {
    method: 'connect',
    args
  }
})

export const ready = createAction(CALL_METHOD, (...args) => {
  return {
    method: 'ready',
    args
  }
})
