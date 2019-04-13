import React, {useEffect, useReducer} from 'react'

const removeBlankArrayElements = a => a.filter(x => x)
const stringToArray = x => (Array.isArray(x) ? x : [x])
const defaultState = {index: 0, isLoading: true, isLoaded: false}

const reducer = (state, action) => {
  switch (action.type) {
    case 'wontload':
      return {...state, isLoading: false, isLoaded: false}
    case 'loaded':
      return {...state, isLoading: false, isLoaded: true}
    case 'trynext':
      return {...state, index: state.index + 1}
    case 'startover':
      return {...state, ...defaultState}
    default:
      return state
  }
}

const simpleContainer = x => x

export default function Img({
  loader = false,
  unloader = false,
  decode = true,
  src = [],
  container = simpleContainer,
  loaderContainer = simpleContainer,
  unloaderContainer = simpleContainer,
  mockImage, // used for testing
  ...imgProps // anything else will be passed to the <img> element
}) {
  const sourceList = removeBlankArrayElements(stringToArray(src))
  const sourceKey = sourceList.join('')

  const [{isLoading, isLoaded, index}, dispatch] = useReducer(
    reducer,
    defaultState
  )
  //console.log({isLoading, isLoaded, sourceList, src, index})

  useEffect(() => dispatch({type: 'startover'}), [sourceKey])
  useEffect(() => {
    let i = mockImage || new Image()

    // Image callbacks. Only run if `i` exists (i.e. if still mounted)
    const onLoad = () => i && dispatch({type: 'loaded'})
    const onError = () => i && dispatch({type: 'trynext'})

    i.onload = onLoad
    i.onerror = onError

    if (!isLoaded) {
      if (index >= sourceList.length) {
        // if there are no images left to process, give up
        dispatch({type: 'wontload'})
      } else {
        // setup decode handler if supported
        if (decode && i.decode) {
          i.decode()
            .then(onLoad)
            .catch(onError)
        }

        // set `src` to the current source and start downloading the image
        i.src = sourceList[index]
      }
    }

    // on unmount, clear callbacks to prevent them from running on an
    // unmounted component
    // also clear `src`, which aborts any current downloads on most browsers
    return () => {
      i.src = i.onerror = i.onload = null
      i = null
    }
  }, [index, sourceList, decode, isLoaded, mockImage])

  // show img if loaded
  if (isLoaded) return container(<img src={sourceList[index]} {...imgProps} />)

  // show loader if we have one and were still trying to load image
  if (!isLoaded && isLoading && loader) return loaderContainer(loader)

  // show unloader if we have one and we have no more work to do
  if (!isLoaded && !isLoading && unloader) return unloaderContainer(unloader)

  return null
}
