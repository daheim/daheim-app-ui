import React from 'react'
import TextField from 'material-ui/lib/text-field'
import RaisedButton from 'material-ui/lib/raised-button'
import {Link} from 'react-router'
import {connect} from 'react-redux'

import {forgot} from '../actions/auth'
import LoadingPanel from '../components/LoadingPanel'

console.warn('fix network error in ForgotPasswordPage')

class ForgotPasswordFormRaw extends React.Component {

  static propTypes = {
    defaultUsername: React.PropTypes.string,
    onLogin: React.PropTypes.func,
    forgot: React.PropTypes.func.isRequired
  }

  state = {
    email: this.props.defaultUsername || '',
    loading: false,
    error: null,
    errorEmail: null
  }

  handleLoginClick = async (e) => {
    e.preventDefault()

    if (!this.validateLogin()) return
    if (this.state.loading) return

    let success = true
    this.setState({loading: true})
    try {
      const result = await this.props.forgot({
        email: this.state.email
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
      errorEmail: null
    }

    if (!this.state.email) {
      valid.hasErrors = true
      valid.errorEmail = valid.error = 'Bitte E-Mail-Addresse eingeben'
    }

    this.setState(valid)

    return !valid.hasErrors
  }

  componentDidMount () {
    this.refs.email.focus()
  }

  handleEmailChange = (e) => this.setState({email: e.target.value})

  render () {
    let error
    if (this.state.error === 'user_not_found') {
      error = (
        <div style={{padding: '15px 30px 15px 15px', margin: '20px 0', backgroundColor: 'rgba(204,122,111,0.1)', borderLeft: '5px solid rgba(191,87,73,0.2)'}}>
          Kein Mitglied gefunden. Klicken Sie hier, um <Link to={{pathname: '/auth/register', query: {username: this.state.email || undefined}}}>neu anzumelden</Link>.
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
        <form onSubmit={this.handleLoginClick}>
          <h1 style={{fontSize: 22}}>Passwort vergessen?</h1>
          <h2 style={{fontSize: 14, fontWeight: 400, lineHeight: '150%'}}>Geben Sie Ihre E-Mail-Adresse ein und wir helfen Ihnen, Ihr Passwort zurückzusetzen.</h2>
          {error}
          <TextField ref='email' fullWidth floatingLabelText='E-Mail-Addresse' errorText={this.state.errorEmail} value={this.state.email} onChange={this.handleEmailChange} />
          <RaisedButton type='submit' style={{marginTop: 20}} fullWidth secondary label='Weiter' />
        </form>
      </LoadingPanel>
    )
  }
}

const ForgotPasswordForm = connect(null, {forgot})(ForgotPasswordFormRaw)

export class EmailSent extends React.Component {

  static propTypes = {
    style: React.PropTypes.object
  }

  render () {
    return (
      <div style={this.props.style}>E-Mail wurde gesendet.</div>
    )
  }

}

export default class ForgotPasswordPage extends React.Component {

  static propTypes = {
    location: React.PropTypes.shape({
      query: React.PropTypes.shape({
        username: React.PropTypes.string
      }).isRequired
    }).isRequired
  }

  state = {
    sent: false
  }

  handleLogin = () => {
    this.setState({sent: true})
  }

  render () {
    return (
      <div style={{maxWidth: 400, margin: '0 auto', padding: '16px 10px'}}>
        <div style={{background: 'rgba(255,255,255,0.9)', borderRadius: 10, padding: 20, paddingTop: 12}}>
          {!this.state.sent ? (
            <ForgotPasswordForm onLogin={this.handleLogin} defaultUsername={this.props.location.query.username} />
          ) : (
            <EmailSent style={{paddingTop: 8}} />
          )}
        </div>
      </div>
    )
  }

}

