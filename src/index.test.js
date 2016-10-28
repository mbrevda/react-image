import React from 'react'
import Img from './index.js'
import renderer from 'react-test-renderer'

it('say hi!', () => {
  const component = renderer.create(
    <Img />
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
