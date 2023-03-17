import express from 'express'
import url from 'node:url'
import {writeFile} from 'node:fs/promises'
import {setTimeout} from 'node:timers/promises'
import {context} from 'esbuild'
import {rm} from 'node:fs/promises'
import open from 'open'

const app = express()
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const outdir = __dirname + '../dist'

await rm(outdir, {recursive: true, force: true})

const buildOpts = {
  entryPoints: [__dirname + './app.tsx', __dirname + './index.html'],
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
await ctx.watch()

app.use(express.static(outdir, {}))
app.use(express.static(__dirname, {}))
app.get('/delay/:delay/:finalDest(*)', async (req, res) => {
  await setTimeout(req.params.delay)
  return res.redirect(req.params.finalDest)
})

app.listen(3888, () => {
  console.log('Dev server listening on http://localhost:3888')
})

open('http://localhost:3888')
process.on('unhandledRejection', console.error)
process.on('uncaughtException', console.error)
process.on('exit', () => ctx && ctx.dispose())
