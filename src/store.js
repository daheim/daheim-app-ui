import { createStore, compose } from 'redux'
import reducers from './reducers'
import createMiddleware from './middlewares'

export default function createStoreFn (history, state) {
  const devtools = window.devToolsExtension ? window.devToolsExtension() : (f) => f
  const middlewares = createMiddleware(history)
  const store = createStore(reducers, state, compose(middlewares, devtools))
  return store
}
