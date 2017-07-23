import React, { Component } from 'react'
import './App.css'

import DiscogsConnect from './DiscogsConnect'
import DiscogsCallback from './DiscogsCallback'
import Logout from './Logout'

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

class App extends Component {
  discogsConnectWrapper = () => (
    <DiscogsConnect isAuthenticated={this.state.isAuthenticated}/>
  )

  discogsRedirect = () => (
    <DiscogsCallback />
  )

  logoutWrapper = () => (
    <Logout />
  )

  handleAuthCheck () {
    this.setState({
      isAuthenticated: Boolean(localStorage.getItem('discogs_token') && localStorage.getItem('discogs_token_secret'))
    })
  }

  componentWillMount () {
    this.handleAuthCheck()
  }

  componentWillUpdate () {
    this.handleAuthCheck()
  }

  render() {
    return (
      <Router>
        <div className="App">
          <h1>Discotify</h1>
          <p>Export your Discogs collection to your Spotify library</p>
            <div>
              <Route exact path="/logout" component={this.logoutWrapper} />
              <Route exact path="/callback" component={this.discogsRedirect} />
              <Route exact path="/" component={this.discogsConnectWrapper} />
            </div>
            <a target="_black" href="https://www.discogs.com/settings/applications">Manage Discogs Access</a>
            <span> - </span>
            <Link to="/logout">Log out</Link>
        </div>
      </Router>
    );
  }
}

export default App;
