const webpack = require('webpack');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'public');
const DIST_DIR = path.join(__dirname, 'public');

const config = {
  devtool: 'inline-sourcemap',
  resolve: {
    root: __dirname,
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx']
  },
  entry: [path.join(SRC_DIR, 'index.jsx')],
  output: {
    path: DIST_DIR,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: SRC_DIR,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
};

module.exports = config;
