import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchDiscogsAlbums } from '../actions/discogs'
import { searchAlbum } from '../actions/spotify'

const mapStateToProps = (state) => {
  return {
    app: state.app,
    user: state.user,
    releases: state.albums
  }
}

class ReleasesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentReleaseIndex: 0
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.user.discogs_username && !nextProps.releases.length)
      nextProps.dispatch(fetchDiscogsAlbums(nextProps.user.discogs_username))

    if (nextProps.app.release_matching_ready && this.state.currentReleaseIndex < nextProps.releases.length) {
      nextProps.dispatch(searchAlbum(this.state.currentReleaseIndex, this.props.releases[this.state.currentReleaseIndex]))
      this.setState({
        currentReleaseIndex: this.state.currentReleaseIndex + 1
      })
    }
  }

  render () {
    return (
      <ul>
        {this.props.releases.length > 0 && this.props.releases.map((release, i) => (
          <li key={i}>
            {release.spotify_id}
            <p>{release.status}</p>
            <h4>{release.artists}</h4>
            <h5>{release.title}</h5>
            <img alt={release.title} src={release.cover} width="50" height="50" />
          </li>
        ))}
      </ul>
    );
  }
}

export default connect(mapStateToProps)(ReleasesList)
