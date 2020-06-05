var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const path = require('path')

if(config.dev.enableHotReload === true) {
// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

baseWebpackConfig.plugins = [    
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin()];
}

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      chunks: ['app'],
      chunksSortMode: 'manual', 
      inject: true
    }),
    new HtmlWebpackPlugin({
      filename: 'callback.html',
      template: path.resolve(__dirname, '../src/auth/callback/callback.html'),
      chunks: ['callback'],
      chunksSortMode: 'manual', 
      inject: true
    }),
    new HtmlWebpackPlugin({
      filename: 'identity.html',
      template: path.resolve(__dirname, '../src/auth/identity/identity.html'),
      chunks: ['identity'],
      chunksSortMode: 'manual', 
      inject: true
    }),
    new HtmlWebpackPlugin({
      filename: 'silent.html',
      template: path.resolve(__dirname, '../src/auth/silent/silent.html'),
      chunks: ['silent'],
      chunksSortMode: 'manual', 
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
})

