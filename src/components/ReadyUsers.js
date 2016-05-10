import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

import {startLesson} from '../actions/live'

export default class ReadyUsers extends React.Component {

  static propTypes = {
    readyUsers: PropTypes.array,
    startLesson: PropTypes.func.isRequired
  }

  handleClick = async (e, user) => {
    e.preventDefault()
    console.log('startLesson result', await this.props.startLesson({userId: user.id}))
  }

  render () {
    const {readyUsers} = this.props
    return (
      <div>
        {readyUsers.map((user) => {
          const handler = (e) => this.handleClick(e, user)
          return (
            <div key={user.id}>{user.id} {user.profile.name} <a href='#' onClick={handler}>connect</a></div>
          )
        })}
      </div>
    )
  }
}

export default connect((state) => {
  const {readyUsers} = state.live
  return {readyUsers}
}, {startLesson})(ReadyUsers)

