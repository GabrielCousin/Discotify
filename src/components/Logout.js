import React, { useContext } from 'react'
import { Redirect } from 'react-router-dom'
import { context } from '../store'
import { useObserver } from 'mobx-react'

function Logout () {
  const store = useContext(context)

  return useObserver(() => {
    store.logout()

    return (
      <>
        <p>Logging out…</p>
        <Redirect to='/' />
      </>
    )
  })
}

export default Logout
