import React, {Component} from 'react'

const { node, oneOfType, string, array } = React.PropTypes

class Img extends Component {
    static propTypes = {
        loader: node,
        unloader: node,
        src: oneOfType([string, array])
    }

    static defaultProps = {loader: false}

    onLoad = () => this.setState({isLoaded: true})

    onError = () => {
        // overshoot by one. If no image is found, this will prevent a "broken"
        // placeholder from showing
        if (this.state.currentImageIndex + 1< this.state.imageList.length) {
            this.setState({currentImageIndex: ++this.state.currentImageIndex})
        }
    }

    placeholder = () => {
        if(!this.state.isLoaded) {
            this.state.isLoading ? this.props.loader : this.props.unloader
        }
    }

    state = {currentImageIndex: 0, isLoading: true, isLoaded: false}

    componentWillMount() {
        this.setState({imageList: typeof this.props.src == 'string' ? [this.props.src] : this.props.src})
    }

    render() {
        const {src, loader, unloader, ...rest} = this.props //eslint-disable-line

        return (
            <span>
                <img
                    src={this.state.imageList[this.state.currentImageIndex]}
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
