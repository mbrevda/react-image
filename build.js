import esbuild from 'esbuild'
import {rm} from 'node:fs/promises'

await rm('./dist', {recursive: true, force: true})

const buildOpts = {
  entryPoints: ['./src/index.tsx', './src/Img.tsx', './src/useImage.tsx'],
  external: ['react', 'react-dom'],
  minify: false,
  bundle: true,
  splitting: true,
  outdir: './dist/esm',
  format: 'esm',
  sourcemap: true,
  minify: true,
}

// esbuild.build(buildOpts)

const devBuild = (opts) => {
  return esbuild.build({
    ...buildOpts,
    ...opts,
    minify: false,
    sourcemap: false,
    watch: true,
    external: [],
  })
}

export {devBuild}
