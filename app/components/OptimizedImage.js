import Image from 'next/image';
import { memo } from 'react';

function OptimizedImage({
    src,
    alt,
    width,
    height,
    priority = false,
    className = '',
    sizes,
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
            quality={priority ? 85 : 75}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
            className={className}
            sizes={sizes || `(max-width: 768px) ${width}px, ${width}px`}
            {...props}
        />
    );
}

export default memo(OptimizedImage);
