import React, {Component, PropTypes} from 'react'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'

import NotYetOpenPage from '../components/ready/NotYetOpenPage'
import ReviewList from '../components/review/ReviewList'
import TalkAbout from '../components/TalkAbout'
import ReadyUsers from '../components/ReadyUsers'
import ReadySwitch from '../components/ready/ReadySwitch'
import TimeToChoose from '../components/ready/TimeToChoose'
import NotYetInOperation from '../components/NotYetInOperation'
import WebRTC from 'webrtc-adapter'

class ReadyPageRaw extends React.Component {

  static propTypes = {
    push: PropTypes.func.isRequired,
    user: PropTypes.object,
    online: PropTypes.object
  }

  render () {
    const {user: {profile: {role} = {}} = {}} = this.props

    return (
      <div style={{padding: 16}}>

        <TimeToChoose />

        {!WebRTC.browserDetails.version ? (
          <div style={{padding: 16, border: 'solid 1px darkred', background: '#F88379', marginBottom: 16}}>
            This browser does not support audio and video calls. You won't be able to participate in lessons. Please try a recent version of Google Chrome, Firefox or Microsoft Edge.
          </div>
        ) : undefined}

        <NotYetInOperation />

        {role === 'student' ? (
          <ReadySwitch />
        ) : undefined}

        {role === 'teacher' ? (
          <ReadyUsers />
        ) : undefined}

        <ReviewList />
        <TalkAbout />
      </div>
    )
  }
}

const ReadyPage = connect((state, props) => {
  const {live: {online}, profile: {profile: user}} = state
  return {online, user}
}, {push})(ReadyPageRaw)

class ReadyOrNotYetOpen extends Component {
  static propTypes = {
    accepted: PropTypes.bool
  }

  render () {
    if (this.props.accepted) return <ReadyPage />
    return <NotYetOpenPage />
  }
}

export default connect((state) => {
  const {notYetOpen: {accepted}} = state
  return {accepted}
})(ReadyOrNotYetOpen)
