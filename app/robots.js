export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: [
                    '/',
                    '/blog',
                    '/blog/*',
                ],
                disallow: [
                    '/api/',
                    '/admin/',
                    '/test-*',
                    '/debug/',
                    '/login',
                    '/chatlist',
                    '/chat',
                    '/journal',
                    '/goals',
                    '/insights',
                    '/profile',
                    '/onboarding',
                    '/welcome',
                ],
            },
        ],
        sitemap: 'https://tara4u.com/sitemap.xml',
    };
}
