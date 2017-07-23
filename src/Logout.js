import React, { Component } from 'react'

import {
  Redirect
} from 'react-router-dom'

class Logout extends Component {
  componentWillMount () {
    this.handleLogout()
  }

  handleLogout () {
    localStorage.clear()
  }

  render () {
    return (
      <div>
        <p>Logging out…</p>
        <Redirect to='/' />
      </div>
    );
  }

}

export default Logout;
