import React, {PropTypes} from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'
import Toggle from 'material-ui/Toggle'

import ReviewList from '../components/ReviewList'
import TalkAbout from '../components/TalkAbout'
import ReadyUsers from '../components/ReadyUsers'
import {connect as liveConnect, ready as liveReady} from '../actions/live'

class ReadyPage extends React.Component {

  static propTypes = {
    push: PropTypes.func.isRequired,
    liveConnect: PropTypes.func.isRequired,
    liveReady: PropTypes.func.isRequired,
    user: PropTypes.object,
    online: PropTypes.object,
    ready: PropTypes.bool,
    connected: PropTypes.bool
  }

  handleReadyClick = (e) => {
    e.preventDefault()
    this.props.push('/video')
  }

  componentDidMount () {
    this.props.liveConnect()
  }

  handleReadyChange = (e) => {
    this.props.liveReady({ready: e.target.checked})
  }

  render () {
    const {user: {profile: {role} = {}} = {}} = this.props
    const {teachers = 0, students = 0} = this.props.online

    return (
      <div style={{padding: 16}}>

        {role === 'student' ? (
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div style={{margin: 20}}><Toggle toggled={this.props.ready} onToggle={this.handleReadyChange} /></div>
            <div style={{margin: 8, color: this.props.ready ? 'darkgreen' : 'darkred'}}>{this.props.ready ? 'You are ready' : 'You are not ready'}</div>
          </div>
        ) : undefined}

        <div>{this.props.connected ? 'connected' : 'not connected'}</div>
        <div>Online teachers: {teachers} | Online students: {students}</div>

        <div style={{textAlign: 'center'}}>
          <div style={{display: 'inline-block', margin: '20px auto'}}>
            <RaisedButton primary label='Start a Lesson' onClick={this.handleReadyClick}/>
          </div>
        </div>
        <div>
          <ReadyUsers />
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1000, width: '100%', margin: '0 auto'}}>
          <ReviewList style={{flex: '0 1 600px', margin: '0 8px'}} />
        </div>
        <TalkAbout />
      </div>
    )
  }
}

export default connect((state, props) => {
  const {live: {connected, ready, online}, profile: {profile: user}} = state
  return {connected, ready, online, user}
}, {push, liveConnect, liveReady})(ReadyPage)
