import React, {useEffect, useState} from 'react'

const removeBlankArrayElements = (a) => a.filter((x) => x)
const stringToArray = (x) => (Array.isArray(x) ? x : [x])
const state = {}

// Promisized version of Image() api
const defaultImgPromise = (decode = true) => (src) => {
  return new Promise((resolve, reject) => {
    const i = new Image()
    i.onload = () => {
      decode ? i.decode().then(resolve).catch(reject) : resolve()
    }
    i.onerror = reject
    i.src = src
  })
}

// sequential map.find for promises
const promiseFind = (arr, promiseFactory) => {
  let done = false
  return new Promise((resolve, reject) => {
    const queueNext = (src) => {
      return promiseFactory(src).then(() => {
        done = true
        resolve(src)
      })
    }

    arr
      .reduce((p, src) => {
        // ensure we aren't done before enquing the next source
        return p.catch(() => {
          if (!done) return queueNext(src)
        })
      }, queueNext(arr.shift()))
      .catch(reject)
  })
}

const useImage = ({
  srcList,
  imgPromise = defaultImgPromise(true),
  useSuspense = true,
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const sourceList = removeBlankArrayElements(stringToArray(srcList))
  const sourceKey = sourceList.join('')

  if (!state[sourceKey]) {
    // create promise to loop through sources and try to load one
    const find = promiseFind(sourceList, imgPromise)
      // if a source was found, update state
      // when not using suspense, update state to force a rerender
      .then((src) => {
        state[sourceKey] = {...state[sourceKey], state: 'resolved', src}
        if (!useSuspense) setIsLoading(false)
      })

      // if no source was found, or if another error occured, update state
      // when not using suspense, update state to force a rerender
      .catch((error) => {
        state[sourceKey] = {...state[sourceKey], state: 'rejected', error}
        if (!useSuspense) setIsLoading(false)
      })

    state[sourceKey] = {
      promise: find,
      state: 'pending',
      error: null,
    }
  }

  if (state[sourceKey].state === 'resolved') {
    return {src: state[sourceKey].src}
  }

  if (state[sourceKey].state === 'pending') {
    if (useSuspense) throw state[sourceKey].promise
    return {isLoading: true}
  }

  if (state[sourceKey].state === 'rejected') {
    if (useSuspense) throw state[sourceKey].error
    return {isLoading: false, error: state[sourceKey].error}
  }
}

export {useImage}

const simpleContainer = (x) => x

export default function Img({
  decode = true,
  src: srcList = [],
  loader = null,
  unloader = null,
  container = simpleContainer,
  loaderContainer = simpleContainer,
  unloaderContainer = simpleContainer,
  imgPromise = defaultImgPromise,
  useSuspense = false,
  ...imgProps // anything else will be passed to the <img> element
}) {
  const {src, isLoading} = useImage({
    srcList,
    imgPromise: imgPromise(decode),
    useSuspense,
  })

  // console.log({src, isLoading, resolvedSrc, useSuspense})

  // show img if loaded
  if (src) return container(<img src={src} {...imgProps} />)

  // show loader if we have one and were still trying to load image
  if (!useSuspense && isLoading) return loaderContainer(loader)

  // show unloader if we have one and we have no more work to do
  if (!useSuspense && unloader) return unloaderContainer(unloader)

  return null
}
