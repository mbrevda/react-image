1.5.1
===
* update babel loader to v7

1.5.0
===
* Add: `loaderContainer`/`unloaderContainer` (#208, #211). Thanks @eedrah!
* Test: test built libs

1.4.1
===
* Fix: strip dev-specific code when compiling

1.4.0
===
* Add: `container` props
* Fix: issue deleting `src` prop in Safari (#87)
* Add: `babel-runtime` as peer dep for https://pnpm.js.org/ (#199, #200). Thanks @vjpr!
* Add: (crude) demo including transitions

1.3.1
===
* bug: Don't pass decode prop to underlying `<img>`

1.3.0
===
* Use img.decode() by default where available

1.2.0
===
* Add support for React 16

1.0.1
===
* move to new prop-types package
* add 100% test coverage

1.0.0
===
* Renamed to react-image

0.6.3
===
* Housekeeping: update dependencies
* Add recipes

0.6.2
===
* Fix Readme formatting

0.6.1
===
* Start iteration at current location

0.6.0
===
* Add a cache so that we don't attempt the same image twice (per page load)

0.5.0
===
* Fix issue where index would overshoot available sources
* Don't try setting state if `this.i` was already destroyed, which probably means that we have been unmounted

0.4.2
===
* Remove Browsierfy config

0.4.1
===
* Revert 0.4.0

0.3.0
===
* Don't overshoot sourceList when state.currentIndex
* Ensure state has been set before trying to load images when new props are delivered

0.2.0
===
* Restart the loading process when src prop changes

0.1.0
===
* Don't use <img> until we know the image can be rendered. This will prevent the "jumping"
when loading an image and the preloader is displayed at the same time as the image

0.0.11
===
* Don't require `src` to be set

0.0.10
===
* Made react a peer depends

0.0.8
===

* Return `null` instead of false from React component. Thanks @tikotzky!
