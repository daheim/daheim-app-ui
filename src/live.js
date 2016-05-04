import io from 'socket.io-client'

import {handleActions} from 'redux-actions'
import {SET_STATE, CALL_METHOD} from './actions/live'
import {setState} from './actions/live'
import api from './api_client'

import {createAction} from 'redux-actions'

export default class Live {

  static instances = {}

  constructor (store) {
    this.store = store
    //this.subscribeToken = store.subscribe(() => this.handleStoreChange())
    //this.props = store.getState().live
    //this.handlePropsUpdated()
  }

  get state () {
    return this.store.getState().live
  }

  dispatchState (...args) {
    return this.store.dispatch(setState(...args))
  }

  connect () {
    if (this.socket) return

    this.dispatchState({active: true})
    const socket = this.socket = io('http://localhost:3000/', {multiplex: false})
    socket.on('online', (online) => {
      this.dispatchState({online})
    })
    socket.on('readyUsers', (users) => {
      this.dispatchState({readyUsers: users})
    })
    socket.on('connect', async () => {
      try {
        const data = await api.post('/realtimeToken')
        console.log(data)
        this.socket.emit('auth', {token: data.token}, (data) => console.log('auth', data))
        this.dispatchState({connected: true})
        this.replayState()
      } catch (err) {
        // TODO: handle auth error
        console.error(err.stack)
      }
    })
    socket.on('disconnect', () => {
      console.log('disconnected')
      // TODO: check reconnect
      this.dispatchState({connected: false})
    })
  }

  replayState () {
    const {ready} = this.state
    if (ready) this.ready({ready})
  }

  ready ({ready}) {
    if (!this.socket) return

    this.dispatchState({ready})
    this.socket.emit('ready', {ready}, (res) => {
      console.log('ready response', res)
    })
  }
}

export const liveMiddleware = (store) => (next) => {
  const live = new Live(store)
  return (action) => {
    if (action.type !== CALL_METHOD) return next(action)
    const {payload: {method, args}} = action
    return live[method](...args)
  }
}

export const liveReducer = handleActions({
  [SET_STATE]: (state, action) => {
    return {
      ...state,
      ...action.payload
    }
  }
}, {
  active: true,
  connected: false,
  ready: false,
  readyUsers: [],
  online: {}
})
