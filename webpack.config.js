const path = require('path')
const webpack = require('webpack')
const cmd = require('commander')
const outputdir = path.resolve(__dirname, 'dist')
const HtmlWebpackPlugin = require('html-webpack-plugin')

cmd
  .option('--mode [mode]', '', process.env.NODE_ENV || 'development')
  .option('--debug')
  .parse(process.argv)

const mode = cmd.mode

const opts = {
  entry: {app: './src/app.js'},
  output: {
    filename: '[name]-[chunkhash].js',
    path: outputdir,
    publicPath: '/',
    // show relative paths in sourcemaps
    devtoolModuleFilenameTemplate: '[resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[resource-path]',
    pathinfo: false
  },
  mode,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          cacheCompression: false
        }
      }
    ]
  },
  devServer: {
    contentBase: outputdir,
    open: true,
    overlay: {
      errors: true
    },
    historyApiFallback: true
    // host: '0.0.0.0'
  },
  devtool: mode === 'production' ? 'source-map' : 'source-map',
  optimization: {
    runtimeChunk: 'single'
  },
  plugins: [new HtmlWebpackPlugin({})],
  resolve: {
    modules: [__dirname, 'node_modules'],
    extensions: ['.js']
  },
  resolveLoader: {
    modules: ['node_modules']
  }
}

if (cmd.debug) console.log(opts) // eslint-disable-line no-console

module.exports = opts
