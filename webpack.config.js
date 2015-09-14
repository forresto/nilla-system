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
  module: {
    loaders: [
      { test: /\.babel\.js$/, loader: 'babel-loader' },
      { test: /\.json$/, loader: 'json-loader' },
    ]
  }
};
