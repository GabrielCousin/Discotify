import React from 'react'
import { Link } from 'react-router-dom'

function Splash () {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="Footer">
      Made by <a className="Link" href="https://twitter.com/GabrielCousin">Gabriel Cousin</a> & <a className="Link" href="https://twitter.com/abroudin">Alexandre Broudin</a> 💋 Öpücük {currentYear} 💋 <a className="Link" href="https://twitter.com/abroudin">Contact</a> 💋
      <Link className="Link" to="/logout">Log out</Link>
    </footer>
  )
}

export default Splash
