import React, { useContext, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { useObserver } from 'mobx-react'
import { context } from '../store'

const SpotifyCallback = () => {
  const store = useContext(context)

  return useObserver(() => {
    useEffect(() => {
      store.confirmSpotifyConnect()
    }, [])

    if (store.user.spotifyAuthDate) {
      return (
        <Redirect to='/match' />
      )
    }

    return (
      <p>Redirecting to your application…</p>
    )
  })
}

export default SpotifyCallback
