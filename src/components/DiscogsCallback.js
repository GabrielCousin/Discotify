import React, { useContext, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { useObserver } from 'mobx-react'
import { context } from '../store'

const DiscogsCallback = () => {
  const store = useContext(context)

  return useObserver(() => {
    useEffect(() => {
      store.confirmDiscogsConnect()
    }, [])

    if (store.user.discogsAuthDate) {
      return (
        <Redirect to='/match' />
      )
    }

    return (
      <p>Redirecting to your application…</p>
    )
  })
}

export default DiscogsCallback
