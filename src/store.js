import { createStore, compose } from 'redux'
import reducers from './reducers'
import createMiddleware from './middlewares'

export default function createStoreFn (history) {
  const devtools = window.devToolsExtension ? window.devToolsExtension() : (f) => f
  const middlewares = createMiddleware(history)
  const store = createStore(reducers, compose(middlewares, devtools))
  return store
}
