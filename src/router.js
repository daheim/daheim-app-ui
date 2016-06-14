import React from 'react'
import {Router, Route, IndexRoute} from 'react-router'
import Helmet from 'react-helmet'

import DefaultLayout from './containers/DefaultLayout'
import ReadyPage from './containers/ReadyPage'
import LessonPage from './containers/LessonPage'
import ProfilePage from './containers/ProfilePage'

import AuthLayout from './components/auth/AuthLayout'
import LoginPage from './components/auth/LoginPage'
import RegistrationPage from './components/auth/RegistrationPage'
import ForgotPasswordPage from './components/auth/ForgotPasswordPage'
import ResetPasswordPage from './components/auth/ResetPasswordPage'
import LogoutPage from './components/auth/LogoutPage'

import AdminPage from './components/admin/AdminPage'

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
          <Route path='admin' component={AdminPage} />
        </Route>

        <Route path='/auth' component={AuthLayout}>
          <IndexRoute component={LoginPage} />
          <Route path='register' component={RegistrationPage} />
          <Route path='forgot' component={ForgotPasswordPage} />
          <Route path='reset' component={ResetPasswordPage} />
          <Route path='logout' component={LogoutPage} />
        </Route>

        <Route path='*' component={AuthLayout}>
          <IndexRoute component={NotFoundPage} />
        </Route>
      </Router>
    </div>
  )
}
