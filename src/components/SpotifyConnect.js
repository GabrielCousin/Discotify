import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  fetchUserInfo,
  requestToken
} from '../actions/spotify'

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

class SpotifyConnect extends Component {
  constructor(props) {
    super(props);
    this.handleSpotifyConnect = this.handleSpotifyConnect.bind(this);
  }

  componentWillMount () {
    this.props.dispatch(fetchUserInfo())
  }

  handleSpotifyConnect() {
    this.props.dispatch(requestToken())
  }

  render () {
    return (
      <div>
        <h3>Now, connect to Spotify</h3>
        <p>We need some rights on your Spotify account to create your Discogs library</p>
        {this.props.user.spotify_id ?
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

export default connect(mapStateToProps)(SpotifyConnect)
