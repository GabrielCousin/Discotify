import React from 'react'
import { Link } from 'react-router-dom'

function Splash () {
  return (
    <footer className="Footer">
      Made by <a className="Link" href="https://twitter.com/GabrielCousin">Gabriel Cousin</a> & <a className="Link" href="https://twitter.com/abroudin">Alexandre Broudin</a> 💋 Öpücük 2018 💋 <a className="Link" href="https://twitter.com/abroudin">Contact</a> 💋
      <Link  className="Link" to="/logout">Log out</Link>
    </footer>
  )
}

export default Splash
