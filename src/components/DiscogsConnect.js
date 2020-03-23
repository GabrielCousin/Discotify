import React, { Fragment, useContext, useEffect } from 'react'
import { context } from '../store'
import { useObserver } from 'mobx-react'

import { requestToken } from '../api-actions/discogs'

const DiscogsConnect = () => {
  const store = useContext(context)

  return useObserver(() => {
    useEffect(() => {
      store.fetchDiscogsUser()
    }, [])

    return (
      <Fragment>
        <div className={store.user.discogsUserId ? 'Box Box--connected' : 'Box Box--disconnected' }>
          <div className="Box-Content">
            <h3 className={store.user.discogsUserId ? 'Box-Title Box-Title--connected' : 'Box-Title' }>First, connect to Discogs</h3>
            <p className="Box-Description">Collection folders are not supported</p>
          </div>
          <div className="Box-AddOn">
            {store.user.discogsUserId
              ? <button className="Button Button--outline" type="button" disabled>
                Connected
              </button>
              : <button className="Button" type="button" onClick={requestToken}>
                Connect
              </button>
            }
          </div>
        </div>
      </Fragment>
    )
  })
}

export default DiscogsConnect
