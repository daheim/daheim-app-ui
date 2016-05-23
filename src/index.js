import './bootstrap'

import React from 'react'
import ReactDOM from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { Provider } from 'react-redux'

import createRouter from './router'
import muiTheme from './theme'
import createStore from './store'
import api from './api_client'
import reporter from './reporter'

import './default.css'
import './effects.css'
import './dhm_profile_camera.css'

import { browserHistory } from 'react-router'
import withScroll from 'scroll-behavior'
import { syncHistoryWithStore } from 'react-router-redux'

import moment from 'moment'

moment.locale('de') // TODO: find a better place to init

class App extends React.Component {

  static childContextTypes = {
    muiTheme: React.PropTypes.object
  }

  static propTypes = {
    history: React.PropTypes.object.isRequired,
    store: React.PropTypes.object.isRequired
  }

  getChildContext () {
    return { muiTheme }
  }

  router = createRouter(this.props.history)

  render () {
    return <Provider store={this.props.store}>{this.router}</Provider>
  }
}

function main () {
  const store = createStore(browserHistory, api, window.__data)
  const history = syncHistoryWithStore(withScroll(browserHistory), store)

  injectTapEventPlugin()
  reporter.watchStore(store)

  const dest = document.getElementById('content')
  ReactDOM.render(<App store={store} history={history} />, dest)
}

main()
