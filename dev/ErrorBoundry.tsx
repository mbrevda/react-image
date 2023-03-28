import React, {Component} from 'react'

export interface ErrorBoundary {
  props: {
    children: React.ReactNode
    onError?: React.ReactNode
  }
}
export class ErrorBoundary extends Component implements ErrorBoundary {
  state: {
    hasError: boolean
    error: Error | null
  }
  onError: React.ReactNode

  constructor(props) {
    super(props)
    this.state = {hasError: false, error: null}
    this.onError = props.onError
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {hasError: error, error}
  }

  render() {
    if (this.state.hasError) {
      if (this.onError) return this.onError
      // You can render any custom fallback UI
      return <code>Something went wrong. {this.state.error?.message}</code>
    }

    return this.props.children
  }
}
