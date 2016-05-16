import React, {PropTypes} from 'react'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'

import ReviewList from '../components/ReviewList'
import TalkAbout from '../components/TalkAbout'
import ReadyUsers from '../components/ReadyUsers'
import ReadySwitch from '../components/ready/ReadySwitch'
import WebRTC from 'webrtc-adapter'

class ReadyPage extends React.Component {

  static propTypes = {
    push: PropTypes.func.isRequired,
    user: PropTypes.object,
    online: PropTypes.object
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
          <ReadySwitch />
        ) : undefined}

        <div>Online teachers: {teachers} | Online students: {students}</div>

        {role === 'teacher' ? (
          <ReadyUsers />
        ) : undefined}

        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1000, width: '100%', margin: '0 auto'}}>
          <ReviewList style={{flex: '0 1 600px', margin: '0 8px'}} />
        </div>
        <TalkAbout />
      </div>
    )
  }
}

export default connect((state, props) => {
  const {live: {online}, profile: {profile: user}} = state
  return {online, user}
}, {push})(ReadyPage)
