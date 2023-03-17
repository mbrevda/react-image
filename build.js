import {context, build} from 'esbuild'
import {rm} from 'node:fs/promises'

await rm('./dist', {recursive: true, force: true})

const buildOpts = {
  entryPoints: ['./src/index.tsx', './src/Img.tsx', './src/useImage.tsx'],
  external: ['react', 'react-dom'],
  bundle: true,
  splitting: true,
  outdir: './dist/esm',
  format: 'esm',
  sourcemap: false,
  minify: true,
  jsxDev: false, // MODE === 'dev',
  jsx: 'automatic',
}

// build esm version
await build(buildOpts)

// build cjs version
await build({
  ...buildOpts,
  format: 'cjs',
  outdir: './dist/cjs',
  splitting: false,
})

process.on('unhandledRejection', console.error)
process.on('uncaughtException', console.error)
