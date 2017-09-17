import React from 'react'
import { Link } from 'react-router-dom'

function Splash () {
  return (
    <footer>
      <a rel="noopener noreferrer" target="_blank" href="https://www.discogs.com/settings/applications">Manage Discogs Access</a>
      <span> - </span>
      <a rel="noopener noreferrer" target="_blank" href="https://www.spotify.com/account/apps/">Manage Spotify Access</a>
      <span> - </span>
      <Link to="/logout">Log out</Link>
    </footer>
  )
}

export default Splash
