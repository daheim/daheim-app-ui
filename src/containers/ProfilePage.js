import React from 'react'
import {connect} from 'react-redux'
import md5 from 'md5'
import Dropzone from 'react-dropzone'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import Checkbox from 'material-ui/Checkbox'
import {push} from 'react-router-redux'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import FlatButton from 'material-ui/FlatButton'

import {saveProfile} from '../actions/profile'
import RoleSwitch from '../components/RoleSwitch'
import {ProficiencyRating} from './ReviewPage'

const avatars = {
  default: 'http://www.creativemediaresearch.com/wp-content/uploads/2013/04/woman.jpg',
  scotland: 'http://pickaface.net/avatar/adel_benacer572e1177c83ff.png',
  scotland2: 'http://pickaface.net/avatar/adel_benacer572e1177c83ff.png',
  scotland3: 'http://pickaface.net/avatar/adel_benacer572e1177c83ff.png',
  scotland4: 'http://pickaface.net/avatar/adel_benacer572e1177c83ff.png',
  scotland5: 'http://pickaface.net/avatar/adel_benacer572e1177c83ff.png',
  scotland6: 'http://pickaface.net/avatar/adel_benacer572e1177c83ff.png'
}

class ProfilePage extends React.Component {

  static propTypes = {
    user: React.PropTypes.object.isRequired,
    saveProfile: React.PropTypes.func.isRequired,
    push: React.PropTypes.func.isRequired
  }

  state = {
    picture: this.props.user.profile.picture,
    name: this.props.user.profile.name
  }

  gravatarUrl = (() => {
    const {user = {}} = this.props
    const {username = ''} = user
    const hash = md5(username.trim().toLowerCase())
    // const {devicePixelRatio = 1} = window || {}
    const gr = `https://secure.gravatar.com/avatar/${hash}?s=256&d=monsterid&r=x`
    return gr
  })()

  handleSave = (e) => {
    this.props.saveProfile({
      name: this.state.name,
      pictureType: this.pictureType,
      pictureData: this.pictureData
    })
    this.props.push('/')
  }

  handleBack = (e) => {
    this.props.push('/')
  }

  handleGravatarClick = (e) => {
    e.preventDefault()
    this.pictureType = 'gravatar'
    this.setState({picture: this.gravatarUrl})
  }

  handleAvatarClick = (e, key) => {
    e.preventDefault()
    this.pictureType = 'avatar'
    this.pictureData = key
    this.setState({picture: avatars[key]})
  }

  handleNameChange = (e) => {
    this.setState({name: e.target.value})
  }

  cancel = (e) => {
    e.preventDefault()
  }

  handleDrop = ([file]) => {
    const img = new Image()
    const fr = new FileReader()
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 256

    fr.onload = () => {
      img.onload = () => {
        const ctx = canvas.getContext('2d')
        const ratio = Math.max(canvas.width / img.width, canvas.height / img.height)
        const centerShiftX = (canvas.width - img.width * ratio) / 2
        const centerShiftY = (canvas.height - img.height * ratio) / 2
        ctx.drawImage(img, 0, 0, img.width, img.height,
          centerShiftX, centerShiftY, img.width * ratio, img.height * ratio)

        const data = canvas.toDataURL('image/png')
        this.pictureType = 'data'
        this.pictureData = data
        this.setState({picture: data})
      }
      img.src = fr.result
    }
    fr.readAsDataURL(file)
  }

