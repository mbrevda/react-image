import React from 'react'
import useImage, {useImageProps} from './useImage'
import imagePromiseFactory from './imagePromiseFactory'

export type ImgProps = Omit<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >,
  'src'
> &
  Omit<useImageProps, 'srcList'> & {
    src: useImageProps['srcList'] // same types, different name
    loader?: JSX.Element | null
    unloader?: JSX.Element | null
    decode?: boolean
    crossorigin?: string
    container?: (children: React.ReactNode) => JSX.Element
    loaderContainer?: (children: React.ReactNode) => JSX.Element
    unloaderContainer?: (children: React.ReactNode) => JSX.Element
  }

const passthroughContainer = (x) => x

export default function Img({
  decode = true,
  src: srcList = [],
  loader = null,
  unloader = null,
  container = passthroughContainer,
  loaderContainer = passthroughContainer,
  unloaderContainer = passthroughContainer,
  imgPromise,
  crossorigin,
  useSuspense = false,
  ...imgProps // anything else will be passed to the <img> element
}: ImgProps): JSX.Element | null {
  imgPromise =
    imgPromise || imagePromiseFactory({decode, crossOrigin: crossorigin})
  const {src, isLoading} = useImage({
    srcList,
    imgPromise,
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
