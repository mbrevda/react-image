import React, {Component} from 'react'
import Img from '../src'

export default class SimpleDemo extends Component {
  constructor() {
    super()
    this.state = {
      rand: Math.random()
    }
  }

  render() {
    const src = `${window.location.href}cat.jpg?rand=${this.state.rand}`

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          height: 240,
          width: 320
        }}
      >
        <Img
          loader={<img src="./loader.gif" />}
          src={`http://www.deelay.me/5000/${src}`}
          width="320"
          height="240"
          rand={this.state.rand}
        />
        <div>Demo with a slow loading image</div>
        <button onClick={() => this.setState({rand: Math.random()})}>
          Reload
        </button>
      </div>
    )
  }
}
