var __DEV = (process.env.DEV === 'true');

var entry = {};
entry.nilla = './src/main.babel.js';
if (__DEV) {
  entry.preview = ['webpack/hot/dev-server', './preview/preview.babel.js'];
}

module.exports = {
  entry: entry,
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
      { test: /\.json$/, loader: 'json-loader' },
    ]
  },
  resolve: {
    extensions: ['', '.babel.js', '.js', '.json']
  }
};
