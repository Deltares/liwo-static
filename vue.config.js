const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  // transpileDependencies: [ 'delay' ],
  publicPath: process.env.BASE_URL || '/',
  devServer: {
    disableHostCheck: true
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.m?js$/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        L: 'leaflet'
      }),
      new CopyWebpackPlugin([
        { from: 'src/webconfig.js', to: 'webconfig.js' }
      ])
    ],
    externals: {
      './webconfig': 'webconfig'
    },
    entry: {
      vendor: [
        '@babel/polyfill',
        'unfetch/polyfill',
        'url-search-params-polyfill'
      ]
    }
  }
}
