import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import CircularProgress from 'material-ui/CircularProgress'
import TextField from 'material-ui/TextField'
import PowerSettingsNew from 'material-ui/svg-icons/action/power-settings-new'

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
    setReady: PropTypes.func.isRequired,
    readyTopic: PropTypes.string
  }

  state = {
    topic: this.props.readyTopic || ''
  }

  handleReadyChange = async (e) => {
    try {
      await this.props.setReady({ready: e.target.checked, topic: this.state.topic})
    } catch (err) {
      alert(err.message)
    }
  }

  handleTopicChange = (e) => {
    this.setState({topic: e.target.value})
  }

  goOnline = async () => {
    if (!this.state.topic) this.setState({topic: 'keine Theme'})

    try {
      await this.props.setReady({ready: true, topic: this.state.topic || 'keine Theme'})
    } catch (err) {
      alert(err.message)
    }
  }

  goOffline = async () => {
    try {
      await this.props.setReady({ready: false})
    } catch (err) {
      alert(err.message)
    }
  }

  render () {
    const {ready, connected} = this.props
    const {topic} = this.state

    if (!connected) return <Connecting {...this.props} />

    if (!ready) {
      return (
        <div style={{display: 'flex', alignItems: 'center', margin: 20}}>
          <PowerSettingsNew color='#a51515' hoverColor='crimson' style={{cursor: 'pointer', width: 128, height: 128}} onClick={this.goOnline} />
          <div style={{flex: '1 1 auto', marginLeft: 20}}>
            <div style={{fontFamily: 'Lato, sans-serif'}}><b>Du bist noch nicht bereit.</b> Bitte wähle eine theme und klicke die rote Taste!</div>
            <TextField value={topic} hintText='Theme' onChange={this.handleTopicChange} />
          </div>
        </div>
      )
    } else {
      return (
        <div style={{display: 'flex', alignItems: 'center', margin: 20}}>
          <PowerSettingsNew color='forestgreen' hoverColor='olivedrab' style={{cursor: 'pointer', width: 128, height: 128}} onClick={this.goOffline} />
          <div style={{flex: '1 1 auto', marginLeft: 20}}>
            <div style={{fontFamily: 'Lato, sans-serif', lineHeight: '150%'}}><b>Du bist bereit.</b> Deine Theme Heute ist: <i>{topic}</i></div>
            <div style={{fontFamily: 'Lato, sans-serif', lineHeight: '150%'}}>Gleich kannst du mit einem/er Sprachcoach/In sprechen.</div>
            <div style={{fontFamily: 'Lato, sans-serif', lineHeight: '150%'}}>Bitte warte auf diese Seite.</div>
          </div>
        </div>
      )
    }
  }
}

export default connect((state, props) => {
  const {live: {connected, ready, error, readyTopic}} = state
  return {connected, ready, error, readyTopic}
}, {setReady})(ReadySwitch)
