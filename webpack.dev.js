const merge = require('webpack-merge')
const common = require('./webpack.common')
const webpack = require('webpack')
const config = require('./src/config/settings')

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
    hot: true,
    quiet: true,
    // overlay: true,
    port: 3000,
    watchOptions: {
      ignored: /node_modules/
    }
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
      SEGMENT_ID: `"${SEGMENT_ID}"`
    })
  ],
  optimization: {
    namedModules: true
  }
})
