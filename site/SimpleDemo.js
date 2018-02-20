import React, {Component} from 'react'
import Img from '../src'
import Preloader from './Preloader.js'
import DemoContainer from './DemoContainer.js'

export default () => (
  <DemoContainer title="Demo with a slow loading image">
    {({rand}) => (
      <Img
        loader={<Preloader />}
        src={`http://www.deelay.me/5000/${
          window.location.href
        }cat.jpg?rand=${rand}`}
        width="320"
        height="240"
        rand={rand}
      />
    )}
  </DemoContainer>
)
