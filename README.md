# React Image 🏝 🏖 🏜

[![npm](https://img.shields.io/npm/v/react-image.svg?style=flat-square)](https://www.npmjs.com/package/react-image)
[![npm](https://img.shields.io/npm/l/react-image.svg?style=flat-square)](https://www.npmjs.com/package/react-image)
[![npm](https://img.shields.io/npm/dt/react-image.svg?style=flat-square)](https://www.npmjs.com/package/react-image)
[![npm](https://img.shields.io/npm/dm/react-image.svg?style=flat-square)](https://www.npmjs.com/package/react-image)
[![Known Vulnerabilities](https://snyk.io/test/github/mbrevda/react-image/badge.svg)](https://snyk.io/test/github/mbrevda/react-image)

**React Image** is an `<img>` tag replacement and hook for [React.js](https://facebook.github.io/react/), supporting fallback to alternate sources when loading an image fails.

**React Image** allows one or more images to be used as fallback images in the event that the browser couldn't load the previous image. When using the component, you can specify any React element to be used before an image is loaded (i.e. a spinner) or in the event that the specified image(s) could not be loaded. When using the hook this can be achieved by wrapping the component with [`<Suspense>`](https://reactjs.org/docs/react-api.html#reactsuspense) and specifying the `fallback` prop.

**React Image** uses the `useImage` hook internally which encapsulates all the image loading logic. This hook works with React Suspense by default and will suspend painting until the image is downloaded and decoded by the browser.

## Getting started

1. To include the code locally in ES6, CommonJS, or UMD format, install `react-image` using npm:

```
npm install react-image --save
```

2. To include the code globally from a cdn:

```html
<script src="https://unpkg.com/react-image/umd/index.js"></script>
```

## Dependencies

`react-image` has no external dependencies, aside for a version of `react` and `react-dom` which support hooks and `@babel/runtime`.

## Documentation

You can use the standalone component, documented below, or the `useImage` hook.

### useImage():

The `useImage` hook allows for incorperating `react-image`'s logic in any component. When using the hook, the component can be wrapped in `<Suspense>` to keep it from rendering until the image is ready. Specify the `fallback` prop to show a spinner or any other component to the user while the browser is loading. The hook will throw an error if it failes to find any images. You can wrap your componenet with an [Error Boundry](https://reactjs.org/docs/code-splitting.html#error-boundaries) to catch this scenario and do/show something.

Example usage:

```js
import React, {Suspense} from 'react'
import {useImage} from 'react-image'

function MyImageComponent() {
  const {src} = useImage({
    srcList: 'https://www.example.com/foo.jpg',
  })

  return <img src={src} />
}

export default function MyComponent() {
  return (
    <Suspense>
      <MyImageComponent />
    </Suspense>
  )
}
```

### `useImage` API:

- `srcList`: a string or array of strings. `useImage` will try loading these one at a time and returns after the first one is successfully loaded

- `imgPromise`: a promise that accepts a url and returns a promise which resolves if the image is successfully loaded or rejects if the image doesn't load. You can inject an alternative implementation for advanced custom behaviour such as logging errors or dealing with servers that return an image with a 404 header

- `useSuspense`: boolean. By default, `useImage` will tell React to suspend rendering until an image is downloaded. Suspense can be disabled by setting this to false.

**returns:**

- `src`: the resolved image address
- `isLoading`: the currently loading status. Note: this is never true when using Suspense
- `error`: any errors ecountered, if any

### Standalone component (legacy)

When possible, you should use the `useImage` hook. This provides for greater flexability and provides support for React Suspense.

Include `react-image` in your component:

```js
import {Img} from 'react-image'
```

and set a source for the image:

```js
const myComponent = () => <Img src="https://www.example.com/foo.jpg" />
```

will resolve to:

```js
<img src="https://www.example.com/foo.jpg">
```

If the image cannot be loaded, **`<img>` will not be rendered**, preventing a "broken" image from showing.

### Multiple fallback images:

When `src` is specified as an array, `react-image` will attempt to load all the images specified in the array, starting at the first and continuing until an image has been successfully loaded.

```js
const myComponent = () => (
  <Img
    src={['https://www.example.com/foo.jpg', 'https://www.example.com/bar.jpg']}
  />
)
```

If an image has previously been attempted unsuccessfully, `react-image` will not retry loading it again until the page is reloaded.

### Show a "spinner" or other element before the image is loaded:

```js
const myComponent = () => (
  <Img
    src={['https://www.example.com/foo.jpg', 'https://www.example.com/bar.jpg']}
    loader={/*any valid react element */}
  />
)
```

If an image was previously loaded successfully (since the last time the page was loaded), the loader will not be shown and the image will be rendered immediately instead.

### Show a fallback element if none of the images could be loaded:

```js
const myComponent = () => (
  <Img
    src={['https://www.example.com/foo.jpg', 'https://www.example.com/bar.jpg']}
    unloader={/*any valid react element */}
  />
)
```

### NOTE:

The following options only apply to the `<Img>` component, not to the `useImage` hook. When using the hook you can inject a custom image resolver with custom behaviour as required.

### Decode before paint

By default and when supported by the browser, `react-image` uses [`Image.decode()`](https://html.spec.whatwg.org/multipage/embedded-content.html#dom-img-decode) to decode the image and only render it when it's fully ready to be painted. While this doesn't matter much for vector images (such as svg's) which are rendered immediately, decoding the image before painting prevents the browser from hanging or flashing while the image is decoded. If this behaviour is undesirable, it can be disabled by setting the `decode` prop to `false`:

```js
const myComponent = () => (
  <Img src={'https://www.example.com/foo.jpg'} decode={false} />
)
```

### Loading images with a CORS policy

When loading images from another domain with a [CORS policy](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes), you may find you need to use the `crossorigin` attribute. For example:

```js
const myComponent = () => (
  <Img src={'https://www.example.com/foo.jpg'} crossorigin="anonymous" />
)
```

### Animations and other advanced uses

A wrapper element `container` can be used to facilitate higher level operations which are beyond the scope of this project. `container` takes a single property, `children` which is whatever is passed in by **React Image** (i.e. the final `<img>` or the loaders).

For example, to animate the display of the image (and animate out the loader) a wrapper can be set:

```js
<Img
  src={'https://www.example.com/foo.jpg'}
  container={(children) => {
    return <div className="foo">{children}</div>
  }}
/>
```

The `<img>` will now be contained by the `div` with class `foo` which can be targeted via css.
A crude example of a transition using [ReactCSSTransitionReplace](https://github.com/marnusw/react-css-transition-replace) can be [found here](https://github.com/mbrevda/react-image/tree/master/site). Error reporting (i.e. logging images that loaded ok or failed to load) can be accomplished with `container`, too.
A sample implementation can be [found here](https://github.com/mbrevda/react-image/pull/192#issuecomment-384340042).

By default, the loader and unloader components will also be wrapped by the `container` component. These can be set independently by passing a container via `loaderContainer` or `unloaderContainer`. To disable the loader or unloader from being wrapped, pass a noop to `loaderContainer` or `unloaderContainer` (like `unloaderContainer={img => img}`).

## Recipes

### Delay rendering until element is visible (lazy rendering)

By definition, **React Image** will try loading images right away. This may be undesirable in some situations, such as when the page has many images. As with any react element, rendering can be delayed until the image is actually visible in the viewport using popular libraries such as [`react-visibility-sensor`](https://www.npmjs.com/package/react-visibility-sensor). Here is a quick sample (psudocode/untested!):

```js
import {Img} from 'react-image'
import VisibilitySensor from 'react-visibility-sensor'

const myComponent = () =>
  <VisibilitySensor>
    <Img src='https://www.example.com/foo.jpg'>
  </VisibilitySensor>
```

Note: it is not nesesary to use **React Image** to prevent loading of images past "the fold" (i.e. not currently visable on in the window). Instead just use the native HTML `<img>` element and the `loading="lazy"` prop. See more [here](https://addyosmani.com/blog/lazy-loading/).

### Animate image loading

see above

## License

`react-image` is available under the MIT License
