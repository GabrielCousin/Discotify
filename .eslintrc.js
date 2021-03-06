module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  env: {
    node: true,
    browser: true
  },
  globals: {
    'analytics': true,
    'PRODUCTION_ENV': true,
    'DISCOGS_CONSUMER_KEY': true,
    'DISCOGS_CONSUMER_SECRET': true,
    'SPOTIFY_CLIENT_ID': true,
    'SPOTIFY_CLIENT_SECRET': true,
    'SEGMENT_ID': true,
    'SENTRY_DSN': true,
    'VERSION_HASH': true
  },
  extends: [
    'standard',
    'plugin:react/recommended'
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'react/prop-types': 0,
    'camelcase': [2, {
      properties: 'never',
      ignoreDestructuring: true
    }],
    'no-mixed-operators': 0
  }
};
