import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchDiscogsAlbums } from './actions/discogs'

const mapStateToProps = (state) => {
  return {
    user: state.user,
    releases: state.albums
  }
}

class ReleasesList extends Component {

  componentWillReceiveProps (nextProps) {
    if (nextProps.user.discogs_username && !nextProps.releases.length)
      nextProps.dispatch(fetchDiscogsAlbums(nextProps.user.discogs_username))
  }

  render () {
    return (
      <ul>
        {this.props.releases.length > 0 && this.props.releases.map((release, i) => (
          <li key={i}>
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

export default connect(mapStateToProps)(ReleasesList);
