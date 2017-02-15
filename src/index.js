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
  srcToArray = src => (Array.isArray(src) ? src : [src]).filter(x => x)

  onError = () => {
    // currentIndex is zero bases, length is 1 based.
    // if we have no more sources to try, return - we are done
    if (this.state.currentIndex === this.sourceList.length) return this.setState({isLoading: false})

    this.setState({currentIndex: ++this.state.currentIndex})

    // otherwise, try the next img
    this.loadImg()
  }

  loadImg = () => {
    this.i = new Image()
    this.i.src = this.sourceList[this.state.currentIndex]
    this.i.onload = this.onLoad
    this.i.onerror = this.onError
  }

  unloadImg = () => {
    this.i.onerror = null
    this.i.onload = null
    this.i.src = null
    this.i = null
  }

  componentWillMount () {
    this.sourceList = this.srcToArray(this.props.src)
    // if we dont have any sources, jump directly to fallback
    if (!this.sourceList.length) return this.setState({isLoading: false, isLoaded: false})
  }

  componentDidMount () {
    // kick off process
    this.loadImg()
  }

  componentWillUnmount () {
    // ensure that we dont leave any lingering listeners
    this.unloadImg()
  }

  componentWillReceiveProps (nextProps) {
    let src = this.srcToArray(nextProps.src)
    if (!src.length) return true

    let srcAdded = src.filter(s => this.sourceList.indexOf(s) === -1)
    let srcRemoved = this.sourceList.filter(s => src.indexOf(s) === -1)

    // if src prop changed, restart the loading process
    if (srcAdded.length || srcRemoved.length) {
      this.sourceList = src
      this.setState({currentIndex: 0, isLoading: true, isLoaded: false}, this.loadImg)
    }
  }

  render () {
    // if we have loaded, show img
    if (this.state.isLoaded) {
      // clear non img props
      let {src, loader, unloader, ...rest} = this.props //eslint-disable-line
      return <img src={this.sourceList[this.state.currentIndex]} {...rest} />
    }

    // if we are still trying to load, show img and a loader if requested
    if (!this.state.isLoaded && this.state.isLoading) return this.props.loader ? this.props.loader : null

    // if we have given up on loading, show a place holder if requested, or nothing
    if (!this.state.isLoaded && !this.state.isLoading) return this.props.unloader ? this.props.unloader : null
  }
}

export default Img
