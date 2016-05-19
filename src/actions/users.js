import {createAction} from 'redux-actions'
import api from '../api_client'

export const LOAD_USER = 'users.loadUser'
export const loadUser = ({id}) => {
  return {
    type: LOAD_USER,
    meta: {
      api: {
        body: {id}
      }
    }
  }
}
