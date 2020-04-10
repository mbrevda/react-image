import React, {useEffect, useReducer, useRef} from 'react'
// function wrapPromise(promise) {
//   let status = 'pending'
//   let response

//   const suspender = promise.then(
//     res => {
//       status = 'success'
//       response = res
//     },
//     err => {
//       status = 'error'
//       response = err
//     }
//   )

//   const read = () => {
//     switch (status) {
//       case 'pending':
//         throw suspender
//       case 'error':
//         throw response
//       default:
//         return response
//     }
//   }

//   return {read}
// }

const defaultImgPromise = (decode) => (src) => {
  return new Promise((resolve, reject) => {
    const i = new Image()
    i.onload = () => {
      decode ? i.decode().then(resolve).catch(reject) : resolve()
    }
    i.onerror = reject
    i.src = src
  })
}

const promiseFind = (arr, promiseFactory) => {
  let canceled = false
  const find = new Promise((resolve, reject) => {
    let done = false
    const queueNext = (src) => {
      if (canceled) return reject('canceled')
      return promiseFactory(src).then(() => {
        done = true
        resolve(src)
      })
    }

    arr
      .reduce((p, src) => {
        return p.catch(() => {
          if (!done) return queueNext(src)
        })
      }, queueNext(arr.shift()))
      .catch(reject)
  })

  return {find, cancel: () => (canceled = true)}
}

const removeBlankArrayElements = (a) => a.filter((x) => x)
const stringToArray = (x) => (Array.isArray(x) ? x : [x])
const defaultState = {isLoading: true, isLoaded: false}

const reducer = (state, action) => {
  switch (action.type) {
    case 'wontload':
      return {...state, isLoading: false, isLoaded: false}
    case 'loaded':
      return {...state, isLoading: false, isLoaded: true, src: action.src}
    default:
      return state
  }
}

const useImage = (srcList, {decode, imgPromise}) => {
  const sourceList = removeBlankArrayElements(stringToArray(srcList))
  const sourceKey = sourceList.join('')
  const sourceKeyRef = useRef()
  let isMounted = true

  const [{isLoading, isLoaded, src}, dispatch] = useReducer(
    reducer,
    defaultState
  )

  // console.log({isLoading, isLoaded, src, sourceList})
  useEffect(() => {
    if (sourceKeyRef.current !== sourceKey) {
      sourceKeyRef.current = sourceKey

      const {find, cancel} = promiseFind(sourceList, imgPromise(decode))
      find
        .then((src) => isMounted && dispatch({type: 'loaded', src}))
        .catch(() => isMounted && dispatch({type: 'wontload'}))

      return () => {
        isMounted = false
        cancel()
      }
    }
  }, [sourceList, decode, isLoaded, sourceKey])

  return {src, isLoaded, isLoading}
}

const simpleContainer = (x) => x

export default function Img({
  decode = true,
  src = [],
  loader = null,
  unloader = null,
  container = simpleContainer,
  loaderContainer = simpleContainer,
  unloaderContainer = simpleContainer,
  imgPromise = defaultImgPromise, // used for testing
  ...imgProps // anything else will be passed to the <img> element
}) {
  const {src: resolvedSrc, isLoaded, isLoading} = useImage(src, {
    decode,
    imgPromise,
  })

  // console.log({isLoading, isLoaded, resolvedSrc})

  // show img if loaded
  if (resolvedSrc) return container(<img src={resolvedSrc} {...imgProps} />)

  // show loader if we have one and were still trying to load image
  if (isLoading) return loaderContainer(loader)

  // show unloader if we have one and we have no more work to do
  if (unloader) return unloaderContainer(unloader)

  return null
}
