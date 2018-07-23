import React from 'react'
import Enzyme, {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Img from './index.js'

Enzyme.configure({adapter: new Adapter()})

// const trigger = (i, e) => i.instance().i.dispatchEvent(new Event(e))

test('render with no opts', () => {
  expect(shallow(<Img />).html()).toEqual(null)
})

test('render with src string, after load', () => {
  const i = shallow(<Img src="foo" />)
  i.setState({isLoaded: true})
  expect(i.html()).toEqual('<img src="foo"/>')
})

test('render with src array', () => {
  const i = shallow(<Img src={['foo']} />)
  i.setState({isLoaded: true})
  expect(i.html()).toEqual('<img src="foo"/>')
})

test.skip('render with decode=true', () => {
  const originalDecode = window.Image.prototype.decode
  const p = Promise.resolve()
  window.Image.prototype.decode = () => p

  const i = shallow(<Img src="foo" />)
  window.Image.prototype.decode = originalDecode
  return p.then(() => {
    // i.instance().i.dispatchEvent(new Event('load'))
    i.update()
    expect(i.html()).toEqual('<img src="foo"/>')
  })
})

test('fallback to next image', () => {
  const i = shallow(<Img src={['foo', 'bar']} />)
  i.setState({currentIndex: i.state('currentIndex') + 1, isLoaded: true})
  expect(i.html()).toEqual('<img src="bar"/>')
})

test('ensure missing image isnt renderer to browser', () => {
  const i = shallow(<Img src={['foo', 'bar']} />)
  i.setState({currentIndex: i.state('currentIndex') + 2})
  expect(i.html()).toEqual(null)
})

test('show loader', () => {
  const i = shallow(<Img src="foo" loader={<span>Loading...</span>} />)
  expect(i.html()).toEqual('<span>Loading...</span>')
})

test('clear loader after load', () => {
  const i = shallow(<Img src="foo" loader={<span>Loading...</span>} />)
  expect(i.html()).toEqual('<span>Loading...</span>')
  i.setState({isLoading: false, isLoaded: true})
  expect(i.html()).toEqual('<img src="foo"/>')
})

test('show unloader', () => {
  const i = shallow(<Img unloader={<span>Could not load image!</span>} />)
  i.setState({isLoading: false, isLoaded: false})
  expect(i.html()).toEqual('<span>Could not load image!</span>')
})

test('cache already loaded successfully', () => {
  const i = new Img({src: 'foo'})
  i.onLoad()
  const j = shallow(<Img src="foo" />)
  expect(j.state()).toEqual({currentIndex: 0, isLoading: false, isLoaded: true})
})

test('destroy image on unmount', () => {
  const i = shallow(<Img src="foo1" />)
  const inst = i.instance()
  inst.componentDidMount()
  i.unmount()
  expect(inst.i).toEqual(undefined)
})

test('componentDidMount start loading', () => {
  const i = shallow(<Img src="foo2" />)
  const inst = i.instance()
  inst.componentDidMount()
  expect(inst.i.src).toEqual('foo2')
})

test('componentWillReceiveProps', () => {
  const i = shallow(<Img src="foo" />)
  i.setProps({src: 'bar'})
  expect(i.state()).toEqual({currentIndex: 0, isLoading: true, isLoaded: false})
})

test('componentWillReceiveProps no change', () => {
  const i = shallow(<Img src="foo" />)
  i.setProps({src: 'foo'})
  expect(i.state()).toEqual({currentIndex: 0, isLoading: false, isLoaded: true})
})

test('componentWillReceiveProps no src', () => {
  const i = shallow(<Img src="foo" />)
  i.setProps({src: ''})
  expect(i.state()).toEqual({
    currentIndex: 0,
    isLoading: false,
    isLoaded: false
  })
})

test('onLoad sets state to loaded', () => {
  const i = shallow(<Img src="foo4" />)
  const inst = i.instance()
  inst.componentDidMount()
  inst.i.onload()
  expect(i.state('isLoaded')).toEqual(true)
})

test('onError does nothing if unmounted', () => {
  const i = shallow(<Img src="foo5" />)
  const inst = i.instance()
  inst.componentDidMount()
  const img = inst.i
  i.unmount()
  expect(img.onerror()).toBe(false)
})

test('onError if there are no more sources, we are done', () => {
  const i = shallow(<Img src="foo7" />)
  const inst = i.instance()
  inst.componentDidMount()
  inst.i.onerror()
  expect(i.state()).toEqual({
    currentIndex: 0,
    isLoading: false,
    isLoaded: false
  })
})

test('onError try the next image', () => {
  const i = shallow(<Img src={['foo6', 'bar6']} />)
  const inst = i.instance()
  inst.componentDidMount()
  inst.i.onerror()
  expect(i.state()).toEqual({currentIndex: 1, isLoading: true, isLoaded: false})
})

test('onError try the next image. If its cached successfully, skip loading', () => {
  const j = shallow(<Img src="bar8" />)
  j.instance().onLoad()

  const i = shallow(<Img src={['foo8', 'bar8']} />)
  const inst = i.instance()
  inst.componentDidMount()
  inst.i.onerror()
  expect(i.state()).toEqual({currentIndex: 1, isLoading: false, isLoaded: true})
})

test('onError try the next image. If its cached as error, skip it', () => {
  const j = shallow(<Img src="bar9" />)
  j.instance().onError()

  const i = shallow(<Img src={['foo9', 'bar9']} />)
  const inst = i.instance()
  inst.componentDidMount()
  inst.i.onerror()
  expect(i.state()).toEqual({
    currentIndex: 0,
    isLoading: false,
    isLoaded: false
  })
})

test('onLoad callback is passed', () => {
  const onLoadMock = jest.fn()
  const i = shallow(<Img src="bar10" onLoad={onLoadMock}/>)
  const instance = i.instance()
  instance.onLoad()
  expect(onLoadMock).toHaveBeenCalled()
})

test('onError callback is passed', () => {
  const onErrorMock = jest.fn()
  const i = shallow(<Img src="bar11" onError={onErrorMock}/>)
  const instance = i.instance()
  instance.onError();
  expect(onErrorMock).toHaveBeenCalled()
})
