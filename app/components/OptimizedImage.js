import Image from 'next/image';
import { memo } from 'react';

function OptimizedImage({
    src,
    alt,
    width,
    height,
    priority = false,
    className = '',
    ...props
}) {
    return (
        <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            quality={priority ? 90 : 75}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
            className={className}
            {...props}
        />
    );
}

export default memo(OptimizedImage);
