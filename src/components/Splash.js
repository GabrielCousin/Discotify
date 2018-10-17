import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

function Splash () {
  return (
    <Fragment>
      <div className="Hero">
        <h1 className="Hero-Title">Export your Discogs collection to Spotify</h1>
        <h2 className="Hero-Subtitle">Discotify is a tool that helps you export your Discogs record collection to Spotify.</h2>
        <Link className="Button" to='/match'>Begin</Link>
      </div>
    </Fragment>
  )
}

export default Splash
