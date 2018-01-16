import React from 'react'
import { Link } from 'react-router-dom'

const Fragment = React.Fragment;

function Splash () {
  return (
    <Fragment>
      <div className="Hero">
        <p className="Hero-Paragraph">Export your Discogs collection to Spotify</p>
        <Link className="Button" to='/match'>Begin</Link>
      </div>
    </Fragment>
  )
}

export default Splash
