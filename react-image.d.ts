declare module 'react-image' {
    import * as React from 'react'
  
    export interface ImgProps extends Omit<React.ComponentPropsWithoutRef<'img'>, 'src'> {
      src?: string | string[]
      loader?: JSX.Element
      unloader?: JSX.Element
      decode?: boolean
      crossorigin?: string
      container?: (children: React.ReactNode) => JSX.Element
      loaderContainer?: (children: React.ReactNode) => JSX.Element
      unloaderContainer?: (children: React.ReactNode) => JSX.Element
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
  
