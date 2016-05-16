import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import CircularProgress from 'material-ui/CircularProgress'
import Toggle from 'material-ui/Toggle'

import {ready as setReady} from '../../actions/live'
import style from './ReadySwitch.style'

class Connecting extends Component {
  static propTypes = {
    error: PropTypes.string
  }

  render () {
    const {error} = this.props

    return (
      <div style={{display: 'flex', alignItems: 'center'}}>
        <div style={{margin: 20}}><CircularProgress /></div>
        <div style={{margin: 8}}>
          <div className={style.connecting}>Connecting to Daheim network. Please wait a few moments...</div>
          {error ? (
            <div className={style.error}>Fehler: {error}</div>
          ) : null}
        </div>
      </div>
    )
  }
}

class ReadySwitch extends Component {

  static propTypes = {
    ready: PropTypes.bool,
    connected: PropTypes.bool,
    setReady: PropTypes.func.isRequired
  }

  handleReadyChange = (e) => {
    this.props.setReady({ready: e.target.checked})
  }

  render () {
    const {ready, connected} = this.props

    if (!connected) return <Connecting {...this.props} />

    return (
      <div style={{display: 'flex', alignItems: 'center'}}>
        <div style={{margin: 20}}><Toggle toggled={ready} onToggle={this.handleReadyChange} /></div>
        <div style={{margin: 8, color: this.props.ready ? 'darkgreen' : 'darkred'}}>{this.props.ready ? 'You are ready' : 'You are not ready'}</div>
      </div>
    )
  }
}

export default connect((state, props) => {
  const {live: {connected, ready, error}} = state
  return {connected, ready, error}
}, {setReady})(ReadySwitch)
