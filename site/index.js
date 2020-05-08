const express = require('express'),
  app = express()

app.use(
  express.static('dist', {
    immutable: true,
    maxAge: 0,
    index: false,
    fallthrough: true,
  })
)
