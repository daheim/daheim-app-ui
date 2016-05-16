import React, {PropTypes, Component} from 'react'
import {connect} from 'react-redux'

import StartLesson from './StartLesson'
import {startLesson} from '../actions/live'

import style from './ReadyUsers.style'

class ReadyUser extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    startLesson: PropTypes.func.isRequired,
    onSelect: PropTypes.func
  }

  handleClick = async (e) => {
    e.preventDefault()
    if (this.props.onSelect) this.props.onSelect(this.props.user)
  }

  render () {
    const {user, ...props} = this.props
    const {profile} = user
    const {picture, name} = profile
    return (
      <div href='#' className={style.readyUser} onClick={this.handleClick} {...props}>
        <img className={style.picture} src={picture} />
        <div className={style.name}>{name}</div>
        <a href='#' onClick={this.handleClick}>start lesson</a>
      </div>
    )
  }
}

export default class ReadyUsers extends Component {

  static propTypes = {
    readyUsers: PropTypes.array,
    startLesson: PropTypes.func.isRequired
  }

  state = {
    selectedUser: undefined
  }

  unselectUser = () => {
    this.setState({selectedUser: undefined})
  }

  selectUser = (user) => {
    this.setState({selectedUser: user})
  }

  render () {
    const {readyUsers, startLesson} = this.props
    const {selectedUser} = this.state

    return (
      <div>
        <h2>Ready Students</h2>
        {readyUsers.length === 0 ? (
          <div>There are no students waiting for a lesson</div>
        ) : (
          readyUsers.map((user) => <ReadyUser key={user.id} user={user} startLesson={startLesson} onSelect={this.selectUser} />)
        )}

        {selectedUser ? <StartLesson key={selectedUser.id} user={selectedUser} onRequestClose={this.unselectUser} /> : undefined}
      </div>
    )
  }
}

export default connect((state) => {
  const {readyUsers} = state.live
  return {readyUsers}
}, {startLesson})(ReadyUsers)

