import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';

import { fetchUserInfo, requestToken } from '../actions/discogs'

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

class DiscogsConnect extends Component {
  constructor(props) {
    super(props);
    this.handleDiscogsConnect = this.handleDiscogsConnect.bind(this);
  }

  componentWillMount () {
    this.props.dispatch(fetchUserInfo())
  }

  handleDiscogsConnect() {
    this.props.dispatch(requestToken())
  }

  render () {
    return (
      <Fragment>
        <div className={this.props.user.discogs_id ? 'Box Box--connected' : 'Box Box--disconnected' }>
          <div className="Box-Content">
            <h3 className={this.props.user.discogs_id ? 'Box-Title Box-Title--connected' : 'Box-Title' }>First, connect to Discogs</h3>
            <p className="Box-Description">Collection folders are not supported</p>
          </div>
          <div className="Box-AddOn">
            {this.props.user.discogs_id ?
              <button className="Button Button--outline" type="button" disabled>
                Connected
              </button>
            :
              <button className="Button" type="button" onClick={this.handleDiscogsConnect}>
                Connect
              </button>
            }
          </div>
        </div>
      </Fragment>
    );
  }
}

DiscogsConnect.propTypes = {
  user: PropTypes.shape({
    discogs_id: PropTypes.number
  }),
  dispatch: PropTypes.func
}

export default connect(mapStateToProps)(DiscogsConnect)
