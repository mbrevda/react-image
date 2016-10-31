import React, {Component} from 'react'

const { node, oneOfType, string, array } = React.PropTypes

class Img extends Component {
  static propTypes = {
    loader: node,
    unloader: node,
    src: oneOfType([string, array])
  }

  static defaultProps = {
    loader: false,
    unloader: false,
    src: []
  }

  state = {currentIndex: 0, isLoading: true, isLoaded: false}
  sourceList = []
  onLoad = () => this.setState({isLoaded: true})
  img = props => <img {...props} />
  onError = () => {
    // currentIndex is zero bases, length is 1 based.
    this.setState({currentIndex: ++this.state.currentIndex})
    if (this.state.currentIndex >= this.sourceList.length) this.setState({isLoading: false})
  }

  componentWillMount () {
    this.sourceList = typeof this.props.src === 'string' ? [this.props.src] : this.props.src
  }

  render () {
    let {src, loader, unloader, ...rest} = this.props //eslint-disable-line
    src = this.sourceList[this.state.currentIndex]

    let img = this.img({src, onError: this.onError, onLoad: this.onLoad, ...rest})

    // if we have loaded, show img
    if (this.state.isLoaded) return img

    // if we are still trying to load, show img and a loader if requested
    if (!this.state.isLoaded && this.state.isLoading) return this.props.loader ? <span>{this.props.loader}{img}</span> : img

    // if we have given up on loading, show a place holder if requested, or nothing
    if (!this.state.isLoaded && !this.state.isLoading) return this.props.unloader ? this.props.unloader : false
  }
}

export default Img
