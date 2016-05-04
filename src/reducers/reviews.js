import {handleActions} from 'redux-actions'

import {LOAD} from '../actions/reviews'

export default handleActions({
  [LOAD]: (state, action) => {
    if (action.error) return state
    if (!action.payload) {
      return {
        ...state,
        loading: true
      }
    }
    const reviews = action.payload
    return {
      ...state,
      loading: false,
      reviews
    }
  }
}, {
  reviews: [],
  loading: false
})
