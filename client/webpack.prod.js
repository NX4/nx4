const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  resolveLoader: {
    modules: [path.join(__dirname, 'node_modules')],
  },
  plugins: [
    new webpack.DefinePlugin({
      __ENV__: JSON.stringify('production'),
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      mangle: {
        except: ['$super', '$', 'exports', 'require'],
      },
    }),
  ],
});
