import React from 'react'
import Img from './index.js'
import ReactDOMServer from 'react-dom/server'
import {render, act, cleanup, wait} from 'react-testing-library'

afterEach(cleanup)

test('render with src string, after load', () => {
  const mockImage = new Image()
  const {getByAltText} = render(<Img src="foo" mockImage={mockImage} alt="" />)
  act(() => mockImage.onload())
  expect(getByAltText('').src).toEqual(location.href + 'foo')
})

test('render with src array', () => {
  const mockImage = new Image()
  const {getByAltText} = render(
    <Img src={['foo']} mockImage={mockImage} alt="" />
  )
  act(() => mockImage.onload())
  expect(getByAltText('').src).toEqual(location.href + 'foo')
})

// https://github.com/kentcdodds/react-testing-library/issues/281
test('render with decode=true', () => {
  const mockImage = new Image()
  mockImage.decode = () => Promise.resolve()
  const {getByAltText} = render(
    <Img src="fooDecode" mockImage={mockImage} alt="" />
  )
  wait(() => expect(getByAltText('').src).toEqual(location.href + 'fooDecode'))
})

test('fallback to next image', () => {
  const mockImage = new Image()
  const {getByAltText} = render(
    <Img src={['foo', 'bar']} mockImage={mockImage} alt="" />
  )
  act(() => {
    mockImage.onerror()
    mockImage.onload()
  })
  expect(getByAltText('').src).toEqual(location.href + 'bar')
})

test('ensure missing image isnt renderer to browser', () => {
  const mockImage = new Image()
  const {container} = render(
    <Img src={['foo', 'bar']} mockImage={mockImage} alt="" />
  )
  act(() => {
    mockImage.onerror()
    mockImage.onerror()
  })
  expect(container.innerHTML).toEqual('')
})

test('show loader', () => {
  const {container} = render(
    <Img src="foo" loader={<span>Loading...</span>} alt="" />
  )
  expect(container.innerHTML).toEqual('<span>Loading...</span>')
})

test('clear loader after load', () => {
  const mockImage = new Image()
  const {container, getByAltText} = render(
    <Img
      src="foo"
      loader={<span>Loading...</span>}
      alt=""
      mockImage={mockImage}
    />
  )
  expect(container.innerHTML).toEqual('<span>Loading...</span>')
  act(() => mockImage.onload())
  expect(getByAltText('').src).toEqual(location.href + 'foo')
})

test('show unloader', () => {
  const mockImage = new Image()
  const {container} = render(
    <Img unloader={<span>Could not load image!</span>} mockImage={mockImage} />
  )
  act(() => mockImage.onerror())
  setTimeout(
    () =>
      expect(container.innerHTML).toEqual('<span>Could not load image!</span>'),
    1
  )
})

test('update image on src prop change', () => {
  const mockImage = new Image()
  const {rerender, getByAltText} = render(
    <Img src="foo" mockImage={mockImage} alt="" />
  )
  act(() => mockImage.onload())
  rerender(<Img src="bar" mockImage={mockImage} alt="" />)
  act(() => mockImage.onload())
  expect(getByAltText('').src).toEqual(location.href + 'bar')
})

test('start over on src prop change', () => {
  const mockImage = new Image()
  const {getByAltText, rerender} = render(
    <Img src={['foo', 'bar']} mockImage={mockImage} alt="" />
  )
  //fail first image so that index gets incremented
  act(() => {
    mockImage.onerror()
    mockImage.onload()
  })
  expect(getByAltText('').src).toEqual(location.href + 'bar')
  rerender(<Img src="baz" mockImage={mockImage} alt="" />)
  act(() => mockImage.onload())
  expect(getByAltText('').src).toEqual(location.href + 'baz')
})

test('updated props no src', () => {
  const mockImage = new Image()
  const {container, rerender} = render(<Img src="foo" mockImage={mockImage} />)
  act(() => mockImage.onload())
  rerender(<Img src="" mockImage={mockImage} />)
  expect(container.innerHTML).toEqual('')
})

test('onError does nothing if unmounted', () => {
  const mockImage = new Image()
  const {unmount} = render(<Img src="foo5" mockImage={mockImage} />)
  act(() => mockImage.onerror())
  unmount()
})
