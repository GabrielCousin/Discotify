module.exports = {
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
    'Sentry': true
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
    'camelcase': [2, {
      allow: [
        'UNSAFE_componentWillMount',
        'UNSAFE_componentWillReceiveProps'
      ],
      properties: 'never',
      ignoreDestructuring: true
    }],
    'no-mixed-operators': 0
  }
};
