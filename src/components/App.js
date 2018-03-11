import React, { Fragment, Component } from 'react'

import 'normalize.css'
import './App.css'

import DiscogsCallback from './DiscogsCallback'
import DiscogsConnect from './DiscogsConnect'
import Footer from './Footer'
import Logout from './Logout'
import ReleasesList from './ReleasesList';
import Splash from './Splash'
import SpotifyCallback from './SpotifyCallback'
import SpotifyConnect from './SpotifyConnect'
import StatusBar from './StatusBar'

import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import { hot } from 'react-hot-loader'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <h1 className="Logo Hero-Logo">
            <img src="public/svg/logo.svg" />
          </h1>
          <Fragment>
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
          </Fragment>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default hot(module)(App)
