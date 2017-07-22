import React, { Component } from 'react';
import './App.css';
import OAuth from 'oauth-1.0a';

import { DISCOGS_REQUEST_TOKEN_ENDPOINT, DISCOGS_ACCESS_TOKEN_ENDPOINT, generateDiscogsRequestTokenUrl } from './dicts/endpoints'
import { DISCOGS_CONSUMER_KEY, DISCOGS_CONSUMER_SECRET } from './config/settings'

class App extends Component {

  handleDiscogsConnect() {
    const params = {
      oauth_consumer_key: DISCOGS_CONSUMER_KEY,
      oauth_signature: DISCOGS_CONSUMER_SECRET,
      oauth_nonce: Math.random().toString(),
      oauth_signature_method: 'PLAINTEXT',
      oauth_callback: encodeURIComponent('http://localhost:3000'),
      oauth_timestamp: Date.now(),
    }

    const paramsKeys = Object.keys(params);
    let paramStr = '';

    for (let i = 0; i < paramsKeys.length; i++) {
      const key = paramsKeys[i]
      const param = params[key]
      paramStr = `${paramStr}${key}=${param}&`
    }

    fetch(
      `${DISCOGS_REQUEST_TOKEN_ENDPOINT}?${paramStr}`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    ).then((response) => {
      return response.text();
    }).then((data) => {
      const fetchedParams = new URLSearchParams(data);
      const secret = fetchedParams.get('oauth_token_secret')
      const token = fetchedParams.get('oauth_token')

      localStorage.setItem('discogs_token', token)
      localStorage.setItem('discogs_token_secret', secret)
      const newUrl = generateDiscogsRequestTokenUrl(token);
      window.location.assign(newUrl);
    })
  }

  handleReset () {
    localStorage.clear()
    window.location.assign('/');
  }

  handleConfirmDiscogsConnect () {
    const params = {
      oauth_consumer_key: DISCOGS_CONSUMER_KEY,
      oauth_signature: `${DISCOGS_CONSUMER_SECRET}${localStorage.getItem('discogs_token_secret')}`,
      oauth_nonce: Math.random().toString(),
      oauth_signature_method: 'PLAINTEXT',
      oauth_timestamp: Date.now(),
    }

    const paramsKeys = Object.keys(params);
    let paramStr = `${window.location.search}&`;

    for (let i = 0; i < paramsKeys.length; i++) {
      const key = paramsKeys[i]
      const param = params[key]
      paramStr = `${paramStr}${key}=${param}&`
    }

    fetch(
      `${DISCOGS_ACCESS_TOKEN_ENDPOINT}${paramStr}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    ).then((response) => {
      return response.text();
    }).then((data) => {
      const fetchedParams = new URLSearchParams(data);
      const secret = fetchedParams.get('oauth_token_secret')
      const token = fetchedParams.get('oauth_token')

      localStorage.setItem('discogs_token', token)
      localStorage.setItem('discogs_token_secret', secret)
    })
  }

  test () {
    const token = {
      key: 'ocKeqGVqZbuPgiqaJbWFERSWKUfMLLjmsyLdOQWT',
      secret: 'uHGDUsZXiGKBcYAjfpvDXeNeCEUlUxEXoGgClxXw'
    };

    var oauth = OAuth({
        consumer: {
          key: 'oBngGVxvHzYIMfwKlWdh',
          secret: 'OQsUbkPNSxdhvOLfLvHcGgQdezCyFDgZ'
        },
        signature_method: 'PLAINTEXT'
    });

    const request_data = {
          url: 'https://api.discogs.com/oauth/identity',
          method: 'GET'
      }


    fetch(
      `https://api.discogs.com/oauth/identity`, {
        headers: {...oauth.toHeader(oauth.authorize(request_data, token))}
      }
    ).then((response) => {
      return response.text();
    }).then((d) => {
      console.log(d)
    })
  }

  render() {
    return (
      <div className="App">
        <h1>Discotify</h1>
        <p>Export your Discogs collection to your Spotify library</p>
        <div className="">
          <button type="button" onClick={this.handleDiscogsConnect}>
            Connect
          </button>
          <button type="button" onClick={this.handleConfirmDiscogsConnect}>
            Confirm
          </button>
          <button type="button" onClick={this.handleReset}>
            Reset
          </button>
          <button type="button" onClick={this.test}>
            TEST
          </button>
        </div>
      </div>
    );
  }
}

export default App;
