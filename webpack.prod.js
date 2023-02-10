const webpack = require('webpack')
const { merge } = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION_ENV: true,
      DISCOGS_CONSUMER_KEY: `"${process.env.DISCOGS_CONSUMER_KEY}"`,
      DISCOGS_CONSUMER_SECRET: `"${process.env.DISCOGS_CONSUMER_SECRET}"`,
      SPOTIFY_CLIENT_ID: `"${process.env.SPOTIFY_CLIENT_ID}"`,
      SPOTIFY_CLIENT_SECRET: `"${process.env.SPOTIFY_CLIENT_SECRET}"`,
      SENTRY_DSN: `"${process.env.SENTRY_DSN}"`,
      VERSION_HASH: `"discotify#${Date.now()}"`
    })
  ],
  optimization: {
    minimize: true
  }
})
