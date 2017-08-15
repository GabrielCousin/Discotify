import {
  SPOTIFY_REQUEST_AUTHORIZATION_ENDPOINT,
  SPOTIFY_CURRENT_PROFILE_ENDPOINT
} from './endpoints'

import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_OAUTH_CALLBACK
} from '../config/settings'

export function generateRequestAuthorizationUrl() {
  const params = {
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'token',
    redirect_uri: encodeURIComponent(SPOTIFY_OAUTH_CALLBACK),
    state: Math.random().toString(),
    scope: 'user-library-modify',
    show_dialog: true
  }

  const paramsKeys = Object.keys(params);
  let paramStr = '';

  for (let i = 0; i < paramsKeys.length; i++) {
    const key = paramsKeys[i]
    const param = params[key]
    paramStr = `${paramStr}${key}=${param}&`
  }

  return `${SPOTIFY_REQUEST_AUTHORIZATION_ENDPOINT}?${paramStr}`
}

export function getUserInfo (token) {
  let headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Authorization', `Bearer ${token}`);

  return new Promise(function (resolve, reject) {
    fetch(
      SPOTIFY_CURRENT_PROFILE_ENDPOINT, {
        mode: 'cors',
        redirect: 'follow',
        headers
      }
    ).then((response) => {
      return response.text()
    }).then((data) => {
      resolve(JSON.parse(data))
    })
  });
}
