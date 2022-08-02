const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const webpack = require('webpack')
const config = require('./src/config/settings')
const ESLintPlugin = require('eslint-webpack-plugin');

const {
  DISCOGS_CONSUMER_KEY,
  DISCOGS_CONSUMER_SECRET,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SEGMENT_ID
} = config

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    historyApiFallback: true,
    port: 3000,
  },
  performance: {
    hints: false
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      PRODUCTION_ENV: false,
      DISCOGS_CONSUMER_KEY: `"${DISCOGS_CONSUMER_KEY}"`,
      DISCOGS_CONSUMER_SECRET: `"${DISCOGS_CONSUMER_SECRET}"`,
      SPOTIFY_CLIENT_ID: `"${SPOTIFY_CLIENT_ID}"`,
      SPOTIFY_CLIENT_SECRET: `"${SPOTIFY_CLIENT_SECRET}"`,
      SEGMENT_ID: `"${SEGMENT_ID}"`,
      SENTRY_DSN: 'null'
    }),
    new ESLintPlugin({
      failOnError: false,
    })
  ],
  optimization: {
    moduleIds: 'named'
  }
})
