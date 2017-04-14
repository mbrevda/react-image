React Image Multi 🏝 🏖 🏜
===

[![npm](https://img.shields.io/npm/v/react-img-multi.svg?style=flat-square)](https://www.npmjs.com/package/react-img-multi)
[![npm](https://img.shields.io/npm/l/react-img-multi.svg?style=flat-square)](https://www.npmjs.com/package/react-img-multi)
[![npm](https://img.shields.io/npm/dt/react-img-multi.svg?style=flat-square)](https://www.npmjs.com/package/react-img-multi)
[![npm](https://img.shields.io/npm/dm/react-img-multi.svg?style=flat-square)](https://www.npmjs.com/package/react-img-multi)
[![Known Vulnerabilities](https://snyk.io/test/npm/react-img-multi/badge.svg)](https://snyk.io/test/npm/react-img-multi)
[![wercker status](https://app.wercker.com/status/deff357a6b8d111f465c78e690dc9019/s/master "wercker status")](https://app.wercker.com/project/byKey/deff357a6b8d111f465c78e690dc9019)

**React Image Multi** is an `<img>` tag replacement for [React.js](https://facebook.github.io/react/) with preloader and multiple image fallback support.

With **React Image Multi** you can specify multiple images to be used as fallbacks in the event that the browser couldn't load the previous image. Additionally, you can specify any React element to be used before an image is loaded (i.e. a spinner) and in the event than the specified image(s) could not be loaded.

**React Image Multi** will cleverly hide "broken" images to prevent showing a the browser default "broken image"  placeholder. **React Image Multi** caches past attempts so that the same image won't be attempted twice.

Getting started
---

1. To include the code locally in ES6, CommonJS, or UMD format, install `react-img-multi` using npm:

  ```
  npm install react-img-multi --save
  ```

2. To include the code globally from a cdn:
  ```html
  <script src="https://unpkg.com/react-img-multi/umd/index.min.js"></script>
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
<img src="www.example.com/foo.jpg">
```
If the image cannot be loaded, **`<img>` will not be rendered**, preventing a "broken" image from showing.

### Multiple fallback images:
When `src` is specified as an array, `react-img-multi` will attempt to load all the images specified in the array, starting at the first and continuing until an image has been successfully loaded.

```js
const myComponent = () =>
  <Img src={[
    'https://www.example.com/foo.jpg',
    'https://www.example.com/bar.jpg'
  ]}>
```
If an image has previously been attempted unsuccessfully, `react-img-multi` will not retry loading it again until the page is reloaded.

### Show a "spinner" or other element before the image is loaded:
```js
const myComponent = () =>
  <Img
    src={[
      'https://www.example.com/foo.jpg',
      'https://www.example.com/bar.jpg'
    ]}
    loader={/*any valid react element */}
  >
```
If an image was previously loaded successfully (since the last time this page was loaded), the loader will not be shown and the image will be rendered directly instead.


### Show a fallback element if non of the images could be loaded:
```js
const myComponent = () =>
  <Img
    src={[
      'https://www.example.com/foo.jpg',
      'https://www.example.com/bar.jpg'
    ]}
    unloader={/*any valid react element */}
  >
```

Recipes
---
### Delay rendering until element is visible
By definition, **React Image Multi** will try loading images as soon as the `<Img>` element is rendered in the DOM. This may be undesirable in some situations, such as when the page has many images. As with any react element, rendering can be delayed until the image is actually visible in the viewport using popular libraries such as [`react-visibility-sensor`](https://www.npmjs.com/package/react-visibility-sensor). Here is a quick sample:
```js
import Img from 'react-img-multi'
import VisibilitySensor from 'react-visibility-sensor'

const myComponent = () =>
  <VisibilitySensor>
    <Img src='https://www.example.com/foo.jpg'>
  </VisibilitySensor>
```


Browser Support
---
`react-img-multi` does not include an `Object.assign` polyfill, that may be needed [depending on your targeted browsers](http://kangax.github.io/compat-table/es6/#test-Object_static_methods_Object.assign). You can add it in one of the following ways:

1. include it in your package: `https://www.npmjs.com/package/es6-object-assign`

2. Use Mozilla's polyfill: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill

3. Include the following code before including `react-img-multi`:

  ```js
  Object.assign||function(r){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(r[a]=n[a])}return r};
  ```

License
---
`react-img-multi` is available under the MIT License
