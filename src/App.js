import React, { Component } from 'react'
import './App.css'

import {
  requestToken,
  generateDiscogsRequestTokenUrl,
  confirmConnect,
  getUserInfo,
  getUserCollection
} from './discogs/api.js'

class App extends Component {

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

  handleReset () {
    localStorage.clear()
    window.location.assign('/')
  }

  handleConfirmDiscogsConnect () {
    confirmConnect().then((data) => {
      const fetchedParams = new URLSearchParams(data);
      const secret = fetchedParams.get('oauth_token_secret')
      const token = fetchedParams.get('oauth_token')

      localStorage.setItem('discogs_token', token)
      localStorage.setItem('discogs_token_secret', secret)
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

  render() {
    return (
      <div className="App">
        <h1>Discotify</h1>
        <p>Export your Discogs collection to your Spotify library</p>
        <div className="">
          <button type="button" onClick={this.handleDiscogsConnect}>
            Connect
          </button>
          <button type="button" onClick={this.handleConfirmDiscogsConnect}>
            Confirm
          </button>
          <button type="button" onClick={this.handleReset}>
            Reset
          </button>
          <button type="button" onClick={this.handleGetUserInfo}>
            User info
          </button>
          <button type="button" onClick={this.handleGetCollectionItems}>
            Collection Items
          </button>
        </div>
        <a target="_black" href="https://www.discogs.com/settings/applications">Manage Discogs Access</a>
      </div>
    );
  }
}

export default App;
