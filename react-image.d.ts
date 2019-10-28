declare module 'react-image' {
    import * as React from 'react'
  
    export interface ImgProps {
      src?: string | string[]
      loader?: JSX.Element
      unloader?: JSX.Element
      decode?: boolean
      crossorigin?: string
      container?: () => JSX.Element
      loaderContainer?: () => JSX.Element
      unloaderContainer?: () => JSX.Element
  
      // For img element props such as 'alt'
      [key: string]: any
    }
  
    export default class Img extends React.Component<ImgProps> {
      constructor(props: ImgProps)
      srcToArray(src: string): []
      onLoad(): void
      onError(): void
      loadImg(): void
      unloadImg(): void
      componentDidMount(): void
      componentWillUnmount(): void
      componentWillReceiveProps(nextProps: ImgProps): void
      render(): JSX.Element
    }
  }
  