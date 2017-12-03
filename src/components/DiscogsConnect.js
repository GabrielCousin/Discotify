import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchUserInfo, requestToken } from '../actions/discogs'

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const Fragment = React.Fragment;

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
        <h3>First, connect to Discogs</h3>
        <p>We will grab your collection and add some Perlinpinpin powder</p>
        {this.props.user.discogs_id ?
          <button type="button" disabled>
            Connected
          </button>
        :
          <button type="button" onClick={this.handleDiscogsConnect}>
            Connect
          </button>
        }
      </Fragment>
    );
  }
}

export default connect(mapStateToProps)(DiscogsConnect)
