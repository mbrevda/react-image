import React from 'react'
import {Img} from './index'
import {render, act, cleanup, waitFor} from '@testing-library/react'

afterEach(cleanup)

const imgPromise = (decode) => (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    images.push(img)
    img.decode = () => Promise.resolve()
    img.onload = () => {
      decode ? img.decode().then(resolve).catch(reject) : resolve()
    }
    img.onerror = reject
    img.src = src

    // mock loading
    src.endsWith('LOAD') ? img.onload() : img.onerror()
  })
}

test('render with src string, after load', () => {
  const {getByAltText} = render(
    <Img src="fooLOAD" imgPromise={imgPromise} alt="" />
  )
  waitFor(() => expect(getByAltText('').src).toEqual(location.href + 'foo'))
})

test('render with src array', () => {
  const {getByAltText} = render(
    <Img src={['fooLOAD']} imgPromise={imgPromise} alt="" />
  )

  waitFor(() => expect(getByAltText('').src).toEqual(location.href + 'foo'))
})

// https://github.com/kentcdodds/react-testing-library/issues/281
test('render with decode=true', () => {
  const {getByAltText} = render(
    <Img src="fooDecode" imgPromise={imgPromise} alt="" />
  )
  waitFor(() =>
    expect(getByAltText('').src).toEqual(location.href + 'fooDecode')
  )
})

test('fallback to next image', () => {
  const {getByAltText} = render(
    <Img src={['foo', 'barLOAD']} imgPromise={imgPromise} alt="" />
  )

  waitFor(() => expect(getByAltText('').src).toEqual(location.href + 'bar'))
})

test('ensure missing image isnt rendered to browser', () => {
  const {container} = render(
    <Img src={['foo', 'bar']} imgPromise={imgPromise} alt="" />
  )

  expect(container.innerHTML).toEqual('')
})

test('show loader', () => {
  const {container} = render(
    <Img src="foo" loader={<span>Loading...</span>} alt="" />
  )
  waitFor(() => expect(container.innerHTML).toEqual('<span>Loading...</span>'))
})

test('clear loader after load', async () => {
  const {container, getByAltText} = render(
    <Img
      src="foo"
      loader={<span>Loading...</span>}
      alt=""
      imgPromise={imgPromise}
    />
  )
  waitFor(() => expect(getByAltText('').src).toEqual(location.href + 'foo'))
})

test('show unloader', async () => {
  const {container} = render(
    <Img
      unloader={<span>Could not load image!</span>}
      imgPromise={imgPromise}
    />
  )

  waitFor(() =>
    expect(container.innerHTML).toEqual('<span>Could not load image!</span>')
  )
})

test('update image on src prop change', () => {
  const {rerender, getByAltText} = render(
    <Img src="fooLOAD" imgPromise={imgPromise} alt="" />
  )
  rerender(<Img src="barLOAD" imgPromise={imgPromise} alt="" />)
  waitFor(() => expect(getByAltText('').src).toEqual(location.href + 'bar'))
})

test('start over on src prop change', async () => {
  const {getByAltText, rerender} = render(
    <Img src={['foo', 'bar']} imgPromise={imgPromise} alt="" />
  )

  waitFor(() => expect(getByAltText('').src).toEqual(location.href + 'bar'))
  rerender(<Img src="bazLOAD" imgPromise={imgPromise} alt="" />)
  waitFor(() => expect(getByAltText('').src).toEqual(location.href + 'baz'))
})

test('updated props no src', async () => {
  const {container, rerender} = render(
    <Img src="fooLOAD" imgPromise={imgPromise} />
  )

  rerender(<Img src="" imgPromise={imgPromise} />)
  waitFor(() => expect(container.innerHTML).toEqual(''))
})

test('onError does nothing if unmounted', async () => {
  const {unmount} = render(<Img src="foo5" imgPromise={imgPromise} />)

  //unmount()
  setTimeout(() => unmount(), 1)
})
