import React from 'react'
import Enzyme, {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Img from './index.js'
import ReactDOMServer from 'react-dom/server'

Enzyme.configure({adapter: new Adapter()})

// const trigger = (i, e) => i.instance().i.dispatchEvent(new Event(e))

test('render with src string, after load', () => {
  const mockImage = new Image()
  const i = shallow(<Img src="foo" mockImage={mockImage} />)
  mockImage.onload()
  expect(i.html()).toEqual('<img src="foo"/>')
})

test('render with src array', () => {
  const mockImage = new Image()
  const i = shallow(<Img src={['foo']} mockImage={mockImage} />)
  mockImage.onload()
  expect(i.html()).toEqual('<img src="foo"/>')
})

test('render with decode=true', () => {
  const mockImage = new Image()
  mockImage.decode = () => Promise.resolve()
  const i = shallow(<Img src="fooDecode" mockImage={mockImage} />)

  setTimeout(() => expect(i.html()).toEqual('<img src="fooDecode"/>'), 100)
})

test('fallback to next image', () => {
  const mockImage = new Image()
  const i = shallow(<Img src={['foo', 'bar']} mockImage={mockImage} />)
  mockImage.onerror()
  mockImage.onload()
  expect(i.html()).toEqual('<img src="bar"/>')
})

test('ensure missing image isnt renderer to browser', () => {
  const mockImage = new Image()
  const i = shallow(<Img src={['foo', 'bar']} mockImage={mockImage} />)
  mockImage.onerror()
  mockImage.onerror()
  expect(i.html()).toEqual(null)
})

test('show loader', () => {
  const i = shallow(<Img src="foo" loader={<span>Loading...</span>} />)
  expect(i.html()).toEqual('<span>Loading...</span>')
})

test('clear loader after load', () => {
  const mockImage = new Image()
  const i = shallow(
    <Img src="foo" loader={<span>Loading...</span>} mockImage={mockImage} />
  )
  expect(i.html()).toEqual('<span>Loading...</span>')
  mockImage.onload()
  expect(i.html()).toEqual('<img src="foo"/>')
})

test('show unloader', () => {
  const mockImage = new Image()
  const i = shallow(
    <Img unloader={<span>Could not load image!</span>} mockImage={mockImage} />
  )
  mockImage.onerror()
  setTimeout(
    () => expect(i.html()).toEqual('<span>Could not load image!</span>'),
    1
  )
})

test('update image on src prop change', () => {
  const mockImage = new Image()
  const i = shallow(<Img src="foo" mockImage={mockImage} />)
  mockImage.onload()
  i.setProps({src: 'bar'})
  mockImage.onload()
  expect(i.html()).toEqual('<img src="bar"/>')
})

test('updated props no src', () => {
  const mockImage = new Image()
  const i = shallow(<Img src="foo" mockImage={mockImage} />)
  mockImage.onload()
  i.setProps({src: ''})
  expect(i.html()).toEqual(null)
})

//test('onError does nothing if unmounted', () => {
//  const mockImage = new Image()
//  const i = shallow(<Img src="foo5" mockImage={mockImage} />)
//  i.unmount()
//  mockImage.onerror()
//  //expect(img.onerror()).toBe(false)
//})
