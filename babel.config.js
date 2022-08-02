module.exports = {
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'entry',
      corejs: 3
    }],
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    ['@babel/plugin-transform-runtime', { regenerator: true }]
  ],
  env: {
    development: {
      plugins: [
        'react-refresh/babel'
      ]
    }
  }
}
