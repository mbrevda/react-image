React Image 🏝 🏖 🏜
===

[![npm](https://img.shields.io/npm/v/react-image.svg?style=flat-square)](https://www.npmjs.com/package/react-image)
[![npm](https://img.shields.io/npm/l/react-image.svg?style=flat-square)](https://www.npmjs.com/package/react-image)
[![npm](https://img.shields.io/npm/dt/react-image.svg?style=flat-square)](https://www.npmjs.com/package/react-image)
[![npm](https://img.shields.io/npm/dm/react-image.svg?style=flat-square)](https://www.npmjs.com/package/react-image)
[![Known Vulnerabilities](https://snyk.io/test/github/mbrevda/react-image/badge.svg)](https://snyk.io/test/github/mbrevda/react-image)
[![wercker status](https://app.wercker.com/status/51bfd9b8aa6e52acf77310e17f00aff4/s/master "wercker status")](https://app.wercker.com/project/byKey/51bfd9b8aa6e52acf77310e17f00aff4)
[![codecov](https://codecov.io/gh/mbrevda/react-image/branch/master/graph/badge.svg)](https://codecov.io/gh/mbrevda/react-image)


**React Image** is an `<img>` tag replacement for [React.js](https://facebook.github.io/react/), featuring preloader and multiple image fallback support.

With **React Image** you can specify multiple images to be used as fallbacks in the event that the browser couldn't load the previous image. Additionally, you can specify any React element to be used before an image is loaded (i.e. a spinner) and in the event than the specified image(s) could not be loaded.

**React Image** will cleverly hide "broken" images to prevent showing the browsers default "broken image"  placeholder. **React Image** caches past attempts to load an image so that the same image won't be attempted to be pulled over the network again, until the next page reload.

This package was formerly known as `react-img-multi`. Special thanks to @yuanyan for agreeing to relinquish the name!

Getting started
---

1. To include the code locally in ES6, CommonJS, or UMD format, install `react-image` using npm:

  ```
  npm install react-image --save
  ```

2. To include the code globally from a cdn:
  ```html
  <script src="https://unpkg.com/react-image/umd/index.min.js"></script>
  ```

Dependencies
---
`react-image` has no external dependencies, aside for the usual `react` and `react-dom`.


Documentation
---
Include `react-image` in your component:

```js
// using an ES6 transpiler, like babel
import Img from 'react-image'

// otherwise
let Img = require('react-image')
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
When `src` is specified as an array, `react-image` will attempt to load all the images specified in the array, starting at the first and continuing until an image has been successfully loaded.

```js
const myComponent = () =>
  <Img src={[
    'https://www.example.com/foo.jpg',
    'https://www.example.com/bar.jpg'
  ]}>
```
If an image has previously been attempted unsuccessfully, `react-image` will not retry loading it again until the page is reloaded.

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

### Decoding before paint
By default and when supported by the browser, `react-image` uses [`img.decode()`](https://html.spec.whatwg.org/multipage/embedded-content.html#dom-img-decode) to decode the image and only render it when it's fully ready to be painted. While this doesn't matter much for vector images (such as svg's) which are rendered immediately, decoding the image before painting prevents the browser from hanging or flashing while the image is decoded. If this behaviour is undesirable, it can be disabled by setting the `decode` prop to `false`:

```js
const myComponent = () =>
  <Img
    src={'https://www.example.com/foo.jpg'}
    decode={false}
  >
```

Recipes
---
### Delay rendering until element is visible (lazy rendering)
By definition, **React Image** will try loading images as soon as the `<Img>` element is rendered in the DOM. This may be undesirable in some situations, such as when the page has many images. As with any react element, rendering can be delayed until the image is actually visible in the viewport using popular libraries such as [`react-visibility-sensor`](https://www.npmjs.com/package/react-visibility-sensor). Here is a quick sample (untested!):
```js
import Img from 'react-image'
import VisibilitySensor from 'react-visibility-sensor'

const myComponent = () =>
  <VisibilitySensor>
    <Img src='https://www.example.com/foo.jpg'>
  </VisibilitySensor>
```


Browser Support
---
`react-image` does not include an `Object.assign` polyfill, that may be needed [depending on your targeted browsers](http://kangax.github.io/compat-table/es6/#test-Object_static_methods_Object.assign). You can add it in one of the following ways:

1. include it in your package: `https://www.npmjs.com/package/es6-object-assign`

2. Use Mozilla's polyfill: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill

3. Include the following code before including `react-image`:

  ```js
  Object.assign||function(r){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(r[a]=n[a])}return r};
  ```

License
---
`react-image` is available under the MIT License
