import io from 'socket.io-client'
import {push} from 'react-router-redux'

import api from '../api_client'
import {setState} from '../actions/live'
import LessonClient from './LessonClient'

export default class Live {

  static instances = {}

  constructor (store) {
    this.store = store
  }

  lessonClients = {}

  get state () { return this.store.getState().live }
  dispatchState (...args) { return this.store.dispatch(setState(...args)) }

  connect () {
    if (this.socket) return

    this.dispatchState({active: true})
    const socket = this.socket = io(window.__INIT.SIO_URL, {multiplex: false, transports: ['websocket']}) // TODO: configure URL
    socket.on('connect', async () => {
      try {
        const data = await api.post('/realtimeToken')
        this.socket.emit('auth', {token: data.token}, (data) => console.warn('handle auth result', data))
        this.dispatchState({connected: true})
        this.replayState()
      } catch (err) {
        // TODO: handle auth error
        console.error(err.stack)
      }
    })
    socket.on('disconnect', () => {
      // TODO: check reconnect logic
      this.dispatchState({connected: false})
    })

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
    if (!this.socket) return

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
    if (!this.socket) return
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
    if (!this.socket) return
    return new Promise((resolve, reject) => {
      this.socket.emit('lesson.relay', {id, connectionId, data}, (res) => {
        if ((res || {}).error) return reject(res) // TODO: ugly
        resolve(res)
      })
    })
  }
}
