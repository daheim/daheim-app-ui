import React from 'react'
import {Router, Route, IndexRoute} from 'react-router'
import Helmet from 'react-helmet'

import DefaultLayout from './containers/DefaultLayout'
import ReadyPage from './containers/ReadyPage'
import LessonPage from './containers/LessonPage'
import ProfilePage from './containers/ProfilePage'

import LoginLayout from './containers/LoginLayout'
import LoginPage from './containers/LoginPage'
import RegistrationPage from './containers/RegistrationPage'
import ForgotPasswordPage from './containers/ForgotPasswordPage'
import ResetPasswordPage from './containers/ResetPasswordPage'

import PublicProfilePage from './components/profile/ProfilePage'

import NotFoundPage from './containers/NotFoundPage'

export default function createRouter (history) {
  return (
    <div>
      <Helmet
        defaultTitle='Daheim | Reden. Lernen. Leben.'
        titleTemplate='%s | Daheim'
      />
      <Router history={history}>
        <Route path='/' component={DefaultLayout}>
          <IndexRoute component={ReadyPage} />
          <Route path='lessons/:lessonId' component={LessonPage} />
          <Route path='profile' component={ProfilePage} />
          <Route path='users/:userId' component={PublicProfilePage} />
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
    </div>
  )
}
