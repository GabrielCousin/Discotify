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
  description: 'Discotify is a tool that helps you export your Discogs record collection to Spotify.',
  lang: 'en',
  start_url: '/',
  display: 'standalone',
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
    filename: '[name].[hash].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }, {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  'postcss-nested',
                  'autoprefixer'
                ]
              }
            }
          }
        ]
      }, {
        test: /\.(woff|woff2|svg|png|jpg)$/,
        loader: 'file-loader'
      }
    ]
  },
  resolve: {
    alias: {
      'api-actions': path.resolve(__dirname, 'src/api-actions/'),
      components: path.resolve(__dirname, 'src/components/'),
      public: path.resolve(__dirname, 'public/')
    }
  },
  plugins: [
    HtmlWebpackPluginConfig,
    ManifestPluginConfig
  ]
}
