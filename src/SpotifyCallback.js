import React, { Component } from 'react'

import {
  Redirect
} from 'react-router-dom'

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
    const { access_token, expires_in } = queryString.parse(window.location.hash);

    localStorage.setItem('spotify_access_token', access_token)
    localStorage.setItem('spotify_expires_in', expires_in)

    this.setState({
      hasConfirmedAuthentication: true
    });
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
