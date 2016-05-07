import {handleActions} from 'redux-actions'

import {
  LOAD,
  SWITCH_ROLE,
  SAVE
} from '../actions/profile'

function updateProfile (state, action) {
  if (action.error) return state
  if (!action.payload) return state
  const profile = action.payload
  return {
    ...state,
    loading: false,
    profile
  }
}

function updateProfile2 (state, action) {
  if (action.error) return state
  if (!action.payload) return state
  const payload = action.payload
  return {
    ...state,
    loading: false,
    profile: payload.user
  }
}

export default handleActions({
  [LOAD]: updateProfile,
  [SWITCH_ROLE]: updateProfile,
  [SAVE]: updateProfile2
}, {
  profile: undefined,
  loading: true
})
