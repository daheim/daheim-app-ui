import {handleActions} from 'redux-actions'

import {LOAD} from '../actions/profile'
import {SWITCH_ROLE} from '../actions/profile'

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

export default handleActions({
  [LOAD]: updateProfile,
  [SWITCH_ROLE]: updateProfile
}, {
  profile: undefined,
  loading: true
})
