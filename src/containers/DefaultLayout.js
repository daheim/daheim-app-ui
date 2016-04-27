import React from 'react'
import FlatButton from 'material-ui/lib/flat-button'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'

import Logo from '../components/logo'

class DefaultLayout extends React.Component {

  static propTypes = {
    children: React.PropTypes.node,
    push: React.PropTypes.func.isRequired
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

  render () {
    return (
      <div style={{flex: '1 1 auto', background: 'black', backgroundSize: 'cover', backgroundImage: 'url(https://assets.daheimapp.de/media/daheim_hero.jpg),url(https://assets.daheimapp.de/media/daheim_hero@tiny.jpg)'}}>
        <div style={{margin: '0 auto', padding: 10, paddingTop: 20, maxWidth: 1000}}>
          <Logo style={{float: 'left'}} />
          <div style={{float: 'right', lineHeight: '65px'}}>
            <FlatButton style={{color: 'white', fontWeight: 700, opacity: 0.8}} label='Sign Out' onClick={this.handleSignOutClick} />
          </div>
        </div>
        <div style={{clear: 'both'}}>
          {this.props.children}
        </div>
      </div>
    )
  }

}

export default connect(null, {push})(DefaultLayout)
