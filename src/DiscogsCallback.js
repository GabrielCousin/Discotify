import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import { confirmConnect } from './actions/discogs'

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

class DiscogsCallback extends Component {

  componentWillMount () {
    this.props.dispatch(confirmConnect())
  }

  render () {
    if (this.props.user.discogs_auth_date) {
      return (
        <Redirect to='/' />
      )
    }

    return (
      <p>Redirecting to your application…</p>
    );
  }

}

export default connect(mapStateToProps)(DiscogsCallback);
