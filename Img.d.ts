import React from 'react';
import { useImageProps } from './useImage';
export declare type ImgProps = Omit<React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, 'src'> & Omit<useImageProps, 'srcList'> & {
    src: useImageProps['srcList'];
    loader?: JSX.Element | null;
    unloader?: JSX.Element | null;
    decode?: boolean;
    crossorigin?: string;
    container?: (children: React.ReactNode) => JSX.Element;
    loaderContainer?: (children: React.ReactNode) => JSX.Element;
    unloaderContainer?: (children: React.ReactNode) => JSX.Element;
};
export default function Img({ decode, src: srcList, loader, unloader, container, loaderContainer, unloaderContainer, imgPromise, useSuspense, ...imgProps }: ImgProps): JSX.Element | null;
