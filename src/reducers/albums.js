import { DISCOGS_FETCH_ALBUMS_SUCCESS } from '../dicts/discogs'
import {
  SPOTIFY_SEARCH_ALBUM,
  SPOTIFY_SEARCH_ALBUM_SUCCESS
} from '../dicts/spotify'

const albums = (state = [], {type, data}) => {
  switch (type) {
    case DISCOGS_FETCH_ALBUMS_SUCCESS: {
      const albums = data.map(album => {
        const artists = album.basic_information.artists.map(artist => (artist.name)).join(' ')
        return {
          artists,
          cover: album.basic_information.cover_image,
          status: 'pending',
          title: album.basic_information.title,
          thumb: album.basic_information.thumb,
          query: `artist:${artists.toLowerCase()} album:${album.basic_information.title.toLowerCase()}`,
          year: album.basic_information.year
        }
      })
      return state.concat(albums)
    }

    case SPOTIFY_SEARCH_ALBUM: {
      return [
        ...state.slice(0, data.index),
        Object.assign({}, state[data.index], {
          status: 'loading'
        }),
        ...state.slice(data.index + 1)
      ]
    }

    case SPOTIFY_SEARCH_ALBUM_SUCCESS: {
      if (data.results.length) {
        return [
          ...state.slice(0, data.index),
          Object.assign({}, state[data.index], {
            status: 'success',
            spotify_id: data.results[0].id,
            spotify_uri: data.results[0].uri,
          }),
          ...state.slice(data.index + 1)
        ]
      } else {
        return [
          ...state.slice(0, data.index),
          Object.assign({}, state[data.index], {
            status: 'fail'
          }),
          ...state.slice(data.index + 1)
        ]
      }
    }

    default:
      return state
  }
}

export default albums
