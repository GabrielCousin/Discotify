import React, { Component } from 'react'

import {
  generateRequestAuthorizationUrl,
  getUserInfo
  // searchAlbum,
  // saveAlbums
} from './spotify/api'

class SpotifyConnect extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSpotifySearch = this.handleSpotifySearch.bind(this);
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

  handleInputChange(event) {
    this.setState({
      query: event.currentTarget.value
    })
  }

  handleSpotifySearch () {
    // const token = localStorage.getItem('spotify_access_token');
    // searchAlbum(token, this.state.query).then((data) => {
    //   const ids = [data.albums.items[0].id]
    //   saveAlbums(token, ids).then((data) => {})
    // })
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
        <input type="text" onChange={this.handleInputChange} />
        <button type="button" onClick={this.handleSpotifySearch}>
          Search
        </button>
      </div>
    );
  }

}

export default SpotifyConnect;
