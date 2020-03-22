import React from 'react'
import { Redirect } from 'react-router-dom'

function Logout () {
  localStorage.clear()

  return (
    <>
      <p>Logging out…</p>
      <Redirect to='/' />
    </>
  )
}

export default Logout
