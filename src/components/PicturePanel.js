import React from 'react'
import Dropzone from 'react-dropzone'

import LoadingPanel from './LoadingPanel'
import Panel from './Panel'

console.warn('interop in picture_upload')
const interop = {auth: {authHeader: () => ''}, config: {}}

const dispatch = () => console.warn('replace dispatch in picture_upload.js')
console.warn('replace profileStore in picture_upload.js')
const profileStore = {
  getProfile: () => ({}),
  isUploading: () => false,
  getTempPicture: () => null,
  addListener: () => ({remove: () => true})
}

export class Picture extends React.Component {

  state = this.calculateState()

  calculateState () {
    let newState = {
      url: null,
      uploading: profileStore.isUploading()
    }

    if (profileStore.getTempPicture()) {
      newState.url = profileStore.getTempPicture()
    } else if (profileStore.getProfile()) {
      let id = profileStore.getProfile().id
      newState.url = `https://${interop.config.storageAccount}.blob.core.windows.net/public/users/${id}/picture.png?${Date.now()}`
    }

    return newState
  }

  componentDidMount () {
    this.handleChangeToken = profileStore.addListener(() => this.setState(this.calculateState()))
  }

  componentWillUnmount () {
    this.handleChangeToken.remove()
  }

  render () {
    return (
      <LoadingPanel loading={this.state.uploading}>
        <img src={this.state.url} style={{width: 128, height: 128, borderRadius: '50%'}} />
      </LoadingPanel>
    )
  }

}

export class PictureUpload extends React.Component {

  state = {
    snap: false,
    useCamera: false
  }

  handleDrop = (files) => {
    if (files.length !== 1) { return }
    dispatch({type: 'profile/upload_picture', file: files[0]})
  }

  useCamera = (e) => {
    e.preventDefault()
    this.setState({useCamera: true})
  }

  cancelCamera = (e) => {
    e.preventDefault()
    this.setState({useCamera: false})
  }

  cancel = (e) => {
    e.preventDefault()
  }

  snap = (e) => {
    e.preventDefault()
    let unregisterWatch = this.refs.asdf.scope.$watch('imageData', (value) => {
      if (value) {
        unregisterWatch()
        dispatch({type: 'profile/upload_picture_data', data: value})
        this.setState({useCamera: false})
      }
    })
    this.refs.asdf.scope.$apply(() => {
      this.refs.asdf.scope.cameraSnap = !this.refs.asdf.scope.cameraSnap
    })
  }

  render () {
    return (
      <div>
        {this.state.useCamera ? (
          <div>
            <div>
              <div>--- angular dhm-profile-camera ---</div>
            </div>
            <div style={{textAlign: 'center'}}>
              <a href='#' onClick={this.snap}>Upload</a>
            </div>
            <div style={{textAlign: 'center'}}>
              <a href='#' onClick={this.cancelCamera}>Cancel</a>
            </div>
          </div>
        ) : (
          <div>
            <Dropzone accept='image/*' disableClick style={{textAlign: 'center'}} activeStyle={{opacity: 0.5}} onDrop={this.handleDrop}>
              <Picture />
            </Dropzone>
            <Dropzone accept='image/*' style={{cursor: 'pointer', padding: 5, textAlign: 'center', marginTop: 8}} activeStyle={{backgroundColor: '#eee'}} onDrop={this.handleDrop}>
              <a href='#' onClick={this.cancel}>Upload a new photo</a>
            </Dropzone>
            <div style={{textAlign: 'center', marginTop: 8}}>
              <a href='#' onClick={this.useCamera}>Use camera</a>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default class PicturePanel extends React.Component {
  render () {
    return (
      <Panel>
        <PictureUpload />
      </Panel>
    )
  }
}
