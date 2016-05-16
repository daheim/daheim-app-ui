import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import CircularProgress from 'material-ui/CircularProgress'
import Toggle from 'material-ui/Toggle'

import {ready as setReady} from '../../actions/live'
import style from './ReadySwitch.style'

class Connecting extends Component {
  render () {
    return (
      <div style={{display: 'flex', alignItems: 'center'}}>
        <div style={{margin: 20}}><CircularProgress /></div>
        <div className={style.connecting} style={{margin: 8}}>Connecting to Daheim network. Please wait a few moments...</div>
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
  const {live: {connected, ready}} = state
  return {connected, ready}
}, {setReady})(ReadySwitch)
