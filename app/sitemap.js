import { SEO_CONFIG } from './lib/seo-config';

export default function sitemap() {
    const baseUrl = SEO_CONFIG.site.url;
    const currentDate = new Date().toISOString();

    // Static pages
    const staticPages = [
        {
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/chatlist`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blogs`,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/insights`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/journal`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/profile`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/welcome`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ];

    // Blog posts (you can dynamically generate these from your blog data)
    const blogPosts = [
        {
            url: `${baseUrl}/blogs/5-daily-habits-emotional-health`,
            lastModified: '2024-11-01',
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/blogs/understanding-emotional-patterns`,
            lastModified: '2024-10-28',
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/blogs/ai-emotional-support-science`,
            lastModified: '2024-10-25',
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ];

    return [...staticPages, ...blogPosts];
}