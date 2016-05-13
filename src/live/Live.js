import io from 'socket.io-client'
import {push} from 'react-router-redux'

import api from '../api_client'
import {setState} from '../actions/live'
import LessonClient from './LessonClient'
const debug = require('debug')('dhm:live:Live')

class Connection {

  async start (configureSocket) {
    try {
      const data = await api.post('/realtimeToken')
      if (this.closed) return
      const accessToken = data.token
      const socket = this.socket = io(window.__INIT.SIO_URL, {
        reconnection: false,
        multiplex: false,
        transports: ['websocket'],
        query: {
          'access_token': accessToken
        }
      }) // TODO: configure URL
      configureSocket(socket)

      socket.on('connect', () => {
        if (this.closed) return
        this.onConnect()
      })
      for (let event of ['disconnect', 'error', 'connect_error', 'connect_timeout', 'reconnect_error', 'reconnect_failed']) {
        socket.on(event, (...args) => {
          if (this.closed) return
          debug('sio connect error. event: %s', ...args)
          this.close()
        })
      }
    } catch (err) {
      debug('sio connect error', err)
      this.close()
    }
  }

  close () {
    if (this.closed) return
    this.closed = true

    if (this.socket) {
      this.socket.close()
      for (let id of Object.keys(this.socket.acks)) {
        this.socket.onack({id, data: [{error: 'disconnected'}]})
      }
    }

    this.onClose()
  }
}

export default class Live {

  static instances = {}

  constructor (store) {
    this.store = store
  }

  lessonClients = {}

  get state () { return this.store.getState().live }
  dispatchState (...args) { return this.store.dispatch(setState(...args)) }

  connect () {
    if (this.connection) this.connection.close()
    const connection = this.connection = new Connection()
    connection.onConnect = () => {
      if (this.connection !== connection) return
      this.socket = connection.socket
      this.dispatchState({connected: true})
      delete this.connectionBackoff
    }
    connection.onClose = () => {
      if (this.connection !== connection) return
      delete this.socket
      this.dispatchState({connected: false})

      this.connectionBackoff = Math.floor(Math.min((this.connectionBackoff || 1000) * (1 + Math.random()), 60000))
      debug('sio reconnecting in %s ms', this.connectionBackoff)
      setTimeout(() => this.connect(), this.connectionBackoff)
    }
    connection.start((socket) => this.configureSocket(socket))
  }

  configureSocket(socket) {
    socket.on('online', (online) => this.dispatchState({online}))
    socket.on('readyUsers', (users) => this.dispatchState({readyUsers: users}))

    socket.on('Lesson.onUpdated', (newLessons) => {
      const lessons = {...this.state.lessons}
      Object.keys(lessons).forEach((id) => { lessons[id]._deleted = true })
      Object.keys(newLessons).forEach((id) => {
        lessons[id] = Object.assign(lessons[id] || {}, newLessons[id])
        delete lessons[id]._deleted
      })
      Object.keys(lessons).forEach((id) => {
        if (!lessons[id]._deleted) return
        delete lessons[id]
        if (this.lessonClients[id]) {
          this.lessonClients[id].close()
          delete this.lessonClients[id]
        }
      })
      this.dispatchState({lessons})
    })

    socket.on('lesson.onConnectionChanged', (req) => {
      const {id, connected} = req
      const lesson = this.state.lessons[id]
      const lessons = {
        ...this.state.lessons,
        [id]: {
          ...lesson,
          participating: true,
          connected
        }
      }
      this.dispatchState({lessons})
      this.store.dispatch(push(`/lessons/${lesson.id}`))

      if (!this.lessonClients[id]) {
        const lessonClient = new LessonClient(this, id)
        this.lessonClients[id] = lessonClient
      }
      this.lessonClients[id].handleConnectionChange(req)
    })
    socket.on('lesson.relay', ({id, data}, cb) => {
      const lessonClient = this.lessonClients[id]
      if (!lessonClient) return cb({error: 'no client side lesson found'})
      lessonClient.handleRelay(data, cb)
    })

    socket.on('lesson.onRemoved', (req) => {
      const {id} = req

      if (this.lessonClients[id]) {
        this.lessonClients[id].close()
        delete this.lessonClients[id]
      }

      const lesson = this.state.lessons[id]
      const lessons = {
        ...this.state.lessons,
        [id]: {
          ...lesson,
          participating: false,
          connected: false
        }
      }
      this.dispatchState({lessons})
    })

    socket.on('lesson.onClose', (req) => {
      const {id} = req

      if (this.lessonClients[id]) {
        this.lessonClients[id].close()
        delete this.lessonClients[id]
      }

      const lesson = this.state.lessons[id]
      const lessons = {
        ...this.state.lessons,
        [id]: {
          ...lesson,
          closed: true
        }
      }
      this.dispatchState({lessons})
    })
  }

  replayState () {
    const {ready} = this.state
    if (ready) this.ready({ready})
  }

  ready ({ready}) {
    if (!this.socket) throw new Error('live not active')

    this.dispatchState({ready})
    this.socket.emit('ready', {ready}, (res) => {
      console.warn('handle ready response', res) // TODO: handle result
    })
  }

  async startLesson ({userId}) {
    if (!this.socket) throw new Error('live not active')
    return new Promise((resolve) => {
      this.socket.emit('Lesson.create', {userId}, (res) => {
        resolve(res)

        const {id} = res
        const lesson = this.state.lessons[id]
        const lessons = {
          ...this.state.lessons,
          [id]: {
            ...lesson,
            id,
            state: 'inviting',
            participating: true
          }
        }
        this.dispatchState({lessons})
      })
    })
  }

  async join ({id}) {
    if (!this.socket) throw new Error('live not active')
    const lesson = this.state.lessons[id]
    if (!lesson) return console.warn('lesson not found in state', id)
    return new Promise((resolve) => {
      this.socket.emit('lesson.join', {id}, (res) => {
        resolve(res)

        const lesson = this.state.lessons[id]
        const lessons = {
          ...this.state.lessons,
          [lesson.id]: {
            ...lesson,
            state: 'accepted'
          }
        }
        this.dispatchState({lessons})
      })
    })
  }

  async leave ({id}) {
    if (!this.socket) throw new Error('live not active')
    return new Promise((resolve) => {
      this.socket.emit('lesson.leave', {id}, (res) => {
        resolve(res)
      })
    })
  }

  async leaveIfNotStarted ({id}) {
    const lesson = this.state.lessons[id]
    if (!lesson || !lesson.connected) { // TODO: should check for lesson.active
      return this.leave({id})
    }
  }

  async relay ({id, connectionId, data}) {
    if (!this.socket) throw new Error('live not active')
    return new Promise((resolve, reject) => {
      this.socket.emit('lesson.relay', {id, connectionId, data}, (res) => {
        if ((res || {}).error) return reject(res) // TODO: ugly
        resolve(res)
      })
    })
  }
}
