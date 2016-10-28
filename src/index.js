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

  onError = () => {
    // currentIndex is zero bases, length is 1 based. If no image is found, this
    // will prevent a "broken" placeholder from showing by setting src=""
    // or removing the src prop completely
    if (this.state.currentIndex < this.sourceList.length) {
      this.setState({currentIndex: ++this.state.currentIndex})
    } else {
      this.setState({isLoading: false})
    }
  }

  placeholder = () => {
    if (!this.state.isLoaded) {
      return this.state.isLoading ? this.props.loader : this.props.unloader
    }
  }

  componentWillMount () {
    this.sourceList = typeof this.props.src === 'string' ? [this.props.src] : this.props.src
  }

  render () {
    let {src, loader, unloader, ...rest} = this.props //eslint-disable-line
    src = this.sourceList[this.state.currentIndex]

    return (
      <span>
        <img
          src={src}
          onError={this.onError}
          onLoad={this.onLoad}
          {...rest}
        />
        {this.placeholder()}
      </span>
    )
  }
}

export default Img
