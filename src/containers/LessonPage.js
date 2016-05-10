import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

import {relay, leave, join} from '../actions/live'

class LessionPage extends React.Component {

  static propTypes = {
    lesson: PropTypes.object.isRequired,
    relay: PropTypes.func.isRequired,
    leave: PropTypes.func.isRequired,
    join: PropTypes.func.isRequired
  }

  handleLeave = () => {
    this.props.leave({id: this.props.lesson.id})
  }

  handleJoin = () => {
    this.props.join({id: this.props.lesson.id})
  }

  render () {
    const {lesson} = this.props
    const {participating, active, connected, closed} = lesson
    return (
      <div>
        <video width='200' style={{transform: 'rotateY(180deg)'}} autoPlay muted src={lesson.localStreamUrl} />
        <video width='200' autoPlay src={lesson.remoteStreamUrl} />
        <button onClick={this.handleLeave}>Leave</button>
        <button onClick={this.handleJoin}>Join</button>
        participating: {'' + !!participating + ' '}
        active: {'' + !!active + ' '}
        connected: {'' + !!connected + ' '}
        closed: {'' + !!closed + ' '}
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
