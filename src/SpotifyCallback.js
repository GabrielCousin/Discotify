import React, { Component } from 'react'

import {
  Redirect
} from 'react-router-dom'

import {
  requestToken
} from './spotify/api'

const queryString = require('query-string');

class SpotifyCallback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasConfirmedAuthentication: false
    };
  }

  componentWillMount () {
    this.handleRequestSpotifyToken()
  }

  handleRequestSpotifyToken () {
    const { code } = queryString.parse(window.location.search);
    requestToken(code).then(({access_token, expires_in, refresh_token}) => {
      localStorage.setItem('spotify_access_token', access_token)
      localStorage.setItem('spotify_expires_in', expires_in)
      localStorage.setItem('spotify_refresh_token', refresh_token)

      this.setState({
        hasConfirmedAuthentication: true
      });
    })
  }

  render () {
    if (this.state.hasConfirmedAuthentication) {
      return (
        <Redirect to='/' />
      )
    }

    return (
      <p>Redirecting to your application…</p>
    );
  }

}

export default SpotifyCallback;
