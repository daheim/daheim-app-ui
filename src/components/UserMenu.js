import React from 'react'
import {connect} from 'react-redux'
import {Link}  from 'react-router'
import Popover from 'material-ui/lib/popover/popover'
import PopoverAnimationFromTop from 'material-ui/lib/popover/popover-animation-from-top'
import classnames from 'classnames'

import style from './Header.style'


class UserDropdown extends React.Component {

  static propTypes = {
    onRequestClose: React.PropTypes.func
  }

  render() {
    return (
      <div style={{width: 200, overflowY: 'auto'}}>
        <Link to='/profile' className={style.dropDownItem}>Edit profile</Link>
        <Link to='/password' className={style.dropDownItem}>Change password</Link>
        <Link to='/logout' className={style.dropDownItem}>Sign out</Link>
      </div>
    )
  }
}

class UserItemRaw extends React.Component {
  state = {
    open: false
  }

  handleRequestClose = (e) => {
    this.setState({ open: false })
  }

  handleClick = (e) => {
    e.preventDefault()
    this.setState({
      open: true,
      anchorEl: e.currentTarget
    })
  }

  render() {
    const {user: {profile: {name, picture} = {}} = {}} = this.props
    const classes = classnames({
      [style.headerItem]: true,
      [style.headerItemActive]: this.state.open
    })
    return (
      <div>
        <Link to='/profile' className={classes} onClick={this.handleClick}>
          <div style={{ marginRight: 12 }}>
            {name}
          </div>
          <img className={style.avatar} src={picture} />
        </Link>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
          animation={PopoverAnimationFromTop}
          style={{ borderRadius: null }}
        >
          <UserDropdown
            onRequestClose={this.handleRequestClose} />
        </Popover>
      </div>
    )
  }
}

export default connect((state, props) => {
  const user = state.profile.profile
  return {user}
}, {})(UserItemRaw)
