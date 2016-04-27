import React from 'react'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'

import RegistrationForm from '../components/RegistrationForm'

class RegistrationPage extends React.Component {

  static propTypes = {
    location: React.PropTypes.shape({
      query: React.PropTypes.shape({
        username: React.PropTypes.string
      }).isRequired
    }).isRequired,
    push: React.PropTypes.func.isRequired
  };

  handleLogin = () => {
    this.props.push('/')
  };

  render () {
    return (
      <div style={{maxWidth: 400, margin: '0 auto', padding: '16px 10px'}}>
        <div style={{background: 'rgba(255,255,255,0.9)', borderRadius: 10, padding: 20, paddingTop: 12}}>
          <RegistrationForm onLogin={this.handleLogin} defaultUsername={this.props.location.query.username} />
        </div>
      </div>
    )
  }
}

export default connect(null, {push})(RegistrationPage)
