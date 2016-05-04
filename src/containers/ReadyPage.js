import React from 'react'
import RaisedButton from 'material-ui/lib/raised-button'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'

import ReviewList from '../components/ReviewList'
import PicturePanel from '../components/PicturePanel'
import TalkAbout from '../components/TalkAbout'
import {connect as liveConnect, ready as liveReady} from '../actions/live'

class ReadyPage extends React.Component {

  static propTypes = {
    push: React.PropTypes.func.isRequired
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
    return (
      <div style={{padding: 16}}>
        <div style={{textAlign: 'center'}}>
          <div style={{display: 'inline-block', margin: '20px auto'}}>
            <RaisedButton primary label='Start a Lesson' onClick={this.handleReadyClick}/>
          </div>
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1000, width: '100%', margin: '0 auto'}}>
          <ReviewList style={{flex: '0 1 600px', margin: '0 8px'}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap', maxWidth: 1000, width: '100%', margin: '0 auto'}}>
          <div>--- angular register_profile ---</div>
          <div style={{flex: '0 1 300px'}}>
            <PicturePanel />
          </div>
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
