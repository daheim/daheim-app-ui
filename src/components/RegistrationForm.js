import React from 'react'
import TextField from 'material-ui/lib/text-field'
import RaisedButton from 'material-ui/lib/raised-button'
import Checkbox from 'material-ui/lib/checkbox'
import {Link} from 'react-router'
import {connect} from 'react-redux'

import LoadingPanel from './LoadingPanel'
import {register} from '../actions/auth'

class RegistrationForm extends React.Component {

  static propTypes = {
    defaultUsername: React.PropTypes.string,
    onLogin: React.PropTypes.func,
    register: React.PropTypes.func.isRequired
  }

  state = {
    email: this.props.defaultUsername || '',
    password: '',
    newsletter: false,
    agree: false,
    loading: false,
    error: null,
    errorPassword: null,
    errorEmail: null
  }

  handleNewsletterChange = (e) => this.setState({newsletter: e.target.checked})
  handleAgreeChange = (e) => this.setState({agree: e.target.checked})

  handleRegisterClick = async (e) => {
    e.preventDefault()

    if (!this.validateLogin()) return
    if (this.state.loading) return

    let success = true
    this.setState({loading: true})
    try {
      const result = await this.props.register({
        email: this.state.email,
        password: this.state.password,
        newsletter: this.state.newsletter
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
    } else if (this.state.password.length < 6) {
      valid.hasErrors = true
      valid.errorPassword = valid.error = 'Passwort zu kurz (min. 6 Zeichen)'
    }

    if (!this.state.email) {
      valid.hasErrors = true
      valid.errorEmail = valid.error = 'Bitte E-Mail-Addresse eingeben'
    } else if (this.state.email.indexOf('@') === -1) {
      valid.hasErrors = true
      valid.errorEmail = valid.error = 'E-Mail-Addresse ist nicht gültig'
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
          Mitglied gefunden. Klicken Sie hier, um <Link to={{pathname: '/auth', query: {username: this.state.email || undefined}}}>sich anzumelden</Link>.
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
        <form noValidate onSubmit={this.handleRegisterClick}>
          <h1 style={{fontSize: 22}}>Jetzt kostenlos Mitglied werden!</h1>
          {error}
          <TextField ref='email' type='email' fullWidth floatingLabelText='E-Mail-Addresse' errorText={this.state.errorEmail} value={this.state.email} onChange={this.handleEmailChange} />
          <TextField ref='password' style={{marginTop: -10}} type='password' fullWidth errorText={this.state.errorPassword} floatingLabelText='Passwort' value={this.state.password} onChange={this.handlePasswordChange} />
          <Checkbox style={{marginTop: 20}} label='Ja, ich möchte zum Newsletter anmelden' checked={this.state.newsletter} onCheck={this.handleNewsletterChange} />
          <Checkbox style={{marginTop: 10}} label='Ja, ich akzeptiere die AGB' checked={this.state.agree} onCheck={this.handleAgreeChange} />
          <RaisedButton disabled={!this.state.agree} type='submit' style={{marginTop: 20}} fullWidth secondary label='Jetzt registrieren' />
          <p style={{fontSize: 14, marginTop: 20, lineHeight: '150%'}}>Klicken Sie hier, um <Link to={{pathname: '/auth', query: {username: this.state.email || undefined}}}>sich anzumelden</Link>. <a href='#'>Allgemeinen Geschäftsbedingungen</a> und <a href='#'>Datenschutzrichtlinien</a></p>
        </form>
      </LoadingPanel>
    )
  }
}

export default connect(null, {register})(RegistrationForm)