  render () {
    const {name, picture} = this.state

    return (
      <div style={{margin: 16}}>
        <h1>Profile</h1>
        <div>

          <div style={{display: 'flex', flexWrap: 'wrap', maxWidth: 630}}>
            <div style={{fontSize: 15, fontWeight: 700, marginBottom: 8, marginRight: 10, flex: '0 0 150px'}}>
              Personendaten
            </div>
            <div style={{flex: '1 1 400px'}}>
              <div style={{marginTop: -14}}>
                <TextField fullWidth floatingLabelText='Name' value={name} onChange={this.handleNameChange} />
              </div>
              <div style={{marginTop: 16, marginBottom: 8, fontWeight: 700, fontSize: 14}}>Profilbild</div>
              <div style={{display: 'flex'}}>
                <Dropzone accept='image/*' style={{cursor: 'pointer', flex: '0 0 auto', margin: 5, padding: 5}} activeStyle={{backgroundColor: '#eee'}} onDrop={this.handleDrop}>
                  <div>
                    <img style={{borderRadius: '50%', width: 128, height: 128}} src={picture} />
                  </div>
                  <div style={{textAlign: 'center'}}>
                    <a href='#' onClick={this.cancel}>Hochladen</a>
                  </div>
                </Dropzone>
                <div style={{margin: 10}}>
                  <div style={{marginBottom: 10}}>
                    Wähle einen Avatar:
                  </div>
                  <div>
                    <a style={{margin: 5}} href='#' title='Use gravatar' onClick={this.handleGravatarClick}><img src={this.gravatarUrl} style={{borderRadius: '50%', width: 64, height: 64}} /></a>
                    {Object.keys(avatars).map((key) => {
                      const handler = (e) => this.handleAvatarClick(e, key)
                      return <a key={key} style={{margin: 5}} href='#' title='Use avatar' onClick={handler}><img src={avatars[key]} style={{borderRadius: '50%', width: 64, height: 64}} /></a>
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{display: 'flex', flexWrap: 'wrap', maxWidth: 700, marginTop: 20}}>
            <div style={{fontSize: 15, fontWeight: 700, marginBottom: 8, marginRight: 10, flex: '0 0 150px'}}>
              Sprache
            </div>
            <div style={{flex: '1 1 400px'}}>
              <div style={{marginBottom: 8, fontWeight: 700, fontSize: 14}}>Seit wann wohnst du in Deutschland?</div>
              <div>
                <DropDownMenu value={1} style={{marginTop: -10, marginLeft: -20}}>
                  <MenuItem value={1} primaryText='2016' />
                  <MenuItem value={2} primaryText='2015' />
                  <MenuItem value={3} primaryText='2014' />
                  <MenuItem value={4} primaryText='Früher als 2014' />
                </DropDownMenu>
              </div>
              <div style={{marginBottom: 8, marginTop: 16, fontWeight: 700, fontSize: 14}}>Deutschkenntnis</div>
              <div><ProficiencyRating /></div>
              <div style={{marginBottom: 8, marginTop: 16, fontWeight: 700, fontSize: 14}}>Andere Sprachen</div>
              <div style={{display: 'flex', flexWrap: 'wrap'}}>
                <div style={{flex: '0 0 150px', margin: '4px 0'}}><Checkbox label='Englisch' /></div>
                <div style={{flex: '0 0 150px', margin: '4px 0'}}><Checkbox label='Spanisch' /></div>
                <div style={{flex: '0 0 150px', margin: '4px 0'}}><Checkbox label='Französisch' /></div>
                <div style={{flex: '0 0 150px', margin: '4px 0'}}><Checkbox label='Italienisch' /></div>
                <div style={{flex: '0 0 150px', margin: '4px 0'}}><Checkbox label='Türkisch' /></div>
                <div style={{flex: '0 0 150px', margin: '4px 0'}}><Checkbox label='Arabisch' /></div>
              </div>
            </div>
          </div>

          <div style={{display: 'flex', flexWrap: 'wrap', maxWidth: 630, marginTop: 20}}>
            <div style={{fontSize: 15, fontWeight: 700, marginBottom: 8, marginRight: 10, flex: '0 0 150px'}}>
              Themen
            </div>
            <div style={{flex: '1 1 400px'}}>
              <div style={{marginBottom: 8, fontWeight: 700, fontSize: 14}}>Ich spreche gern über...</div>
              <div style={{display: 'flex', flexWrap: 'wrap'}}>
                <div style={{flex: '0 0 150px', margin: '4px 0'}}><Checkbox label='Autos' /></div>
                <div style={{flex: '0 0 150px', margin: '4px 0'}}><Checkbox label='Kochen' /></div>
                <div style={{flex: '0 0 150px', margin: '4px 0'}}><Checkbox label='Wandern' /></div>
                <div style={{flex: '0 0 150px', margin: '4px 0'}}><Checkbox label='Fotografie' /></div>
                <div style={{flex: '0 0 150px', margin: '4px 0'}}><Checkbox label='Garten' /></div>
                <div style={{flex: '0 0 150px', margin: '4px 0'}}><Checkbox label='Familie' /></div>
                <div style={{flex: '0 0 150px', margin: '4px 0'}}><Checkbox label='Politik' /></div>
                <div style={{flex: '0 0 150px', margin: '4px 0'}}><Checkbox label='Kunst' /></div>
                <div style={{flex: '0 0 150px', margin: '4px 0'}}><Checkbox label='Sport' /></div>
              </div>
              <div>
                <TextField style={{marginTop: -8}} fullWidth multiLine floatingLabelText='Ein Paar Worte über dich' rows={1} rowsMax={4} />
              </div>
            </div>
          </div>

        </div>

        <div style={{marginTop: 20, maxWidth: 630, display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
          <FlatButton style={{margin: '0 10px'}} label='Zurück' onClick={this.handleBack} />
          <RaisedButton style={{margin: '0 10px'}} label='Speichern' primary onClick={this.handleSave} />
        </div>
        <div style={{marginTop: 50, borderTop: 'dashed 1px #CCC'}}>
          <h2>Debug</h2>
          <div><RoleSwitch /></div>
        </div>
      </div>
    )
  }

}

class ProfileOrLoading extends React.Component {
  static propTypes = {
    user: React.PropTypes.object
  }

  render () {
    if (this.props.user) return <ProfilePage {...this.props} />
    else return <div>Just a sec...</div>
  }
}

export default connect((state, props) => {
  const user = state.profile.profile
  return {user}
}, {saveProfile, push})(ProfileOrLoading)
