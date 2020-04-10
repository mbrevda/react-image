import React from 'react'
import Img from './index.js'
import ReactDOMServer from 'react-dom/server'
import {render, act, cleanup, waitFor} from '@testing-library/react'

afterEach(cleanup)

const mockImgPromise = () => {
  let images = []
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
    })
  }

  return {
    img: (index = 0) => images[index],
    imgPromise,
  }
}

test('render with src string, after load', () => {
  const {img, imgPromise} = mockImgPromise()
  const {getByAltText} = render(
    <Img src="foo" imgPromise={imgPromise} alt="" />
  )
  act(() => img().onload())
  waitFor(() => expect(getByAltText('').src).toEqual(location.href + 'foo'))
})

test('render with src array', () => {
  const {img, imgPromise} = mockImgPromise()
  const {getByAltText} = render(
    <Img src={['foo']} imgPromise={imgPromise} alt="" />
  )
  act(() => img().onload())
  waitFor(() => expect(getByAltText('').src).toEqual(location.href + 'foo'))
})

// https://github.com/kentcdodds/react-testing-library/issues/281
test('render with decode=true', () => {
  const {img, imgPromise} = mockImgPromise()
  const {getByAltText} = render(
    <Img src="fooDecode" imgPromise={imgPromise} alt="" />
  )
  waitFor(() =>
    expect(getByAltText('').src).toEqual(location.href + 'fooDecode')
  )
})

test('fallback to next image', async () => {
  const {img, imgPromise} = mockImgPromise()
  const {getByAltText} = render(
    <Img src={['foo', 'bar']} imgPromise={imgPromise} alt="" />
  )

  await act(async () => {
    await new Promise((r) => setTimeout(r, 1))
    img(0).onerror()
    await new Promise((r) => setTimeout(r, 1))
    img(1).onload()
  })

  waitFor(() => expect(getByAltText('').src).toEqual(location.href + 'bar'))
})

test('ensure missing image isnt renderer to browser', async () => {
  const {img, imgPromise} = mockImgPromise()
  const {container} = render(
    <Img src={['foo', 'bar']} imgPromise={imgPromise} alt="" />
  )

  await act(async () => {
    await new Promise((r) => setTimeout(r, 1))
    img(0).onerror()
    await new Promise((r) => setTimeout(r, 1))
    img(1).onerror()
  })
  expect(container.innerHTML).toEqual('')
})

test('show loader', () => {
  const {container} = render(
    <Img src="foo" loader={<span>Loading...</span>} alt="" />
  )
  expect(container.innerHTML).toEqual('<span>Loading...</span>')
})

test('clear loader after load', async () => {
  const {img, imgPromise} = mockImgPromise()
  const {container, getByAltText} = render(
    <Img
      src="foo"
      loader={<span>Loading...</span>}
      alt=""
      imgPromise={imgPromise}
    />
  )
  expect(container.innerHTML).toEqual('<span>Loading...</span>')

  await act(async () => {
    await new Promise((r) => setTimeout(r, 1))
    await img().onload()
  })
  waitFor(() => expect(getByAltText('').src).toEqual(location.href + 'foo'))
})

test('show unloader', async () => {
  const {img, imgPromise} = mockImgPromise()
  const {container} = render(
    <Img
      unloader={<span>Could not load image!</span>}
      imgPromise={imgPromise}
    />
  )
  await act(async () => {
    await new Promise((r) => setTimeout(r, 1))
    await img().onerror()
  })
  waitFor(() =>
    expect(container.innerHTML).toEqual('<span>Could not load image!</span>')
  )
})

test('update image on src prop change', async () => {
  const {img, imgPromise} = mockImgPromise()
  const {rerender, getByAltText} = render(
    <Img src="foo" imgPromise={imgPromise} alt="" />
  )
  await act(async () => {
    await new Promise((r) => setTimeout(r, 1))
    await img().onload()
  })
  rerender(<Img src="bar" imgPromise={imgPromise} alt="" />)
  await act(async () => {
    await new Promise((r) => setTimeout(r, 1))
    await img().onload()
  })
  waitFor(() => expect(getByAltText('').src).toEqual(location.href + 'bar'))
})

test('start over on src prop change', async () => {
  const {img, imgPromise} = mockImgPromise()
  const {getByAltText, rerender} = render(
    <Img src={['foo', 'bar']} imgPromise={imgPromise} alt="" />
  )

  await act(async () => {
    await new Promise((r) => setTimeout(r, 1))
    img(0).onerror()
    await new Promise((r) => setTimeout(r, 1))
    img(1).onerror()
  })
  waitFor(() => expect(getByAltText('').src).toEqual(location.href + 'bar'))

  rerender(<Img src="baz" imgPromise={imgPromise} alt="" />)
  await act(async () => {
    await new Promise((r) => setTimeout(r, 1))
    await img().onload()
  })
  waitFor(() => expect(getByAltText('').src).toEqual(location.href + 'baz'))
})

test('updated props no src', async () => {
  const {img, imgPromise} = mockImgPromise()
  const {container, rerender} = render(
    <Img src="foo" imgPromise={imgPromise} />
  )
  await act(async () => {
    await new Promise((r) => setTimeout(r, 1))
    img(0).onerror()
  })
  rerender(<Img src="" imgPromise={imgPromise} />)
  waitFor(() => expect(container.innerHTML).toEqual(''))
})

test('onError does nothing if unmounted', async () => {
  const {img, imgPromise} = mockImgPromise()
  const {unmount} = render(<Img src="foo5" imgPromise={imgPromise} />)
  await act(async () => {
    await new Promise((r) => setTimeout(r, 1))
    img(0).onerror()
  })
  unmount()
})
