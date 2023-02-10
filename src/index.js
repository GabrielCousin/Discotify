import 'core-js/stable'

import React from 'react'
import { render } from 'react-dom'
import App from './components/App'
import { init } from '@sentry/browser'

import './index.css'

if (SENTRY_DSN) {
  init({
    dsn: SENTRY_DSN,
    release: VERSION_HASH,
    autoSessionTracking: false
  })
}

render(
  <App />,
  document.getElementById('root')
)
