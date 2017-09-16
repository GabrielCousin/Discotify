import React from 'react'
import { Link } from 'react-router-dom'

function Splash () {
  return (
    <div>
      <h2>On-site? No take away!</h2>
      <p>For Discogs users who don’t listen to music only in their house but also outside.</p>
      <p>Export your Discogs collection to Spotify (moar coming soon!)</p>
      <Link to='/match'>Begin</Link>
    </div>
  )
}

export default Splash
