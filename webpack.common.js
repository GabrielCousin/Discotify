const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './public/index.html',
  filename: 'index.html',
  favicon: path.resolve('public/favicon.ico'),
  inject: 'body'
})

const ManifestPluginConfig = new WebpackPwaManifest({
  name: 'Discotify',
  short_name: 'Discotify',
  description: 'Export your Discogs library to Spotify',
  lang: 'en',
  start_url: '/',
  display: 'standalone',
  start_url: './index.html',
  theme_color: '#ffffff',
  background_color: '#ffffff',
  // icons: [
  //   {
  //     'src': path.resolve('public/favicon.ico'),
  //     'sizes': '192x192',
  //     'type': 'image/png'
  //   }
  // ],
  ios: true
})

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve('dist'),
    filename: '[name].[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      }, {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader'
        ]
      }, {
        test: /\.(woff|woff2|svg|png|jpg)$/,
        loader: 'file-loader'
      }
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components/'),
      public: path.resolve(__dirname, 'public/')
    }
  },
  plugins: [
    HtmlWebpackPluginConfig,
    ManifestPluginConfig
  ]
}
