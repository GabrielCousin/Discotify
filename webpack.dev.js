const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const webpack = require('webpack')

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
      ignored: /node_modules/,
    }
  },
  performance: {
    hints: false,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'PRODUCTION_ENV': false
    })
  ],
  optimization: {
    namedModules: true
  }
})
