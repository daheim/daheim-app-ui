import React from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import {Link} from 'react-router'
import {connect} from 'react-redux'

import LoadingPanel from './LoadingPanel'
import {login} from '../actions/auth'

class LoginForm extends React.Component {

  static propTypes = {
    defaultUsername: React.PropTypes.string,
    onLogin: React.PropTypes.func,
    login: React.PropTypes.func.isRequired
  }

  state = {
    email: this.props.defaultUsername || '',
    password: '',
    loading: false,
    error: null,
    errorPassword: null,
    errorEmail: null
  }

  handleLoginClick = async (e) => {
    e.preventDefault()

    if (!this.validateLogin()) return
    if (this.state.loading) return

    let success = true
    this.setState({loading: true})
    try {
      const result = await this.props.login({
        email: this.state.email,
        password: this.state.password
      })
      if (result.error) throw result.payload
      this.setState({error: null})
    } catch (err) {
      success = false
      this.setState({error: err.message})
    } finally {
      this.setState({loading: false})
    }

    if (success && this.props.onLogin) this.props.onLogin()
  }

  validateLogin () {
    let valid = {
      hasErrors: false,
      errorPassword: null,
      errorEmail: null
    }

    if (!this.state.password) {
      valid.hasErrors = true
      valid.errorPassword = valid.error = 'Bitte Passwort eingeben'
    }

    if (!this.state.email) {
      valid.hasErrors = true
      valid.errorEmail = valid.error = 'Bitte E-Mail-Addresse eingeben'
    }

    this.setState(valid)

    return !valid.hasErrors
  }

  componentDidMount () {
    (this.state.email ? this.refs.password : this.refs.email).focus()
  }

  handleEmailChange = (e) => this.setState({email: e.target.value})
  handlePasswordChange = (e) => this.setState({password: e.target.value})

  render () {
    let error
    if (this.state.error === 'user_already_exists') {
      error = (
        <div style={{padding: '15px 30px 15px 15px', margin: '20px 0', backgroundColor: 'rgba(204,122,111,0.1)', borderLeft: '5px solid rgba(191,87,73,0.2)'}}>
          Mitglied gefunden. Klicken Sie hier, um <a href='#'>sich anzumelden</a>.
        </div>
      )
    } else if (this.state.error) {
      error = (
        <div style={{padding: '15px 30px 15px 15px', margin: '20px 0', backgroundColor: 'rgba(204,122,111,0.1)', borderLeft: '5px solid rgba(191,87,73,0.2)'}}>
          Fehler: {this.state.error}
        </div>
      )
    }

    return (
      <LoadingPanel loading={this.state.loading}>
        <form noValidate onSubmit={this.handleLoginClick}>
          {error}
          <TextField ref='email' type='email' fullWidth floatingLabelText='E-Mail-Addresse' errorText={this.state.errorEmail} value={this.state.email} onChange={this.handleEmailChange} />
          <TextField ref='password' style={{marginTop: -10}} type='password' fullWidth errorText={this.state.errorPassword} floatingLabelText='Passwort' value={this.state.password} onChange={this.handlePasswordChange} />
          <RaisedButton type='submit' style={{marginTop: 20}} fullWidth secondary label='Einloggen' />
          <div style={{fontSize: 14, textAlign: 'center', paddingTop: 20}}>
            <Link to={{pathname: '/auth/forgot', query: {username: this.state.email || undefined}}}>Password vergessen?</Link> oder <Link to={{pathname: '/auth/register', query: {username: this.state.email || undefined}}}>Neu anmelden</Link>
          </div>
        </form>
      </LoadingPanel>
    )
  }
}

export default connect(null, {login})(LoginForm)
