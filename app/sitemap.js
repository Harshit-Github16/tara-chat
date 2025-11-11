import clientPromise from '../lib/mongodb';

export default async function sitemap() {
    const baseUrl = 'https://tara4u.com';

    // Static pages
    const routes = [
        '',
        '/blogs',
        '/login',
        '/signup',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: route === '/blogs' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.8,
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
