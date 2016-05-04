import React from 'react'
import ReactDOM from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { Provider } from 'react-redux'

import createRouter from './router'
import muiTheme from './theme'
import createStore from './store'

import './default.css'
import './effects.css'
import './dhm_profile_camera.css'

// import { loadPlaces } from './actions/places'
// import { loadTrips } from './actions/trips'
// import { loadUsers, loadUser } from './actions/users'
import {loadProfile} from './actions/profile'

import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

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
  const store = createStore(browserHistory)
  const history = syncHistoryWithStore(browserHistory, store)

  injectTapEventPlugin()

  const dest = document.getElementById('content')
  ReactDOM.render(<App store={store} history={history} />, dest)

  // store.dispatch(loadPlaces())
  // store.dispatch(loadTrips())
  // store.dispatch(loadUsers())
  // store.dispatch(loadUser())
  store.dispatch(loadProfile())
}

main()
