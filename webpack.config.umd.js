let path = require('path')

module.exports = {
  entry: './src/index.js',
  // output: {
  //   path: './umd',
  //   filename: 'index.js'
  // },
  output: {
    library: 'ReactImageMulti',
    libraryTarget: 'umd'
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      include: [
        path.join(__dirname, 'src')
      ],
      loader: 'babel-loader'
    }]
  }
}
