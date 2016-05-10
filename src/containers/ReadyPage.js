import React, {PropTypes} from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'
import Toggle from 'material-ui/Toggle'

import ReviewList from '../components/ReviewList'
import TalkAbout from '../components/TalkAbout'
import ReadyUsers from '../components/ReadyUsers'
import {ready as liveReady, join} from '../actions/live'
import WebRTC from 'webrtc-adapter'

class InvitationsRaw extends React.Component {

  static propTypes = {
    join: PropTypes.func.isRequired,
    lessons: PropTypes.object.isRequired
  }

  handleClick = (e, lesson) => {
    e.preventDefault()
    this.props.join(lesson)
  }

  render () {
    const {lessons} = this.props
    return (
      <div>
        {Object.keys(lessons).map((id) => {
          const lesson = lessons[id]
          const handler = (e) => this.handleClick(e, lesson)
          return (
            <div key={lesson.id}>{lesson.id} {lesson.state} <a href='#' onClick={handler}>accept</a></div>
          )
        })}
      </div>
    )
  }
}

const Invitations = connect((state, props) => {
  const {live: {lessons}} = state
  return {lessons}
}, {join})(InvitationsRaw)

class ReadyPage extends React.Component {

  static propTypes = {
    push: PropTypes.func.isRequired,
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

  handleReadyChange = (e) => {
    this.props.liveReady({ready: e.target.checked})
  }

  render () {
    const {user: {profile: {role} = {}} = {}} = this.props
    const {teachers = 0, students = 0} = this.props.online

    return (
      <div style={{padding: 16}}>

        {!WebRTC.browserDetails.version ? (
          <div style={{padding: 16, border: 'solid 1px darkred', background: '#F88379', marginBottom: 16}}>
            This browser does not support audio and video calls. You won't be able to participate in lessons. Please try a recent version of Google Chrome, Firefox or Microsoft Edge.
          </div>
        ) : undefined}

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
        <div>
          <h2>Invitations</h2>
          <Invitations />
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
}, {push, liveReady})(ReadyPage)
