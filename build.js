import {context} from 'esbuild'
import {rm} from 'node:fs/promises'

await rm('./dist', {recursive: true, force: true})

const ctx = await context({
  entryPoints: ['./src/index.tsx', './src/Img.tsx', './src/useImage.tsx'],
  external: ['react', 'react-dom'],
  bundle: true,
  splitting: true,
  outdir: './dist/esm',
  format: 'esm',
  sourcemap: true,
  minify: true,
  jsxDev: false, // MODE === 'dev',
  jsx: 'automatic',
})

if (true /* MODE === 'production' */) {
  await ctx.rebuild()
  ctx.dispose()
} else {
  await ctx.watch()
  open(serverUrl)
}

process.on('exit', () => ctx.dispose())
process.on('unhandledRejection', console.error)
process.on('uncaughtException', console.error)
