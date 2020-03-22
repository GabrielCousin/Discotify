import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { fetchDiscogsAlbums } from '../actions/discogs'
import { searchAlbum, completeMatch } from '../actions/spotify'

import './ReleasesList.css'

const mapStateToProps = (state) => {
  return {
    app: state.app,
    user: state.user,
    releases: state.albums
  }
}

class ReleasesList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentReleaseIndex: 0
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (!nextProps.user.discogs_username || nextProps.app.release_export_done) { return }

    if (!nextProps.releases.length) { nextProps.dispatch(fetchDiscogsAlbums(nextProps.user.discogs_username)) }

    if (!nextProps.user.spotify_display_name || !nextProps.releases.length) { return }

    if (nextProps.app.release_matching_ready && this.state.currentReleaseIndex < nextProps.releases.length) {
      nextProps.dispatch(searchAlbum(this.state.currentReleaseIndex, this.props.releases[this.state.currentReleaseIndex]))
      this.setState({
        currentReleaseIndex: this.state.currentReleaseIndex + 1
      })
    }

    if (!nextProps.app.release_matching_done && this.state.currentReleaseIndex === nextProps.releases.length) { nextProps.dispatch(completeMatch()) }
  }

  render () {
    return (
      <div className="Box Box--ReleaseList">
        {this.props.releases.length > 0 &&
          <Fragment>
            <h3 className="Box-Title">Matching your Discogs library with Spotify</h3>
            <p className="Box-Description">You have <strong>{this.props.releases.length}</strong> releases in your library, we will check if the albums exist in Spotify’s database.</p>
            <ul className='List Box-List--releases'>
              {this.props.releases.map((release, i) => (
                <li className={'Item List-Item Item--' + release.status} key={i}>
                  <img className="Item-Image" alt={release.title} src={release.thumb ? release.thumb : '/public/no-cover.png'} />
                  <h4 className="Item-Title">{release.artists} - {release.title}</h4>
                  <span className={'Item-Status Item-Status--' + release.status}></span>
                </li>
              ))}
            </ul>
          </Fragment>
        }
      </div>
    )
  }
}

ReleasesList.propTypes = {
  app: PropTypes.shape({
    release_matching_done: PropTypes.bool,
    release_export_done: PropTypes.bool,
    release_matching_ready: PropTypes.bool
  }),
  user: PropTypes.shape({
    discogs_username: PropTypes.string,
    spotify_display_name: PropTypes.string
  }),
  releases: PropTypes.array,
  dispatch: PropTypes.func
}

export default connect(mapStateToProps)(ReleasesList)
