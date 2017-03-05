import React, {Component} from 'react'

const { node, oneOfType, string, array } = React.PropTypes
const cache = {}
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

  constructor (props) {
    super(props)

    this.sourceList = this.srcToArray(this.props.src)

    // check cache to decide at which index to start
    for (let i = 0; i < this.sourceList.length; i++) {
      // if we've never seen this image before, the cache wont help.
      // no need to look further, just start loading
      if (!(this.sourceList[i] in cache)) break

      // if we have loaded this image before, just load it again
      if (cache[this.sourceList[i]] === true) {
        this.state = {currentIndex: i, isLoading: false, isLoaded: true}
        return true
      }
    }

    this.state = this.sourceList.length
        // 'normal' opperation: start at 0 and try to load
        ? {currentIndex: 0, isLoading: true, isLoaded: false}
        // if we dont have any sources, jump directly to unloaded
        : {isLoading: false, isLoaded: false}
  }

  srcToArray = src => (Array.isArray(src) ? src : [src]).filter(x => x)

  onLoad = () => {
    cache[this.sourceList[this.state.currentIndex]] = true
    if (this.i) this.setState({isLoaded: true})
  }

  onError = () => {
    cache[this.sourceList[this.state.currentIndex]] = false
    // if the current image has already been destroyed, we are probably no longer mounted
    // no need to do anything then
    if (!this.i) return

    // itterate to the next source in the list
    let nextIndex = this.state.currentIndex + 1

    // currentIndex is zero bases, length is 1 based.
    // if we have no more sources to try, return - we are done
    if (nextIndex === this.sourceList.length) return this.setState({isLoading: false})

    // before loading the next image, check to see if it was ever loaded in the past
    for (let i = nextIndex; i < this.sourceList.length; i++) {
      // get next img
      let src = this.sourceList[i]

      // if we have never seen it, its the one we want to try next
      if (!(src in cache)) {
        this.setState({currentIndex: i})
        break
      }

      // if we know it exists, use it!
      if (cache[src] === true) {
        this.setState({currentIndex: i, isLoading: false, isLoaded: true})
        return true
      }

      // if we know it doesn't exist, skip it!
      if (cache[src] === false) continue
    }

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
    delete this.i.onerror
    delete this.i.onload
    delete this.i.src
    delete this.i
  }

  componentDidMount () {
    // kick off process
    if (this.state.isLoading) this.loadImg()
  }

  componentWillUnmount () {
    // ensure that we dont leave any lingering listeners
    if (this.i) this.unloadImg()
  }

  componentWillReceiveProps (nextProps) {
    let src = this.srcToArray(nextProps.src)

    let srcAdded = src.filter(s => this.sourceList.indexOf(s) === -1)
    let srcRemoved = this.sourceList.filter(s => src.indexOf(s) === -1)

    // if src prop changed, restart the loading process
    if (srcAdded.length || srcRemoved.length) {
      this.sourceList = src

      // if we dont have any sources, jump directly to unloader
      if (!src.length) return this.setState({isLoading: false, isLoaded: false})
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
