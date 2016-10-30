React Img
===

React img is an `<img>` tag replacement for react with support for a preloader and multiple fallback images.

Getting started
---

1. To include the code locally in ES6, CommonJS, or UMD format, install `react-img` using npm:

  ```
  npm install react-img --save
  ```

2. To include the code globally from a cdn:
  ```
  //TODO
  ```

Dependencies
---
React-Img has no external dependencies, aside for React and React-dom


Documentation
---
Include `react-img` in your component:

```js
// using an ES6 transpiler, like babel
import Img from 'react-img'

// otherwise
let Img = require('react-img')
```

and set a source for the image:

```js
const myComponent = () => <Img src="www.example.com/foo.jpg">
```

will generate:

```js
<span><img src="www.example.com/foo.jpg"></span>
```
If the image cannot be loaded, **`src` will be set to `src=""` or totally removed**, preventing a "broken" image from showing.

### Multiple fallback images are supported:
This will attempt to load the first image. If that won't load, it will attempt to load the second.
```js
const myComponent = () =>
  <Img src={[
    'www.example.com/foo.jpg',
    'www.example.com/bar.jpg'
  ]}>
```

### A "spinner" or other element can be shown before the image is loaded:
```js
const myComponent = () =>
  <Img
    src={[
      'www.example.com/foo.jpg',
      'www.example.com/bar.jpg'
    ]}
    loader={/*any valid react element */}
  >
```

### If non of the images could be loaded, a fallback element can be shown:
```js
const myComponent = () =>
  <Img
    src={[
      'www.example.com/foo.jpg',
      'www.example.com/bar.jpg'
    ]}
    unloader={/*any valid react element */}
  >
```

Browser Support
---
React-Img dose not include an `Object.assign` polyfill, that may be needed [depending on your targeted browsers](http://kangax.github.io/compat-table/es6/#test-Object_static_methods_Object.assign). You can add it in one of the following ways:

1. include it in your package: `https://www.npmjs.com/package/es6-object-assign`

2. Use Mozilla's polyfill: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill

3. Include the following code before including `react-img`:

  ```js
  Object.assign||function(r){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(r[a]=n[a])}return r};
  ```

License
---
