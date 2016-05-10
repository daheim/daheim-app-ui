import React, {PropTypes} from 'react'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'
import {connect as liveConnect} from '../actions/live'

import Header from '../components/Header'

class DefaultLayout extends React.Component {

  static propTypes = {
    children: React.PropTypes.node,
    push: React.PropTypes.func.isRequired,
    liveConnect: PropTypes.func.isRequired
  }

  state = {

  }

  handleSignOutClick = (eIgnored) => {
    global.localStorage.accessToken = undefined
    this.props.push('/auth/register')
  }

  componentWillMount () {
    if (!global.localStorage.accessToken) this.props.push('/auth/register')
  }

  componentWillUpdate () {
    if (!global.localStorage.accessToken) this.props.push('/auth/register')
  }

  componentDidMount () {
    this.props.liveConnect()
  }

  render () {
    return (
      <div style={{flex: '1 1 auto'}}>
        <Header />
        <div style={{clear: 'both', background: 'white', maxWidth: 960, margin: '0 auto', border: 'solid 1px #DDD', zIndex: 1, position: 'relative'}}>
          {this.props.children}
        </div>
      </div>
    )
  }

}

export default connect(null, {push, liveConnect})(DefaultLayout)
