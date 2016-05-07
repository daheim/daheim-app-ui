import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

export default class ReadyUsers extends React.Component {

  static propTypes = {
    readyUsers: PropTypes.array
  }

  render () {
    const {readyUsers} = this.props
    return (
      <div>
        {readyUsers.map((user) => {
          return (
            <div key={user._id}>{user._id} {user.profile.name}</div>
          )
        })}
      </div>
    )
  }
}

export default connect((state) => {
  const {readyUsers} = state.live
  return {readyUsers}
}, {})(ReadyUsers)

