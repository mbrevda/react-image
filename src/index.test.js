import React from 'react'
import Img from './index.js'
// import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

it('render with no opts', () => {
  expect(shallow(<Img />).html()).toEqual('<img/>')
})

it('render with src string, before load', () => {
  const i = shallow(<Img src="foo" loader={<span>loading...</span>}/>)
  expect(i.html()).toEqual('<span><span>loading...</span><img src="foo"/></span>')
})

it('render with src string, after load', () => {
  const i = shallow(<Img src="foo"/>)
  i.find('img').simulate('load')
  expect(i.html()).toEqual('<img src="foo"/>')
})

it('render with src array', () => {
  const i = shallow(<Img src={['foo']}/>)
  i.find('img').simulate('load')
  expect(i.html()).toEqual('<img src="foo"/>')
})

it('fallback to next image', () => {
  const i = shallow(<Img src={['foo', 'bar']}/>)
  i.find('img').simulate('error')
  expect(i.html()).toEqual('<img src="bar"/>')
})

it('ensure missing image isnt renreder to browser', () => {
  const i = shallow(<Img src={['foo', 'bar']}/>)
  i.find('img').simulate('error')
  i.find('img').simulate('error')
  expect(i.html()).toEqual(null)
})

it('show loader', () => {
  const i = shallow(<Img loader={<span>Loading...</span>}/>)
  expect(i.html()).toEqual('<span><span>Loading...</span><img/></span>')
})

it('clear loader after load', () => {
  const i = shallow(<Img loader={<span>Loading...</span>}/>)
  expect(i.html()).toEqual('<span><span>Loading...</span><img/></span>')
  i.setState({isLoading: false, isLoaded: true})
  expect(i.html()).toEqual('<img/>')
})

it('show unloader', () => {
  const i = shallow(<Img unloader={<span>Could not load image!</span>}/>)
  i.find('img').simulate('error')
  expect(i.html()).toEqual('<span>Could not load image!</span>')
})

it('show nothing on error without fallback', () => {
  const i = shallow(<Img/>)
  i.find('img').simulate('error')
  expect(i.html()).toEqual(null)
})
