import React from 'react'
import { Link } from 'react-router-dom'

const Fragment = React.Fragment;

function Splash () {
  return (
    <Fragment>
      <h2>On-site? No take away!</h2>
      <p>For Discogs users who don’t listen to music only in their house but also outside.</p>
      <p>Export your Discogs collection to Spotify (moar coming soon!)</p>
      <Link to='/match'>Begin</Link>
    </Fragment>
  )
}

export default Splash
