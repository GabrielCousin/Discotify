import React, { Component } from 'react'
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
  return {
    app: state.app,
    user: state.user,
    releases: state.albums
  }
}

class StatusBar extends Component {
  render () {
    return (
      <div></div>
    );
  }
}

export default connect(mapStateToProps)(StatusBar)
