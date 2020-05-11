import React, { createContext } from 'react'
import { useLocalStore } from 'mobx-react'
import {
  confirmConnect as _confirmDiscogsConnect,
  fetchUserInfo as _fetchDiscogsUser,
  fetchAlbums
} from 'api-actions/discogs'
import {
  fetchUserInfo as _fetchSpotifyUser,
  searchAlbum,
  saveAlbums
} from 'api-actions/spotify'

export const context = createContext()

export const Provider = ({ children }) => {
  const store = useLocalStore(() => ({
    user: {},
    releases: [],
    counts: {
      total: 0,
      proceeded: 0,
      ignored: 0,
      matched: 0
    },

    logout () {
      localStorage.clear()
      store.user = {}
      store.releases = []
      store.counts.total = 0
      store.counts.proceeded = 0
      store.counts.ignored = 0
      store.counts.matched = 0
      store.isDone = false
      store.isExporting = false
    },

    get isConnected () {
      return store.user.discogsUserId && store.user.spotifyUserId
    },

    isDone: false,
    isExporting: false,

    async fetchDiscogsUser () {
      const {
        discogsUsername,
        discogsUserId
      } = await _fetchDiscogsUser()

      store.user.discogsUsername = discogsUsername
      store.user.discogsUserId = discogsUserId
    },

    async confirmDiscogsConnect () {
      const { discogsAuthDate } = await _confirmDiscogsConnect()
      store.user.discogsAuthDate = discogsAuthDate
    },

    async fetchSpotifyUser () {
      const {
        spotifyDisplayName,
        spotifyUserId
      } = await _fetchSpotifyUser()

      store.user.spotifyDisplayName = spotifyDisplayName
      store.user.spotifyUserId = spotifyUserId
    },

    confirmSpotifyConnect () {
      const hash = document.location.hash.substr(1)
      const params = new URLSearchParams(hash)

      localStorage.setItem('spotify_access_token', params.get('access_token'))
      localStorage.setItem('spotify_expires_in', params.get('expires_in'))

      store.user.spotifyAuthDate = new Date().toJSON()
    },

    async matchReleases () {
      if (!store.isConnected) {
        return
      }

      const releases = await fetchAlbums(store.user.discogsUsername)
      store.counts.total = releases.length

      for (const album of releases) {
        let status
        let artists = album.basic_information.artists.map(artist => (artist.name)).join(' ')
        const dirtyArtistName = artists.match(/\s\([0-9]+\)$/)

        if (dirtyArtistName) {
          artists = artists.slice(0, dirtyArtistName.index)
        }

        const query = `artist:${artists.toLowerCase()} album:${album.basic_information.title.toLowerCase()}`

        const { id, uri } = await searchAlbum(query)

        if (id && uri) {
          status = 'success'
          store.counts.matched++
        } else {
          status = 'fail'
          store.counts.ignored++
        }

        store.releases.push({
          artists,
          id: album.id,
          spotifyId: id,
          cover: album.basic_information.cover_image,
          spotifyUri: uri,
          status,
          title: album.basic_information.title,
          thumb: album.basic_information.thumb || '/public/no-cover.png',
          year: album.basic_information.year
        })

        store.counts.proceeded++
      }
    },

    async exportToSpotify () {
      store.isExporting = true

      const CHUNK_SIZE = 20
      const total = Math.ceil(store.counts.matched / CHUNK_SIZE)
      const ids = store.releases.reduce(function (acc, release) {
        if (release.spotifyId) {
          acc.push(release.spotifyId)
        }
        return acc
      }, [])

      for (let i = 0; i < total; i++) {
        const end = i + 1 === total ? ids.length : (i + 1) * CHUNK_SIZE
        await saveAlbums(ids.slice(i * CHUNK_SIZE, end))
      }

      store.isDone = true
      store.isExporting = false
    }
  }))

  return (
    <context.Provider value={store}>{children}</context.Provider>
  )
}
