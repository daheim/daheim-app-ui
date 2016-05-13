import React, {PropTypes} from 'react'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'
import {connect as liveConnect} from '../actions/live'
import {loadProfile} from '../actions/profile'

import Header from '../components/Header'
import InvitedToLesson from '../components/InvitedToLesson'

class DefaultLayout extends React.Component {

  static propTypes = {
    profile: PropTypes.object,
    children: React.PropTypes.node,
    push: React.PropTypes.func.isRequired,
    liveConnect: PropTypes.func.isRequired,
    loadProfile: PropTypes.func.isRequired
  }

  state = {

  }

  componentDidMount () {
    this.props.liveConnect() // TODO: handle unmount
    if (!this.props.profile) this.props.loadProfile()
  }

  render () {
    return (
      <div style={{flex: '1 1 auto'}}>
        <Header />
        <div style={{clear: 'both', background: 'white', maxWidth: 960, margin: '0 auto', border: 'solid 1px #DDD', zIndex: 1, position: 'relative'}}>
          {this.props.children}
        </div>
        <InvitedToLesson />
      </div>
    )
  }

}

export default connect((state, props) => {
  const {profile} = state.profile
  return {profile}
}, {push, liveConnect, loadProfile})(DefaultLayout)
