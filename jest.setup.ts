import {TextEncoder} from 'util'

Object.defineProperty(window, 'TextEncoder', {
  writable: true,
  value: TextEncoder,
})
