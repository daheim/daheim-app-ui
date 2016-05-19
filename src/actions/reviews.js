import {createAction} from 'redux-actions'
import api from '../api_client'

export const LOAD = 'reviews/load'
export const load = createAction(LOAD, () => {
  return api.get('/encounters')
})

export const SEND_REVIEW = 'review.sendReview'
export const sendReview = (body) => {
  return {
    type: SEND_REVIEW,
    meta: {
      api: {body}
    }
  }
}
