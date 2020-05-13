import React, {Component} from 'react'
import DemoContainer from './DemoContainer.js'
import Img from '../src'
import ReactCSSTransitionReplace from 'react-css-transition-replace'
import Preloader from './Preloader.js'

const fadeOut = 400,
  fadeIn = 600

// add necessary css to document
var style = document.createElement('style')
style.type = 'text/css'
style.innerHTML = `
.fade-wait-leave {
  opacity: 1;
}
.fade-wait-leave.fade-wait-leave-active {
  opacity: 0;
  transition: opacity ${fadeOut}ms ease-in;
}

.fade-wait-enter {
  opacity: 0;
}

.fade-wait-enter.fade-wait-enter-active {
  opacity: 1;
  /* Delay the enter animation until the leave completes */
  transition: opacity ${fadeOut}ms ease-in ${fadeIn}ms;
}

.fade-wait-height {
  transition: height ${fadeIn}ms ease-in-out;
}
`
document.getElementsByTagName('head')[0].appendChild(style)

export default () => (
  <DemoContainer title="Demo with transition between preloader and image">
    {({rand}) => (
      <Img
        loader={<Preloader key="x" />}
        src={`${window.location.href}cat.jpg?rand=${rand}`}
        width="320"
        height="240"
        key={rand}
        container={(children) => {
          return (
            <ReactCSSTransitionReplace
              transitionEnterTimeout={fadeIn * 10}
              transitionLeaveTimeout={fadeOut}
              transitionName="fade-wait"
              changeWidth={true}
            >
              {children}
            </ReactCSSTransitionReplace>
          )
        }}
      />
    )}
  </DemoContainer>
)
