import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { splitIdsInSteps, saveAlbums, completeExport } from '../actions/spotify'
import PropTypes from 'prop-types';

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
    this.handleSpotifyExport = this.handleSpotifyExport.bind(this)
    this.state = {
      currentExportStepIndex: 0
    }
  }

  handleSpotifyExport () {
    const spotifyIds = [];
    this.props.releases.forEach(function (release) {
      if (release.status === 'success' && release.spotify_id) {
        spotifyIds.push(release.spotify_id)
      }
    })
    this.props.dispatch(splitIdsInSteps(spotifyIds))
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.app.release_export_done)
      return

    if (this.state.currentExportStepIndex && nextProps.app.export_steps && (nextProps.app.export_steps.length === this.state.currentExportStepIndex))
      return nextProps.dispatch(completeExport())

    if (nextProps.app.release_export_ready && nextProps.app.export_steps && nextProps.app.export_steps.length) {
      const step = nextProps.app.export_steps[this.state.currentExportStepIndex]
      nextProps.dispatch(saveAlbums(step))
      this.setState({
        currentExportStepIndex: this.state.currentExportStepIndex + 1
      })
    }
  }

  render () {
    let processedReleases = this.props.releases.filter((rlz) => (rlz.status === 'fail' || rlz.status === 'success')).length
    let ignoredReleases = this.props.releases.filter((rlz) => (rlz.status === 'fail')).length
    let succeedReleases = this.props.releases.filter((rlz) => (rlz.status === 'success')).length

    let progressValue = this.props.app.release_matching_done ? this.state.currentExportStepIndex : processedReleases
    let progressMax = this.props.app.release_matching_done ?
      (this.props.app.export_steps && this.props.app.export_steps.length || 0) :
      this.props.releases.length

    return (
      <Fragment>
        {processedReleases > 0 &&
          <div className="Box Box-Footer">
            <div className="Box-Content">
              <div>{processedReleases}/{this.props.releases.length} releases processed.</div>
              <div><span className="ItemCount-NOK">{ignoredReleases} items</span> ignored. <span className="ItemCount-OK">{succeedReleases} items</span> OK.</div>
            </div>
            {this.props.app.release_process_ongoing &&
              <progress className='ProgressBar' value={progressValue} max={progressMax} />
            }
            {this.props.app.release_matching_done &&
              <div className="Box-AddOn">
                {!this.props.app.release_export_done &&
                  <button
                    className="Button"
                    type="button"
                    onClick={this.handleSpotifyExport}
                    disabled={this.props.app.release_export_done}
                    >Export to Spotify</button>
                }
                {this.props.app.release_export_done &&
                  <a
                    className="Button"
                    href="https://open.spotify.com/collection/albums"
                    target="_blank"
                    rel="noopener noreferrer"
                  >All done! Go to Spotify</a>
                }
              </div>
            }
          </div>
        }
      </Fragment>
    );
  }
}

StatusBar.propTypes = {
  app: PropTypes.shape({
    export_steps: PropTypes.array,
    release_matching_done: PropTypes.bool,
    release_export_ready: PropTypes.bool,
    release_process_ongoing: PropTypes.bool,
    release_export_done: PropTypes.bool
  }),
  releases: PropTypes.array,
  dispatch: PropTypes.func
}

export default connect(mapStateToProps)(StatusBar)
