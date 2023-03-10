import React from 'react'
import {render} from 'react-dom'
import SimpleDemo from './SimpleDemo.js'
import TransitionDemo from './TransitionDemo.js'

// render(<SimpleDemo />, document.getElementById('body'))
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {hasError: false}
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({hasError: true})
    console.error(error)
    console.info(info)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>
    }
    return this.props.children
  }
}
render(
  <ErrorBoundary>
    <SimpleDemo />
    {/* <TransitionDemo /> */}
  </ErrorBoundary>,
  document.getElementById('body')
)
