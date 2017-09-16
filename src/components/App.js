import React, { Component } from 'react'
import './App.css'

import DiscogsConnect from './DiscogsConnect'
import DiscogsCallback from './DiscogsCallback'
import SpotifyConnect from './SpotifyConnect'
import SpotifyCallback from './SpotifyCallback'
import ReleasesList from './ReleasesList';
import Logout from './Logout'
import Splash from './Splash'

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <h1>Discotify</h1>
          <div>
            <Route exact path="/" component={Splash} />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/discogs_callback" component={DiscogsCallback} />
            <Route exact path="/spotify_callback" component={SpotifyCallback} />
            <Route exact path="/match" component={DiscogsConnect} />
            <Route exact path="/match" component={SpotifyConnect} />
            <Route exact path="/match" component={ReleasesList} />
          </div>
          <a rel="noopener noreferrer" target="_blank" href="https://www.discogs.com/settings/applications">Manage Discogs Access</a>
          <span> - </span>
          <Link to="/logout">Log out</Link>
        </div>
      </Router>
    );
  }
}

export default App
