import { DISCOGS_FETCH_ALBUMS_SUCCESS } from '../dicts/discogs'

const albums = (state = [], action) => {
  switch (action.type) {
    case DISCOGS_FETCH_ALBUMS_SUCCESS:
      const albums = action.data.map(album => {
        const artists = album.basic_information.artists.map(artist => (artist.name)).join(', ')
        return {
          artists,
          cover: album.basic_information.cover_image,
          status: 'pending',
          title: album.basic_information.title,
          thumb: album.basic_information.thumb,
          query: `${artists} ${album.basic_information.title}`,
          year: album.basic_information.year
        }
      })
      return state.concat(albums)
    default:
      return state
  }
}

export default albums
