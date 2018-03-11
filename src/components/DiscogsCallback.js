import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';

import { confirmConnect } from '../actions/discogs'

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
        <Redirect to='/match' />
      )
    }

    return (
      <p>Redirecting to your application…</p>
    );
  }
}

DiscogsCallback.propTypes = {
  user: PropTypes.shape({
    discogs_auth_date: PropTypes.string
  }),
  dispatch: PropTypes.func
}

export default connect(mapStateToProps)(DiscogsCallback)
