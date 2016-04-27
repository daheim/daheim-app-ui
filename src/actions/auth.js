import {createAction} from 'redux-actions'
import api from '../api_client'

export const LOGIN = 'auth/login'
export const login = createAction(LOGIN, async (payload) => {
  const result = await api.post('/login', payload)
  global.localStorage.accessToken = result.accessToken
})

export const REGISTER = 'auth/register'
export const register = createAction(REGISTER, async (payload) => {
  const result = await api.post('/register', payload)
  global.localStorage.accessToken = result.accessToken
})

export const FORGOT = 'auth/forgot'
export const forgot = createAction(FORGOT, (payload) => {
  return api.post('/forgot', payload)
})

console.warn('bearer token in auth/reset')
export const RESET = 'auth/reset'
export const reset = createAction(RESET, (payload) => {
  return api.post('/reset', payload)
})
