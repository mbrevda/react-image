let path = require('path')

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  output: {
    library: 'ReactImageMulti',
    libraryTarget: 'umd'
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.join(__dirname, 'src')],
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}
