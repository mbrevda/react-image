import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import minify from 'rollup-plugin-babel-minify'
import pkg from './package.json'
const input = './src/index.js'

const external = id => !id.startsWith('.') && !id.startsWith('/')

const opts = {
  input,
  external,
  plugins: [
    babel({
      runtimeHelpers: true
    }),
    nodeResolve()
  ]
}

export default [
  // cjs. CJS is already included in umd... not sure we need both
  {
    ...opts,
    output: {
      file: pkg.main,
      format: 'cjs'
    }
  },

  // umd
  {
    ...opts,
    plugins: [...opts.plugins, minify({comments: false})],
    output: {
      file: pkg.browser,
      format: 'umd',
      name: 'Img',
      sourcemap: true
    }
  },

  // esm
  {
    ...opts,
    output: {
      file: pkg.module,
      format: 'esm'
    }
  }
]
