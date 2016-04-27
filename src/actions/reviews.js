import {createAction} from 'redux-actions'
import api from '../api_client'

export const LOAD = 'reviews/load'
export const load = createAction(LOAD, () => {
  return api.get('/encounters')
})
