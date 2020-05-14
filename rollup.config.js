import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import minify from 'rollup-plugin-babel-minify'
import pkg from './package.json'
const input = ['./jsSrc/index.js']
const external = (id) => !id.startsWith('.') && !id.startsWith('/')

const opts = {
  input,
  external,
  plugins: [
    babel({
      runtimeHelpers: true,
    }),
    nodeResolve(),
  ],
}

export default [
  {
    ...opts,
    output: {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
  },

  // umd
  {
    ...opts,
    plugins: [...opts.plugins, minify({comments: false})],
    output: {
      file: pkg.browser,
      format: 'umd',
      name: 'Img',
      sourcemap: true,
      sourcemapPathTransform: (relativePath) =>
        relativePath.replace(/^.*?\/node_modules/, '../../node_modules'),
    },
  },

  // esm
  {
    ...opts,
    output: {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
  },
]
