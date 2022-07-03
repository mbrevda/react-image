import express from 'express'
import {devBuild} from '../build.js'
import url from 'node:url'
import {writeFile} from 'node:fs/promises'
import {setTimeout} from 'node:timers/promises'
const app = express()

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const outdir = __dirname + '../dist/dev'

devBuild({
  entryPoints: [__dirname + '/app.tsx'],
  outdir,
}).then(() => {
  writeFile(
    outdir + '/index.html',
    `
<!DOCTYPE html>
<head>
<script src="app.js" type="module"></script>
</head><body></body>
`
  )
})

app.use(express.static(outdir, {}))
app.use(express.static(__dirname, {}))
app.get('/delay/:delay/:finalDest(*)', async (req, res) => {
  await setTimeout(req.params.delay)
  return res.redirect(req.params.finalDest)
})

app.listen(3888, () => {
  console.log('Dev server listening on http://localhost:3888')
})
