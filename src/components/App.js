import React, { Component } from 'react'
import './App.css'

import DiscogsConnect from './DiscogsConnect'
import DiscogsCallback from './DiscogsCallback'
import SpotifyConnect from './SpotifyConnect'
import SpotifyCallback from './SpotifyCallback'
import ReleasesList from './ReleasesList';
import Logout from './Logout'

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
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/discogs_callback" component={DiscogsCallback} />
            <Route exact path="/spotify_callback" component={SpotifyCallback} />
            <Route exact path="/" component={DiscogsConnect} />
            <Route exact path="/" component={SpotifyConnect} />
            <Route exact path="/" component={ReleasesList} />
          </div>
          <a target="_black" href="https://www.discogs.com/settings/applications">Manage Discogs Access</a>
          <span> - </span>
          <Link to="/logout">Log out</Link>
        </div>
      </Router>
    );
  }
}

export default App
