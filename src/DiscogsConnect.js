import React, { Component } from 'react'

import {
  requestToken,
  generateDiscogsRequestTokenUrl,
  getUserInfo,
  getUserCollection
} from './discogs/api.js'

class DiscogsConnect extends Component {
  handleDiscogsConnect() {
    requestToken().then((data) => {
      const fetchedParams = new URLSearchParams(data);
      const secret = fetchedParams.get('oauth_token_secret')
      const token = fetchedParams.get('oauth_token')

      localStorage.setItem('discogs_token', token)
      localStorage.setItem('discogs_token_secret', secret)
      const newUrl = generateDiscogsRequestTokenUrl(token)
      window.location.assign(newUrl)
    })
  }

  handleGetUserInfo () {
    const token = {
      key: localStorage.getItem('discogs_token'),
      secret: localStorage.getItem('discogs_token_secret')
    };

    getUserInfo(token).then((userInfo) => {
      localStorage.setItem('discogs_username', userInfo.username)
      console.log(userInfo)
    })
  }

  handleGetCollectionItems () {
    const token = {
      key: localStorage.getItem('discogs_token'),
      secret: localStorage.getItem('discogs_token_secret')
    }

    const username = localStorage.getItem('discogs_username')

    getUserCollection(username, token).then((userCollection) => { console.log(userCollection) })
  }

  render () {
    return (
      <div className="">
        <h3>First, connect to Discogs</h3>
        <p>We will grab your collection and add some Perlinpinpin powder</p>
        {this.props.isAuthenticated ?
          <button type="button" disabled>
            Connected
          </button>
        :
          <button type="button" onClick={this.handleDiscogsConnect}>
            Connect
          </button>
        }

        <button type="button" onClick={this.handleGetUserInfo}>
          Log user info
        </button>
        <button type="button" onClick={this.handleGetCollectionItems}>
          Log collection Items
        </button>
      </div>
    );
  }

}

export default DiscogsConnect;
