export declare type useImageProps = {
    srcList: string | string[];
    imgPromise?: (...args: any[]) => Promise<void>;
    useSuspense?: boolean;
};
export default function useImage({ srcList, imgPromise, useSuspense, }: useImageProps): {
    src: string | undefined;
    isLoading: boolean;
    error: any;
};
