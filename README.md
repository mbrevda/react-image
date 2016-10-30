React Image Multi
===

**React Image Multi** is an `<img>` tag replacement for [React.js](https://facebook.github.io/react/) with preloader and multiple image fallback support.

With **React Image Multi** you can specify multiple images to be used as fallbacks in the event that the browser couldn't load the previous image. Additionally, you can specify any React element to be used before an image is loaded (i.e. a spinner) and in the event than the specified image(s) could not be loaded.

**React Image Multi** will cleverly hide "broken" images to prevent showing a the browser default "broken image"  placeholder.

Getting started
---

1. To include the code locally in ES6, CommonJS, or UMD format, install `react-img-multi` using npm:

  ```
  npm install react-img-multi --save
  ```

2. To include the code globally from a cdn:
  ```
  //TODO
  ```

Dependencies
---
`react-img-multi` has no external dependencies, aside for the usual `react` and `react-dom`.


Documentation
---
Include `react-img-multi` in your component:

```js
// using an ES6 transpiler, like babel
import Img from 'react-img-multi'

// otherwise
let Img = require('react-img-multi')
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

### Multiple fallback images:
When `src` is specified as an array, `react-img-multi` will attempt to load all the images specified in the array, starting at the first and continuing until an image has been successfully loaded.

```js
const myComponent = () =>
  <Img src={[
    'www.example.com/foo.jpg',
    'www.example.com/bar.jpg'
  ]}>
```

### Show a "spinner" or other element before the image is loaded:
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

### Show a fallback element if non of the images could be loaded:
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
`react-img-multi` dose not include an `Object.assign` polyfill, that may be needed [depending on your targeted browsers](http://kangax.github.io/compat-table/es6/#test-Object_static_methods_Object.assign). You can add it in one of the following ways:

1. include it in your package: `https://www.npmjs.com/package/es6-object-assign`

2. Use Mozilla's polyfill: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill

3. Include the following code before including `react-img-multi`:

  ```js
  Object.assign||function(r){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(r[a]=n[a])}return r};
  ```

License
---
