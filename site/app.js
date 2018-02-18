import React from 'react'
import {render} from 'react-dom'
import SimpleDemo from './SimpleDemo.js'
//import Shell from 'src/containers/Shell.js'
// if (process.env.NODE_ENV === 'production') {
//   import(/* webpackChunkName: 'reporters' */ './reporters').then(
//     ({setupReporters}) => setupReporters()
//   )
// }

render(<SimpleDemo />, document.getElementById('body'))
