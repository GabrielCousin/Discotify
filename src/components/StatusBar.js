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
    this.handleSpotifyExport = this.handleSpotifyExport.bind(this)
  }

  handleSpotifyExport () {
    this.props.dispatch(startExport())
  }

  render () {
    let processedReleases = this.props.releases.filter((rlz) => (rlz.status === 'fail' || rlz.status === 'success')).length
    let ignoredReleases = this.props.releases.filter((rlz) => (rlz.status === 'fail')).length
    let succeedReleases = this.props.releases.filter((rlz) => (rlz.status === 'success')).length

    return (
      <div className={`Box Box-Footer ${processedReleases ? '' : 'Box--hidden'}`}>
        <div className="Box-Content">
          <div>{processedReleases}/{this.props.releases.length} releases processed.</div>
          <div><span className="ItemCount-NOK">{ignoredReleases} items</span> ignored. <span className="ItemCount-OK">{succeedReleases} items</span> OK.</div>
        </div>
        {!this.props.app.release_matching_done &&
          <progress className='ProgressBar' value={processedReleases} max={this.props.releases.length} />
        }
        {this.props.app.release_matching_done &&
          <div className="Box-AddOn">
            <button
              className={`Button ${this.props.app.release_export_done ? 'Button--hidden' : ''}`}
              type="button"
              onClick={this.handleSpotifyExport}
              disabled={this.props.app.release_export_done}
            >Export to Spotify</button>
            <a
              className={`Button ${this.props.app.release_export_done ? '' : 'Button--hidden'}`}
              href="https://open.spotify.com/collection/albums"
              target="_blank"
              rel="noopener noreferrer"
            >All done! Go to Spotify</a>
          </div>
        }
      </div>
    );
  }
}

export default connect(mapStateToProps)(StatusBar)
