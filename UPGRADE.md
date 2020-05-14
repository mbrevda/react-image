# 4.0.0

All upgrade are now named exports, so:

```js
import Img from 'react-image'
```

needs to be changed to:

```js
import {Img} from 'react-image'
```

# 3.0.0

This version requires a version of react that supports hook (16.8 or greater)

# 1.0.0

For users of the original `react-image` only: please note props and behaviors changes for this release:

- `srcSet` is not supported
- `onLoad` & `onError` callbacks are currently private
- `lazy` has been removed from the core lib. To lazy load your images, see the recipes section [here](https://github.com/mbrevda/react-image#delay-rendering-until-element-is-visible)

If you have a need for any of these params, feel free to send a PR. You can also open an issue to discuss your use case.
