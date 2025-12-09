import { defaultCache } from '@serwist/next/worker';
import { Serwist, CacheFirst, StaleWhileRevalidate, NetworkFirst } from 'serwist';

// Optimized caching strategies
const optimizedCache = [
    {
        urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
        handler: new CacheFirst({
            cacheName: 'google-fonts',
            plugins: [
                {
                    cacheWillUpdate: async ({ response }) => {
                        return response.status === 200 ? response : null;
                    },
                },
            ],
        }),
    },
    {
        urlPattern: /\.(?:avif|webp|jpg|jpeg|png|svg|gif|ico)$/i,
        handler: new CacheFirst({
            cacheName: 'images',
            plugins: [
                {
                    cacheWillUpdate: async ({ response }) => {
                        return response.status === 200 ? response : null;
                    },
                },
            ],
        }),
    },
    {
        urlPattern: /\.(?:js|css)$/i,
        handler: new StaleWhileRevalidate({
            cacheName: 'static-resources',
        }),
    },
    {
        urlPattern: /^https:\/\/www\.googletagmanager\.com\/.*/i,
        handler: new NetworkFirst({
            cacheName: 'analytics',
            networkTimeoutSeconds: 3,
        }),
    },
    ...defaultCache,
];

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: optimizedCache,
    fallbacks: {
        entries: [
            {
                url: '/offline',
                matcher({ request }) {
                    return request.destination === 'document';
                },
            },
        ],
    },
});

serwist.addEventListeners();
