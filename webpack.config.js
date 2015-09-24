__DEV = (process.env.DEV === 'true');

module.exports = {
  entry: {
    nilla: './src/main.babel.js',
    preview: ['webpack/hot/dev-server', './preview/preview.babel.js']
  },
  output: {
    path: './',
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
