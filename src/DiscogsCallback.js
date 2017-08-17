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
    confirmConnect().then(({oauth_token_secret, oauth_token}) => {
      localStorage.setItem('discogs_token', oauth_token)
      localStorage.setItem('discogs_token_secret', oauth_token_secret)

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
