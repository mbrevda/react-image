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

const ctx = await context(buildOpts)

if (process.env.NODE_ENV === 'production') {
  await ctx.rebuild()
  ctx.dispose()

  // build cjs version
  await build({
    ...buildOpts,
    format: 'cjs',
    outdir: './dist/cjs',
    splitting: false,
  })
} else {
  await ctx.watch()
  open(serverUrl)
}

process.on('exit', () => ctx.dispose())
process.on('unhandledRejection', console.error)
process.on('uncaughtException', console.error)
