import React, { useContext, useEffect } from 'react'
import { context } from '../store'
import { useObserver } from 'mobx-react'

const ReleasesList = () => {
  const store = useContext(context)

  return useObserver(() => {
    useEffect(() => {
      store.matchReleases()
    }, [store.isConnected])

    const releases = store.releases

    if (!releases.length) {
      return null
    }

    return (
      <div className="Box Box--ReleaseList">
        <h3 className="Box-Title">Matching your Discogs library with Spotify</h3>
        <p className="Box-Description">You have <strong>{releases.length}</strong> releases in your library, we will check if the albums exist in Spotify’s database.</p>
        <ul className='List Box-List--releases'>
          {releases.map((release) => (
            <li className={'Item List-Item Item--' + release.status} key={release.id}>
              <img className="Item-Image" alt={release.title} src={release.thumb} />
              <h4 className="Item-Title">{release.artists} - {release.title}</h4>
              <span className={'Item-Status Item-Status--' + release.status}></span>
            </li>
          ))}
        </ul>
      </div>
    )
  })
}

export default ReleasesList
