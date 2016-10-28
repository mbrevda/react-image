import React from 'react'
import Img from './index.js'
// import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

it('render with no opts', () => {
  expect(shallow(<Img />).html()).toEqual('<span><img/></span>')
})

it('render with src string', () => {
  const i = shallow(<Img src="foo"/>)
  expect(i.html()).toEqual('<span><img src="foo"/></span>')
})

it('render with src array', () => {
  const i = shallow(<Img src={['foo']}/>)
  expect(i.html()).toEqual('<span><img src="foo"/></span>')
})

it('render with src blank string', () => {
  const i = shallow(<Img src=""/>)
  expect(i.html()).toEqual('<span><img src=""/></span>')
})

it('fallback to next image', () => {
  const i = shallow(<Img src={['foo', 'bar']}/>)
  i.find('img').simulate('error')
  expect(i.html()).toEqual('<span><img src="bar"/></span>')
})

it('ensure missing image isnt renreder to browser', () => {
  const i = shallow(<Img src={['foo', 'bar']}/>)
  i.find('img').simulate('error')
  i.find('img').simulate('error')
  expect(i.html()).toEqual('<span><img/></span>')
})

it('show loader', () => {
  const i = shallow(<Img loader="Loading..."/>)
  expect(i.html()).toEqual('<span><img/>Loading...</span>')
})

it('clear loader after load', () => {
  const i = shallow(<Img loader="Loading..."/>)
  i.find('img').simulate('load')
  expect(i.html()).toEqual('<span><img/></span>')
})

it('show unloader', () => {
  const i = shallow(<Img unloader="Could not load image!"/>)
  i.find('img').simulate('error')
  expect(i.html()).toEqual('<span><img/>Could not load image!</span>')
})
