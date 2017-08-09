import {
  SPOTIFY_REQUEST_AUTHORIZATION_ENDPOINT,
  SPOTIFY_REQUEST_TOKEN_ENDPOINT,
  SPOTIFY_CURRENT_PROFILE_ENDPOINT
} from './endpoints'

import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_OAUTH_CALLBACK
} from '../config/settings'

export function generateRequestAuthorizationUrl() {
  const params = {
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
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


export function requestToken(code) {
  return new Promise(function (resolve, reject) {

    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Authorization', `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`);
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Expose-Headers', '*');
    headers.append('Access-Control-Allow-Headers', '*');

    fetch(
      SPOTIFY_REQUEST_TOKEN_ENDPOINT, {
        method: 'POST',
        mode: 'cors',
        redirect: 'follow',
        headers,
        body: `grant_type=authorization_code&code=${code}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fspotify_callback`
      }
    ).then((response) => {
      return response.json()
    }).then((data) => {
      resolve(data)
    })
  });
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
