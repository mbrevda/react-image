import React from 'react'
import ReactDOM from 'react-dom'
import Img from '../src/index.js'

function App() {
  const imageOn404 =
    'https://i9.ytimg.com/s_p/OLAK5uy_mwasty2cJpgWIpr61CqWRkHIT7LC62u7s/sddefault.jpg?sqp=CJz5ye8Fir7X7AMGCNKz4dEF&rs=AOn4CLC-JNn9jj-oFw94oM574w36xUL1iQ&v=5a3859d2'
  const tmdbImg =
    'https://image.tmdb.org/t/p/w500/kqjL17yufvn9OVLyXYpvtyrFfask.jpg'
  return (
    <>
      <div>
        <h5>Should show</h5>
        <Img style={{width: 100}} src="http://i.imgur.com/ozEaj1Z.jpg" />
      </div>

      <div>
        <h5>Should not show anything</h5>
        <Img style={{width: 100}} src={[imageOn404]} />
      </div>
    </>
  )
}

const node = document.createElement('div')
node.id = 'root'
document.body.appendChild(node)
const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
