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
  connectWrapper = () => {
    const isAuthenticatedOnSpotify = Boolean(localStorage.getItem('spotify_access_token'))
    return (
      <div>
        <DiscogsConnect />
        <SpotifyConnect isAuthenticated={isAuthenticatedOnSpotify} />
      </div>
    )
  }

  releasesListWrapper = () => (
    <ReleasesList />
  )

  discogsRedirect = () => (
    <DiscogsCallback />
  )

  spotifyRedirect = () => (
    <SpotifyCallback />
  )

  logoutWrapper = () => (
    <Logout />
  )

  render() {
    return (
      <Router>
        <div className="App">
          <h1>Discotify</h1>
          <p>Export your Discogs collection to your Spotify library</p>
            <div>
              <Route exact path="/logout" component={this.logoutWrapper} />
              <Route exact path="/discogs_callback" component={this.discogsRedirect} />
              <Route exact path="/spotify_callback" component={this.spotifyRedirect} />
              <Route exact path="/" component={this.connectWrapper} />
              <Route exact path="/" component={this.releasesListWrapper} />
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
