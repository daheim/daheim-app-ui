import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import RaisedButton from 'material-ui/RaisedButton'
import CircularProgress from 'material-ui/CircularProgress'

import {relay, leave, join} from '../actions/live'

class ResizedVideo extends Component {

  static propTypes = {
    onResize: PropTypes.func
  }

  componentDidMount () {
    this.refs.video.addEventListener('resize', this.handleResize)
  }

  handleResize = (e) => {
    if (this.props.onResize) this.props.onResize(e)
  }

  render () {
    return <video ref='video' {...this.props} />
  }
}

class LessionPage extends React.Component {

  static propTypes = {
    lesson: PropTypes.object.isRequired,
    relay: PropTypes.func.isRequired,
    leave: PropTypes.func.isRequired,
    join: PropTypes.func.isRequired
  }

  state = {
    remoteVideoWidth: 200,
    remoteVideoHeight: undefined
  }

  handleLeave = () => {
    this.props.leave({id: this.props.lesson.id})
  }

  handleJoin = () => {
    this.props.join({id: this.props.lesson.id})
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleContainerResize)
    this.resizeVideos()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleContainerResize)
  }

  handleContainerResize = (e) => {
    this.resizeVideos()
  }

  handleRemoteVideoResize = (e) => {
    const {target} = e

    const readSize = () => {
      const {videoWidth, videoHeight} = target
      this.remoteWidth = videoWidth
      this.remoteHeight = videoHeight
      this.resizeVideos()
    }

    // arbitrary delay, because on Chrome the new video size is
    // not yet available during the event
    setTimeout(readSize, 100)
    readSize()
  }

  resizeVideos () {
    if (this.remoteWidth && this.remoteHeight) {
      const ratio = this.remoteHeight / this.remoteWidth
      const maxw = window.innerWidth
      const maxh = window.innerHeight

      let remoteVideoWidth = maxw
      let remoteVideoHeight = remoteVideoWidth * ratio
      if (remoteVideoHeight > maxh) {
        remoteVideoHeight = maxh
        remoteVideoWidth = remoteVideoHeight / ratio
      }

      this.setState({remoteVideoWidth, remoteVideoHeight})
    }
  }

  render () {
    const {lesson} = this.props
    const {remoteStreamUrl, localStreamUrl} = lesson
    const {remoteVideoWidth, remoteVideoHeight} = this.state

    return (
      <div style={{position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, display: 'flex', background: '#111', color: 'white', alignItems: 'center', justifyContent: 'center'}}>
        {remoteStreamUrl ? (
          <div>
            <div style={{position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', top: 0, left: 0, right: 0, bottom: 0}}>
              <ResizedVideo width={remoteVideoWidth} height={remoteVideoHeight} autoPlay src={remoteStreamUrl} onResize={this.handleRemoteVideoResize} />
            </div>
            <div style={{position: 'absolute', bottom: 10, right: 10}}>
              <video height='100' style={{transform: 'rotateY(180deg)'}} autoPlay muted src={localStreamUrl} />
            </div>
            <div style={{position: 'absolute', bottom: 10, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <RaisedButton label='Finish Lesson' primary onClick={this.handleLeave} />
            </div>
          </div>
        ) : (
          <div>
            <div style={{textAlign: 'center'}}><CircularProgress /></div>
            <div style={{textAlign: 'center'}}>Connecting...</div>
          </div>
        )}
      </div>
    )
  }

}

class LessonOrLoading extends React.Component {
  static propTypes = {
    lesson: PropTypes.object
  }

  render () {
    const {lesson} = this.props
    if (lesson) return <LessionPage key={lesson.connectionId} {...this.props} />
    else return <div><Link to='/'>Lesson not found...</Link></div>
  }
}

export default connect((state, props) => {
  const {lessonId} = props.params
  const lesson = state.live.lessons[lessonId]
  return {lesson}
}, {relay, leave, join})(LessonOrLoading)
