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
