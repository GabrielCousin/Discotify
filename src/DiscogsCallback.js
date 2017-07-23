import React, { Component } from 'react'

import {
  Redirect
} from 'react-router-dom'

import {
  confirmConnect
} from './discogs/api.js'

class DiscogsCallback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasConfirmedAuthentication: false
    };
  }

  componentWillMount () {
    this.handleConfirmDiscogsConnect()
  }

  handleConfirmDiscogsConnect () {
    confirmConnect().then((data) => {
      const fetchedParams = new URLSearchParams(data);
      const secret = fetchedParams.get('oauth_token_secret')
      const token = fetchedParams.get('oauth_token')

      localStorage.setItem('discogs_token', token)
      localStorage.setItem('discogs_token_secret', secret)

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

export default DiscogsCallback;
