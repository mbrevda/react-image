import url from 'node:url'
import {parseArgs} from 'node:util'
import {context} from 'esbuild'
import {rm} from 'node:fs/promises'
import open from 'open'

// const app = express()
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const outdir = __dirname + '../dist/dev'
const {
  values: {build},
} = parseArgs({
  options: {
    build: {type: 'boolean', default: false},
  },
})

await rm(outdir, {recursive: true, force: true})

const buildOpts = {
  entryPoints: [
    __dirname + './app.tsx',
    __dirname + './index.html',
    __dirname + './sw.js',
  ],
  bundle: true,
  splitting: true,
  outdir,
  format: 'esm',
  sourcemap: true,
  minify: false,
  jsxDev: true,
  jsx: 'automatic',
  loader: {'.html': 'copy'},
}

const ctx = await context(buildOpts)
if (!build) {
  await ctx.watch()
  let {port} = await ctx.serve({servedir: outdir})
  open(`http://localhost:${port}`)
} else {
  await ctx.rebuild()
  await ctx.dispose()
}
process.on('unhandledRejection', console.error)
process.on('uncaughtException', console.error)
process.on('exit', () => ctx && ctx.dispose())
