import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { confirmConnect } from '../actions/spotify'

const queryString = require('query-string')

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

class SpotifyCallback extends Component {
  UNSAFE_componentWillMount () {
    this.props.dispatch(confirmConnect())

    const { access_token, expires_in } = queryString.parse(window.location.hash)
    localStorage.setItem('spotify_access_token', access_token)
    localStorage.setItem('spotify_expires_in', expires_in)
  }

  render () {
    if (this.props.user.spotify_auth_date) {
      return (
        <Redirect to='/match' />
      )
    }

    return (
      <p>Redirecting to your application…</p>
    )
  }
}

SpotifyCallback.propTypes = {
  user: PropTypes.shape({
    spotify_auth_date: PropTypes.string
  }),
  dispatch: PropTypes.func
}

export default connect(mapStateToProps)(SpotifyCallback)
