import type React from 'react';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { getFile } from '@/api/file/useGetFile';

type AuthenticatedImageProps = Omit<
    React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
    'src'
> & {
    fileUuid?: string | null;
    fallback?: React.ReactNode;
};

export function AuthenticatedImage(props: AuthenticatedImageProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const { fileUuid, ...imageProps } = props;

    const { data: imageBlob, isError } = useQuery(['file', fileUuid], () => getFile(fileUuid), {
        // Optional: Cache the image for future requests
        cacheTime: 120, // Set cache time if needed
        staleTime: Infinity, // Set stale time if needed
        retry: false,
    });

    useEffect(() => {
        if (imageBlob) {
            const objectUrl = URL.createObjectURL(imageBlob);
            setImageUrl(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [imageBlob]);

    if (!imageUrl || isError) {
        if (props.fallback) {
            return props.fallback;
        }
        return <img {...imageProps} alt="" />;
    }
    return <img {...imageProps} src={imageUrl} alt="" />;
}
