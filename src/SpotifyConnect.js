import React, { Component } from 'react'

import {
  generateRequestAuthorizationUrl,
  // generateDiscogsRequestTokenUrl,
  getUserInfo,
  // getUserCollection
} from './spotify/api'

class SpotifyConnect extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount () {
    this.handleGetUserInfo()
  }

  handleGetUserInfo () {
    const token = localStorage.getItem('spotify_access_token');

    getUserInfo(token).then((userInfo) => {
      console.log(userInfo)
    })
  }


  handleSpotifyConnect() {
    const newUrl = generateRequestAuthorizationUrl();
    window.location.assign(newUrl)
  }

  render () {
    return (
      <div>
        <h3>Now, connect to Spotify</h3>
        <p>We need some rights on your Spotify account to create your Discogs library</p>
        {this.props.isAuthenticated ?
          <button type="button" disabled>
            Connected
          </button>
        :
          <button type="button" onClick={this.handleSpotifyConnect}>
            Connect
          </button>
        }
      </div>
    );
  }

}

export default SpotifyConnect;
