import React from 'react'
import Img from './index.js'
import ReactDOMServer from 'react-dom/server'

test('should ssr a loader', () => {
  const html = ReactDOMServer.renderToStaticMarkup(
    <Img src="foo10" loader={<span>Loading...</span>} />
  )
  expect(html).toEqual('<span>Loading...</span>')
})

test('should ssr nothing if only src is set', () => {
  const html = ReactDOMServer.renderToStaticMarkup(<Img src="foo11" />)
  expect(html).toEqual('')
})
