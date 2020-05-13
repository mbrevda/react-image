import babel from 'rollup-plugin-babel'
import {dirname} from 'path'
import nodeResolve from 'rollup-plugin-node-resolve'
import minify from 'rollup-plugin-babel-minify'
import pkg from './package.json'
import typescript from '@rollup/plugin-typescript'
const input = ['./src/index.tsx']
const external = (id) => !id.startsWith('.') && !id.startsWith('/')

const opts = {
  input,
  external,
  plugins: [
    typescript(),
    babel({
      runtimeHelpers: true,
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    nodeResolve(),
  ],
}

export default [
  // cjs. CJS is already included in umd... not sure we need both
  {
    ...opts,
    output: {
      dir: dirname(pkg.main),
      format: 'cjs',
      sourcemap: true,
    },
  },

  {
    ...opts,
    input: 'src/useImage.tsx',
    output: {
      dir: dirname(pkg.main),
      format: 'cjs',
      sourcemap: true,
    },
  },

  // umd
  {
    ...opts,
    plugins: [...opts.plugins, minify({comments: false})],
    output: {
      dir: dirname(pkg.browser),
      format: 'umd',
      name: 'Img',
      sourcemap: true,
      sourcemapPathTransform: (relativePath) =>
        relativePath.replace(/^.*?\/node_modules/, '../../node_modules'),
    },
  },
  {
    ...opts,
    input: 'src/useImage.tsx',
    plugins: [...opts.plugins, minify({comments: false})],
    output: {
      dir: dirname(pkg.browser),
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
  {
    ...opts,
    input: 'src/useImage.tsx',
    output: {
      dir: dirname(pkg.module),
      format: 'esm',
      sourcemap: true,
    },
  },
]
