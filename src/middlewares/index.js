import {applyMiddleware} from 'redux'
import thunkMw from 'redux-thunk'
import promiseMw from './promise'
import {routerMiddleware} from 'react-router-redux'
import {liveMiddleware} from '../live'

export default function createMiddleware (history) {
  return applyMiddleware(promiseMw, thunkMw, routerMiddleware(history), liveMiddleware)
}
