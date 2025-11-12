import clientPromise from '../lib/mongodb';

export default async function sitemap() {
    const baseUrl = 'https://tara4u.com';

    // Static pages
    const routes = [
        { path: '', changeFreq: 'daily', priority: 1.0 },
        { path: '/chatlist', changeFreq: 'daily', priority: 0.9 },
        { path: '/blogs', changeFreq: 'daily', priority: 0.8 },
        { path: '/insights', changeFreq: 'weekly', priority: 0.7 },
        { path: '/journal', changeFreq: 'weekly', priority: 0.7 },
        { path: '/profile', changeFreq: 'monthly', priority: 0.6 },
        { path: '/goals', changeFreq: 'weekly', priority: 0.6 },
        { path: '/welcome', changeFreq: 'monthly', priority: 0.5 },
        { path: '/onboarding', changeFreq: 'monthly', priority: 0.5 },
        { path: '/login', changeFreq: 'monthly', priority: 0.4 },
        { path: '/privacy-policy', changeFreq: 'yearly', priority: 0.3 },
        { path: '/terms-of-service', changeFreq: 'yearly', priority: 0.3 },
    ].map((route) => ({
        url: `${baseUrl}${route.path}`,
        lastModified: new Date().toISOString(),
        changeFrequency: route.changeFreq,
        priority: route.priority,
    }));

    // Dynamic blog pages
    try {
        const client = await clientPromise;
        const db = client.db('tara');
        const blogs = await db.collection('blogs')
            .find({})
            .project({ slug: 1, createdAt: 1 })
            .toArray();

        const blogRoutes = blogs.map((blog) => ({
            url: `${baseUrl}/blogs/${blog.slug}`,
            lastModified: blog.createdAt || new Date().toISOString(),
            changeFrequency: 'weekly',
            priority: 0.7,
        }));

        return [...routes, ...blogRoutes];
    } catch (error) {
        console.error('Sitemap generation error:', error);
        return routes;
    }
}
