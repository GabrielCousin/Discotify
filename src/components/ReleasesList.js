import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchDiscogsAlbums } from '../actions/discogs'
import { searchAlbum, completeMatch, saveAlbums } from '../actions/spotify'

import './ReleasesList.css'

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
    if (!nextProps.user.discogs_username || nextProps.app.release_export_done)
      return

    if (!nextProps.releases.length)
      nextProps.dispatch(fetchDiscogsAlbums(nextProps.user.discogs_username))

    if (!nextProps.user.spotify_display_name || !nextProps.releases.length)
      return

    if (nextProps.app.release_matching_ready && this.state.currentReleaseIndex < nextProps.releases.length) {
      nextProps.dispatch(searchAlbum(this.state.currentReleaseIndex, this.props.releases[this.state.currentReleaseIndex]))
      this.setState({
        currentReleaseIndex: this.state.currentReleaseIndex + 1
      })
    }

    if (!nextProps.app.release_matching_done && this.state.currentReleaseIndex === nextProps.releases.length)
      nextProps.dispatch(completeMatch())

    if (nextProps.app.release_export_ready) {
      const spotifyIds = [];
      nextProps.releases.forEach(function (release) {
        if (release.status === 'success' && release.spotify_id) {
          spotifyIds.push(release.spotify_id)
        }
      })
      nextProps.dispatch(saveAlbums(spotifyIds))
    }
  }

  render () {
    return (
      <div>
        {this.props.releases.length > 0 &&
          <div>
            <p>You have <strong>{this.props.releases.length}</strong> releases in your library, we will check if the albums exist in Spotify’s database.</p>
            <ul className='releasesList'>
              {this.props.releases.map((release, i) => (
                <li key={i}>
                  {release.spotify_id}
                  <p>{release.status}</p>
                  <h4>{release.artists}</h4>
                  <h5>{release.title}</h5>
                  <img alt={release.title} src={release.cover} width="50" height="50" />
                </li>
              ))}
            </ul>
          </div>
        }
      </div>
    );
  }
}

export default connect(mapStateToProps)(ReleasesList)
