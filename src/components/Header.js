import React from 'react'

import Logo from './Logo'
import style from './Header.style'

export default class Header extends React.Component {
  render () {
    return (
      <div>
        <div className={style.head2}>
          <div className={style.topbar}>
            <div className={style.logo}>
              <Logo />
            </div>
            <div className={style.spacer}></div>
            <div className={style.profile}></div>
          </div>
        </div>
        <div className={style.cover2}>
          <div className={style.photo}></div>
          <div className={style.title}>Presse</div>
        </div>
      </div>
    )
  }
}
