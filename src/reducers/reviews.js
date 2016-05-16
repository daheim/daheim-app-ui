import {handleActions} from 'redux-actions'

import {LOAD} from '../actions/reviews'

export default handleActions({
  [LOAD]: (state, action) => {
    if (action.error) return {...state, loading: false, error: action.payload.message}
    if (!action.payload) {
      return {
        ...state,
        loading: true,
        error: null
      }
    }
    const reviews = action.payload
    return {
      ...state,
      loading: false,
      error: null,
      reviews
    }
  }
}, {
  reviews: [],
  loading: false,
  error: null
})
