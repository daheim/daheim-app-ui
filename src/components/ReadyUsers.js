import React from 'react'
import {connect} from 'react-redux'

export default class ReadyUsers extends React.Component {

  static propTypes = {
  }

  handleChange = (e, value) => {
    this.props.switchRole(value)
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

