import {createAction} from 'redux-actions'
import createApiAction from './createApiAction'
import api from '../api_client'

export const LOGIN = 'auth.login'
export const login = createApiAction(LOGIN)

export const REGISTER = 'auth/register'
export const register = createAction(REGISTER, async (payload) => {
  const result = await api.post('/register', payload)
  global.localStorage.accessToken = result.accessToken
})

export const FORGOT = 'auth.requestNewPassword'
export const forgot = createApiAction(FORGOT)

export const RESET = 'auth.resetPassword'
export const reset = createApiAction(RESET)
