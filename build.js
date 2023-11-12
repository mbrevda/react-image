import {rm} from 'node:fs/promises'
import url from 'node:url'
import {context, build} from 'esbuild'
import open from 'open'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const distOutdir = './dist/dev'

const buildOpts = {
  entryPoints: ['./src/index.tsx', './src/Img.tsx', './src/useImage.tsx'],
  external: ['react', 'react-dom'],
  bundle: true,
  splitting: true,
  outdir: './dist/esm',
  format: 'esm',
  sourcemap: false,
  minify: true,
  jsxDev: process.env.NODE_ENV === 'development',
  jsx: 'automatic',
}

const devBuildOpts = {
  entryPoints: ['./dev/app.tsx', './dev/index.html', './dev/sw.js'],
  bundle: true,
  splitting: true,
  outdir: distOutdir,
  format: 'esm',
  sourcemap: true,
  minify: process.env.NODE_ENV !== 'development',
  jsxDev: true,
  jsx: 'automatic',
  loader: {'.html': 'copy'},
}

await rm('./dist', {recursive: true, force: true})

if (process.env.NODE_ENV !== 'development') {
  // build esm version
  await Promise.all([
    build(buildOpts),

    // build cjs version
    build({
      ...buildOpts,
      format: 'cjs',
      outdir: './dist/cjs',
      splitting: false,
    }),

    // build dev site
    build(devBuildOpts),
  ])
} else {
  const ctx = await context(devBuildOpts)
  await ctx.watch()
  let {port} = await ctx.serve({servedir: distOutdir})
  open(`http://localhost:${port}`)
}

process.on('unhandledRejection', console.error)
process.on('uncaughtException', console.error)
