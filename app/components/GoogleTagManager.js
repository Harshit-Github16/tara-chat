'use client';

import { useEffect } from 'react';

export default function GoogleTagManager({ gtmId }) {
    useEffect(() => {
        if (!gtmId) return;

        // Initialize dataLayer
        window.dataLayer = window.dataLayer || [];
        function gtag() {
            window.dataLayer.push(arguments);
        }
        gtag('js', new Date());
        gtag('config', gtmId);

        // Load GTM script
        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gtmId}`;
        script.async = true;
        document.head.appendChild(script);

        return () => {
            // Cleanup
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, [gtmId]);

    return null;
}
