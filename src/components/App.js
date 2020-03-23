import React from 'react'
import {
  Link,
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

import 'normalize.css'
import './App.css'

import DiscogsCallback from './DiscogsCallback'
import DiscogsConnect from './DiscogsConnect'
import Footer from './Footer'
import Logout from './Logout'
import ReleasesList from './ReleasesList'
import Splash from './Splash'
import SpotifyCallback from './SpotifyCallback'
import SpotifyConnect from './SpotifyConnect'
import StatusBar from './StatusBar'
import logoSvg from 'public/svg/logo.svg'

import { hot } from 'react-hot-loader'
import { Provider } from '../store'

const App = () => {
  return (
    <Provider>
      <Router>
        <div className="App">
          <Link alt="Return to homepage" className="Logo Hero-Logo" to="/">
            <img alt="Discotify logo" src={logoSvg} />
          </Link>
          <>
            <Route exact path="/" component={Splash} />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/discogs_callback" component={DiscogsCallback} />
            <Route exact path="/spotify_callback" component={SpotifyCallback} />
            <div className='BoxesContainer'>
              <Route exact path="/match" component={DiscogsConnect} />
              <Route exact path="/match" component={SpotifyConnect} />
              <Route exact path="/match" component={ReleasesList} />
            </div>
            <Route exact path="/match" component={StatusBar} />
          </>
          <Footer />
        </div>
      </Router>
    </Provider>
  )
}

export default hot(module)(App)
