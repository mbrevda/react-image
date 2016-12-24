import React from 'react'
import Img from './index.js'
// import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

it('render with no opts', () => {
  expect(shallow(<Img />).html()).toEqual(null)
})

it('render with src string, after load', () => {
  const i = shallow(<Img src="foo"/>)
  i.setState({isLoaded: true})
  expect(i.html()).toEqual('<img src="foo"/>')
})

it('render with src array', () => {
  const i = shallow(<Img src={['foo']}/>)
  i.setState({isLoaded: true})
  expect(i.html()).toEqual('<img src="foo"/>')
})

it('fallback to next image', () => {
  const i = shallow(<Img src={['foo', 'bar']}/>)
  i.setState({currentIndex: i.state('currentIndex') + 1, isLoaded: true})
  expect(i.html()).toEqual('<img src="bar"/>')
})

it('ensure missing image isnt renreder to browser', () => {
  const i = shallow(<Img src={['foo', 'bar']}/>)
  i.setState({currentIndex: i.state('currentIndex') + 2})
  expect(i.html()).toEqual(null)
})

it('show loader', () => {
  const i = shallow(<Img src="foo" loader={<span>Loading...</span>}/>)
  expect(i.html()).toEqual('<span>Loading...</span>')
})

it('clear loader after load', () => {
  const i = shallow(<Img src="foo" loader={<span>Loading...</span>}/>)
  expect(i.html()).toEqual('<span>Loading...</span>')
  i.setState({isLoading: false, isLoaded: true})
  expect(i.html()).toEqual('<img src="foo"/>')
})

it('show unloader', () => {
  const i = shallow(<Img unloader={<span>Could not load image!</span>}/>)
  i.setState({isLoading: false, isLoaded: false})
  expect(i.html()).toEqual('<span>Could not load image!</span>')
})
