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
      <div className={this.props.user.spotify_id ? 'Box Box--connected' : 'Box Box--disconnected' }>
        <div className="Box-Content">
          <h3 className="Box-Title">Now, connect to Spotify</h3>
          <p className="Box-Description">We need some rights on your Spotify account to create your Discogs library</p>
        </div>
        <div className="Box-AddOn">
          {this.props.user.spotify_id ?
            <button className="Button" type="button" disabled>
              Connected
            </button>
          :
            <button className="Button" type="button" onClick={this.handleSpotifyConnect}>
              Connect
            </button>
          }
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(SpotifyConnect)
