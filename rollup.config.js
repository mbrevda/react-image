import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import minify from 'rollup-plugin-babel-minify'
import {dirname} from 'path'
import pkg from './package.json'
const input = {
  Img: 'jsSrc/Img.js',
  useImage: 'jsSrc/useImage.js',
}
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
      dir: dirname(pkg.main),
      format: 'cjs',
      sourcemap: true,
    },
  },

  // umd
  {
    ...opts,
    input: 'jsSrc/index.js',
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
      dir: dirname(pkg.module),
      format: 'esm',
      sourcemap: true,
    },
  },
]
