// Metadata generation for blog detail pages
export async function generateMetadata({ params }) {
    // Await params in Next.js 15
    const resolvedParams = await params;
    const blogId = resolvedParams.id;

    // During build time, return basic metadata
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        return {
            title: 'Blog Post | Tara',
            description: 'Read our latest mental health and wellness insights.',
            alternates: {
                canonical: `https://www.tara4u.com/blog/${blogId}`,
            },
        };
    }

    try {
        // Fetch blog data at runtime
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.tara4u.com';
        const response = await fetch(`${baseUrl}/api/admin/blogs`, {
            cache: 'no-store',
            next: { revalidate: 0 }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch blogs');
        }

        const data = await response.json();

        if (data.success) {
            const post = data.data.find(p =>
                p.slug === blogId ||
                p._id === blogId ||
                p.id === parseInt(blogId)
            );

            if (post) {
                // Always use slug for canonical URL (SEO best practice)
                const canonicalUrl = `https://www.tara4u.com/blog/${post.slug}`;

                return {
                    title: `${post.title} | Tara Blog`,
                    description: post.excerpt,
                    keywords: post.tags?.join(', ') || '',
                    alternates: {
                        canonical: canonicalUrl,
                    },
                    openGraph: {
                        title: post.title,
                        description: post.excerpt,
                        url: canonicalUrl,
                        siteName: 'Tara - Mental Wellness Companion',
                        images: [
                            {
                                url: post.featuredImage || 'https://www.tara4u.com/og-image.jpg',
                                width: 1200,
                                height: 630,
                                alt: post.title,
                            },
                        ],
                        locale: 'en_US',
                        type: 'article',
                        publishedTime: post.publishDate,
                        modifiedTime: post.updatedAt || post.publishDate,
                        authors: [post.author],
                        section: post.category,
                        tags: post.tags || [],
                    },
                    twitter: {
                        card: 'summary_large_image',
                        title: post.title,
                        description: post.excerpt,
                        images: [post.featuredImage || 'https://www.tara4u.com/og-image.jpg'],
                    },
                    robots: {
                        index: true,
                        follow: true,
                        googleBot: {
                            index: true,
                            follow: true,
                            'max-video-preview': -1,
                            'max-image-preview': 'large',
                            'max-snippet': -1,
                        },
                    },
                };
            }
        }
    } catch (error) {
        console.error('Error generating metadata:', error);
    }

    // Fallback metadata (if blog not found or error occurred)
    return {
        title: 'Blog Post | Tara',
        description: 'Read our latest mental health and wellness insights.',
        alternates: {
            canonical: `https://www.tara4u.com/blog`,
        },
    };
}

export default function BlogDetailLayout({ children }) {
    return children;
}
