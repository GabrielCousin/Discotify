import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

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
  constructor (props) {
    super(props)
    this.handleSpotifyConnect = this.handleSpotifyConnect.bind(this)
  }

  UNSAFE_componentWillMount () {
    this.props.dispatch(fetchUserInfo())
  }

  handleSpotifyConnect () {
    requestToken()
  }

  render () {
    return (
      <div className={this.props.user.spotify_id ? 'Box Box--connected' : 'Box Box--disconnected' }>
        <div className="Box-Content">
          <h3 className={this.props.user.spotify_id ? 'Box-Title Box-Title--connected' : 'Box-Title' }>Now, connect to Spotify</h3>
          <p className="Box-Description">Releases will be exported in your albums</p>
        </div>
        <div className="Box-AddOn">
          {this.props.user.spotify_id
            ? <button className="Button Button--outline" type="button" disabled>
              Connected
            </button>
            : <button className="Button" type="button" onClick={this.handleSpotifyConnect}>
              Connect
            </button>
          }
        </div>
      </div>
    )
  }
}

SpotifyConnect.propTypes = {
  user: PropTypes.shape({
    spotify_id: PropTypes.string
  }),
  dispatch: PropTypes.func
}

export default connect(mapStateToProps)(SpotifyConnect)
