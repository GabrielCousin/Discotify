import React, { useContext, useEffect } from 'react'
import { context } from '../store'
import { useObserver } from 'mobx-react'

import {
  requestToken
} from '../api-actions/spotify'

const SpotifyConnect = () => {
  const store = useContext(context)

  return useObserver(() => {
    useEffect(() => {
      store.fetchSpotifyUser()
    }, [])

    const user = store.user

    return (
      <div className={user.spotifyUserId ? 'Box Box--connected' : 'Box Box--disconnected'}>
        <div className="Box-Content">
          <h3 className={user.spotifyUserId ? 'Box-Title Box-Title--connected' : 'Box-Title'}>Now, connect to Spotify</h3>
          <p className="Box-Description">Releases will be exported in your albums</p>
        </div>
        <div className="Box-AddOn">
          {user.spotifyUserId
            ? <button className="Button Button--outline" type="button" disabled>
              Connected
            </button>
            : <button className="Button" type="button" onClick={requestToken}>
              Connect
            </button>
          }
        </div>
      </div>
    )
  })
}

export default SpotifyConnect
