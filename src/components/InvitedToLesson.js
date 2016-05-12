import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

import {join, leave} from '../actions/live'

class InvitedToLessonDialog extends Component {

  static propTypes = {
    lesson: PropTypes.object.isRequired,
    join: PropTypes.func.isRequired,
    leave: PropTypes.func.isRequired
  }

  handleRequestClose = () => {
    this.props.leave({id: this.props.lesson.id})
  }

  handleAccept = () => {
    this.props.join({id: this.props.lesson.id})
  }

  render () {
    // const {lesson} = this.props
    // const {id} = lesson

    const actions = [
      <FlatButton
        label='Reject'
        onTouchTap={this.handleRequestClose}
      />,
      <FlatButton
        label='Accept'
        primary
        onTouchTap={this.handleAccept}
      />
    ]

    return (
      <Dialog autoScrollBodyContent open modal onRequestClose={this.handleRequestClose} actions={actions}>
        <h2>Invited to Lesson</h2>
        <div>There will be information about the student here... Kommt gleich :)</div>
      </Dialog>
    )
  }
}

class InvitedToLesson extends Component {

  static propTypes = {
    lesson: PropTypes.object
  }

  state = {
    lesson: this.props.lesson
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.lesson || !this.props.lesson || this.props.lesson.id !== nextProps.lesson.id) {
      this.setState({lesson: nextProps.lesson})
    }
  }

  render () {
    const {lesson} = this.state
    if (!lesson) return null
    return <InvitedToLessonDialog {...this.props} key={lesson.id} lesson={lesson} />
  }
}

export default connect((state, props) => {
  const {lessons} = state.live
  const keys = Object.keys(lessons)
  let lesson = keys.length ? lessons[keys[0]] : undefined
  if (lesson) {
    if (lesson.participating) lesson = undefined
  }
  return {lesson}
}, {join, leave})(InvitedToLesson)
