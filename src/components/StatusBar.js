import React, { useContext } from 'react'
// import { splitIdsInSteps, saveAlbums, completeExport } from '../api-actions/spotify'
import { useObserver } from 'mobx-react'
import { context } from '../store'

const StatusBar = () => {
  const store = useContext(context)

  return useObserver(() => {
    if (store.counts.proceeded === 0) {
      return null
    }

    const isMatching = store.counts.proceeded < store.counts.total
    const isDone = store.isDone
    const isExporting = store.isExporting

    return (
      <div className="Box Box-Footer">
        <div className="Box-Content">
          <div>{store.counts.proceeded}/{store.counts.total} releases processed.</div>
          <div><span className="ItemCount-NOK">{store.counts.ignored} items</span> ignored. <span className="ItemCount-OK">{store.counts.matched} items</span> OK.</div>
        </div>
        {isMatching ? (
          <progress className='ProgressBar' value={store.counts.proceeded} max={store.counts.total} />
        ) : (
          <div className="Box-AddOn">
            {isDone ? (
              <a
                className="Button"
                href="spotify://open.spotify.com/collection/albums"
                rel="noopener noreferrer"
              >All done! Go to Spotify</a>
            ) : (
              <button
                className="Button"
                type="button"
                onClick={store.exportToSpotify}
                disabled={isExporting}
              >Export to Spotify</button>
            )}
          </div>
        )}
      </div>
    )
  })
}

export default StatusBar
