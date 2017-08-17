import React, { Component } from 'react'

import {
  requestToken,
  generateDiscogsRequestTokenUrl,
  getUserInfo,
  getUserCollection
} from './discogs/api'

import ReleasesList from './ReleasesList';

class DiscogsConnect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      releases: []
    };

    this.handleGetCollectionItems = this.handleGetCollectionItems.bind(this);
  }

  componentWillMount () {
    this.handleGetUserInfo()
  }

  handleDiscogsConnect() {
    requestToken().then(({oauth_token, oauth_token_secret}) => {
      localStorage.setItem('discogs_token', oauth_token)
      localStorage.setItem('discogs_token_secret', oauth_token_secret)
      window.location.assign(generateDiscogsRequestTokenUrl(oauth_token))
    })
  }

  handleGetUserInfo () {
    const token = {
      token: localStorage.getItem('discogs_token'),
      token_secret: localStorage.getItem('discogs_token_secret')
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

    getUserCollection(username, token).then((userCollection) => {
      console.log(userCollection)
      this.setState({
        releases: userCollection
      })
    })
  }

  render () {
    return (
      <div>
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

        <button type="button" onClick={this.handleGetCollectionItems}>
          Log collection Items
        </button>
        <ReleasesList releases={this.state.releases} />
      </div>
    );
  }

}

export default DiscogsConnect;
