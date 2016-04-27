import React from 'react'
import {Router, Route, IndexRoute} from 'react-router'

import DefaultLayout from './containers/DefaultLayout'
import ReadyPage from './containers/ReadyPage'
import VideoPage from './containers/VideoPage'
import ReviewPage from './containers/ReviewPage'

import LoginLayout from './containers/LoginLayout'
import LoginPage from './containers/LoginPage'
import RegistrationPage from './containers/RegistrationPage'
import ForgotPasswordPage from './containers/ForgotPasswordPage'
import ResetPasswordPage from './containers/ResetPasswordPage'

import NotFoundPage from './containers/NotFoundPage'

export default function createRouter (history) {
  return (
    <Router history={history}>
      <Route path='/' component={DefaultLayout}>
        <IndexRoute component={ReadyPage} />
        <Route path='video' component={VideoPage} />
        <Route path='reviews/:reviewId' component={ReviewPage} />
      </Route>
      <Route path='/auth' component={LoginLayout}>
        <IndexRoute component={LoginPage} />
        <Route path='register' component={RegistrationPage} />
        <Route path='forgot' component={ForgotPasswordPage} />
        <Route path='reset' component={ResetPasswordPage} />
      </Route>
      <Route path='*' component={LoginLayout}>
        <IndexRoute component={NotFoundPage} />
      </Route>
    </Router>
  )
}
