import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'

import {acceptNotYetOpen} from '../../actions/not_yet_open'
import underConstruction from 'raw!./under_construction.svg'

class NotYetOpenPage extends Component {

  static propTypes = {
    acceptNotYetOpen: PropTypes.func.isRequired
  }

  accept = (e) => {
    e.preventDefault()
    this.props.acceptNotYetOpen()
  }

  newsletter = (e) => {
    e.preventDefault()
    location.href = 'https://daheimapp.de/newsletter/'
  }

  render () {
    return (
      <div style={{textAlign: 'center'}}>
        <h1>Nur noch wenige Tage</h1>
        <div style={{marginBottom: 30}} dangerouslySetInnerHTML={{__html: underConstruction}} />
        <div style={{lineHeight: '150%', marginBottom: 30}}>
          Bald dann könnt ihr unsere Videotelefonie-Plattform nutzen!<br />
          Wann genau das sein wird, geben wir rechtzeitig über unseren <b>Newsletter</b> bekannt.<br />
        </div>
        <div style={{marginBottom: 30}}>
          <RaisedButton style={{margin: '0 20px'}} label='Für unseren Newsletter anmelden' primary onClick={this.newsletter} />
          <FlatButton style={{margin: '0 20px'}} label='Fortfahren' onClick={this.accept} />
        </div>
      </div>
    )
  }
}

export default connect(null, {acceptNotYetOpen})(NotYetOpenPage)
