import React, {Component} from 'react'

export default class DemoContainer extends Component {
  constructor() {
    super()
    this.state = {rand: Math.random()}
  }

  render() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          height: 276,
          width: 320
        }}
      >
        {this.props.children({rand: this.state.rand})}
        <div>{this.props.title}</div>
        <button onClick={() => this.setState({rand: Math.random()})}>
          Reload
        </button>
      </div>
    )
  }
}
