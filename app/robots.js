export default function robots() {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/admin/',
                    '/test-*',
                    '/debug/',
                ],
            },
        ],
        sitemap: 'https://tara4u.com/sitemap.xml',
    };
}
