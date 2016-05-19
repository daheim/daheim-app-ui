import {handleActions} from 'redux-actions'

import {LOAD_USER} from '../actions/users'

export default handleActions({
  [LOAD_USER]: (state, action) => {
    console.log('reducer', action)
    const {id} = action.meta.api.body

    return {
      ...state,
      users: {
        ...state.users,
        ...action.payload.users
      },
      usersMeta: {
        ...state.usersMeta,
        [id]: {loaded: Date.now()}
      }
    }
  },

  [LOAD_USER + '!error']: (state, action) => {
    const {id} = action.meta.api.body
    return {
      ...state,
      usersMeta: {
        ...state.usersMeta,
        [id]: {error: action.payload.message}
      }
    }
  },

  [LOAD_USER + '!start']: (state, action) => {
    const {id} = action.meta.api.body
    return {
      ...state,
      usersMeta: {
        ...state.usersMeta,
        [id]: {loading: true}
      }
    }
  }
}, {
  users: {},
  usersMeta: {}
})
