import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'

import {startLesson, leaveIfNotStarted} from '../actions/live'

class StartLesson extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    startLesson: PropTypes.func.isRequired,
    leaveIfNotStarted: PropTypes.func.isRequired
  }

  state = {
    startLessonPromise: undefined,
    error: undefined,
    lessonId: undefined
  }

  handleStartLesson = async () => {
    if (this.state.startLessonPromise || this.state.lessonId) return

    const startLessonPromise = this.props.startLesson({userId: this.props.user.id})
    this.setState({startLessonPromise, error: undefined})
    try {
      const result = await startLessonPromise
      this.setState({lessonId: result.id})
    } catch (err) {
      this.setState({error: err.message})
    } finally {
      this.setState({startLessonPromise: undefined})
    }
  }

  async componentWillUnmount () {
    if (this.state.lessonId) {
      this.props.leaveIfNotStarted({id: this.state.lessonId})
    }
    if (this.state.startLessonPromise) {
      try {
        const {id} = await this.state.startLessonPromise
        this.props.leaveIfNotStarted({id})
      } catch (err) {
        // ignore
      }
    }
  }

  render () {
    const {user, onRequestClose} = this.props
    const {profile} = user
    const {name} = profile

    const {startLessonPromise, error, lessonId} = this.state

    const actions = [
      <FlatButton
        label='Close'
        onTouchTap={onRequestClose}
      />,
      <FlatButton
        label='Start Lesson'
        primary
        disabled={!!(startLessonPromise || lessonId)}
        onTouchTap={this.handleStartLesson}
      />
    ]

    return (
      <Dialog autoScrollBodyContent open onRequestClose={onRequestClose} actions={actions}>
        <h2>{name}</h2>
        {error ? (
          <div style={{background: '#FA8072', border: 'solid 1px darkred', padding: 16, color: 'black', margin: '10px 0', borderRadius: 2}}>{error}</div>
        ) : undefined}
        {lessonId ? (
          <div style={{display: 'flex', alignItems: 'center'}}>
            <CircularProgress />
            <div style={{margin: 10, fontWeight: 700}}>Waiting for student to accept</div>
          </div>
        ) : undefined}
        {startLessonPromise ? (
          <div style={{display: 'flex', alignItems: 'center'}}>
            <CircularProgress />
            <div style={{margin: 10, fontWeight: 700}}>Requesting...</div>
          </div>
        ) : undefined}
        <div>There will be information about the student here... Kommt gleich :)</div>
      </Dialog>
    )
  }
}

export default connect(null, {startLesson, leaveIfNotStarted})(StartLesson)