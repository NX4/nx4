const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      __ENV__: JSON.stringify('development'),
    }),
  ],
  devServer: {
    historyApiFallback: true,
    contentBase: path.join(__dirname, 'built'),
    compress: true,
    port: process.env.PORT || 8080,
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
});
