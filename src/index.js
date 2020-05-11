import 'core-js/stable'

import React from 'react'
import { render } from 'react-dom'
import App from './components/App'
import { init } from '@sentry/browser'
import { Dedupe, ExtraErrorData } from '@sentry/integrations'

import './index.css'

if (SENTRY_DSN) {
  init({
    dsn: SENTRY_DSN,
    integrations: [
      new Dedupe(),
      new ExtraErrorData()
    ],
    release: VERSION_HASH
  })
}

render(
  <App />,
  document.getElementById('root')
)

// eslint-disable-next-line
!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t,e){var n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var o=document.getElementsByTagName("script")[0];o.parentNode.insertBefore(n,o);analytics.integrationOptions=e};analytics.SNIPPET_VERSION="4.0.1";
  analytics.load(SEGMENT_ID)
  analytics.page()
}
}()
