webpack = require('webpack');
var __DEV = (process.env.DEV === 'true');

var entry = {};
var plugins = [];
entry.nilla = './src/main.babel.js';
if (__DEV) {
  entry.preview = './preview/preview.babel.js';
} else {
  plugins.push( new webpack.optimize.UglifyJsPlugin() );
}

module.exports = {
  entry: entry,
  plugins: plugins,
  output: {
    path: './build/',
    publicPath: '/webpack-memory/',
    filename: '[name].js',
    library: 'polySolvePage',
    libraryTarget: 'var'
  },
  debug: __DEV,
  devtool: (__DEV ? 'cheap-module-eval-source-map' : null),
  module: {
    loaders: [
      { test: /\.babel\.js$/, loader: 'babel-loader' },
      { test: /\.jsx$/, loader: 'babel-loader' },
      { test: /\.json$/, loader: 'json-loader' },
    ]
  },
  resolve: {
    extensions: ['', '.babel.js', '.jsx', '.js', '.json']
  }
};
