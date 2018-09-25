const path = require('path'),
  UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
  CleanWebpackPlugin = require('clean-webpack-plugin'),
  webpack = require('webpack'),
  cmd = require('commander'),
  {writeFileSync, mkdirSync, statSync} = require('fs'),
  outputdir = path.resolve(__dirname, 'dist')

const opts = {
  entry: './site/app.js',
  output: {
    filename: '[name]-[chunkhash].js',
    path: outputdir,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devServer: {
    contentBase: outputdir
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin([outputdir]),
    new webpack.optimize.ModuleConcatenationPlugin()
  ],
  resolve: {
    modules: [__dirname, 'node_modules']
  },
  resolveLoader: {
    modules: ['node_modules']
  }
}

if (process.env.NODE_ENV === 'production') {
  opts.plugins.push(
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: true,
      uglifyOptions: {
        compress: {warnings: false}
      }
    })
  )
}

const webpackError = err => {
  /* eslint-disable no-console */
  console.error(err)
  if (err.details) console.error(err.details)
  console.error(err.stack)
  /* eslint-enable no-console */
}

const buildIndex = stats => {
  try {
    statSync(outputdir)
  } catch (e) {
    if (e.code == 'ENOENT') mkdirSync(outputdir)
  }

  const chunks = {}
  stats.compilation.chunks.map(c => {
    // name = path
    chunks[c.name || c.modules[0].rawRequest] = c.files[0]
  })

  const tmpl = `
<html>
  <head>
    <title>React Image</title>
  </head>
  <body style="margin:0px;passing:0px;">
    <div id="body"></div>
    <script src="/${chunks.main}"></script>
  </body>
</html>
  `
  writeFileSync(outputdir + '/index.html', tmpl)
}

cmd
  .option('--watch')
  .option('--server')
  .parse(process.argv)

const wp = webpack(opts)

wp.run((err, stats) => {
  if (err) webpackError(err)

  buildIndex(stats)
  process.stdout.write(stats.toString({colors: true}) + '\n')

  if (cmd.server) {
    const serveStatic = require('serve-static'),
      express = require('express'),
      app = express()

    app.use(serveStatic(outputdir))
    app.use(serveStatic(path.resolve(__dirname, 'site')))
    app.listen(3000)
  }
})

if (cmd.watch) {
  wp.watch({}, (err, stats) => {
    if (err) webpackError(err)

    buildIndex(stats)
    process.stdout.write(stats.toString({colors: true}) + '\n')
    // eslint-disable-next-line no-console
    console.log(
      '[' + new Date().toLocaleDateString(),
      new Date().toLocaleTimeString() + ']',
      'finished rebuild'
    )
  })
}
