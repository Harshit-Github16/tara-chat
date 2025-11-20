import clientPromise from '../../lib/mongodb';

export async function GET() {
    const baseUrl = 'https://www.tara4u.com';

    try {
        const client = await clientPromise;
        const db = client.db('tara');

        // Fetch all published blogs
        const blogs = await db.collection('blogs')
            .find({ status: { $ne: 'draft' } }) // Exclude drafts
            .sort({ createdAt: -1 })
            .project({
                slug: 1,
                createdAt: 1,
                updatedAt: 1,
                title: 1
            })
            .toArray();

        // Generate XML sitemap
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
    
    <!-- Blog Index Page -->
    <url>
        <loc>${baseUrl}/blog</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>
    
    ${blogs.map((blog) => `
    <!-- ${blog.title} -->
    <url>
        <loc>${baseUrl}/blog/${blog.slug}</loc>
        <lastmod>${(blog.updatedAt || blog.createdAt || new Date()).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>`).join('')}
</urlset>`;

        return new Response(sitemap, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            },
        });
    } catch (error) {
        console.error('Blog sitemap generation error:', error);

        // Return minimal sitemap on error
        const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}/blog</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>
</urlset>`;

        return new Response(fallbackSitemap, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, max-age=3600',
            },
        });
    }
}
