import React, { Component } from 'react'
import { connect } from 'react-redux'
import { startExport } from '../actions/spotify'

const mapStateToProps = (state) => {
  return {
    app: state.app,
    user: state.user,
    releases: state.albums
  }
}

class StatusBar extends Component {
  constructor(props) {
    super(props);
    this.handleSpotifyExport = this.handleSpotifyExport.bind(this);
  }

  handleSpotifyExport () {
    this.props.dispatch(startExport())
  }

  render () {
    let processedReleases = this.props.releases.filter((rlz) => (rlz.status === 'fail' || rlz.status === 'success')).length
    let ignoredReleases = this.props.releases.filter((rlz) => (rlz.status === 'fail')).length

    return (
      <nav>
        <progress value={processedReleases} max={this.props.releases.length} />
        <p><strong>{processedReleases}</strong> on <strong>{this.props.releases.length}</strong> releases processed.</p>
        <p><strong>{ignoredReleases} items</strong> will be ignored.</p>
        <button type="button" onClick={this.handleSpotifyExport} disabled={!this.props.app.release_matching_done}>Export to Spotify</button>
        <span> - </span>
        <a href="https://open.spotify.com/collection/albums" target="_blank" rel="noopener noreferrer">All done! Go to Spotify</a>
      </nav>
    );
  }
}

export default connect(mapStateToProps)(StatusBar)
