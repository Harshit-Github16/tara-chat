import { notFound } from 'next/navigation';
import BlogPostClient from './BlogPostClient';

// Generate metadata for SEO
export async function generateMetadata({ params }) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.tara4u.com'}/api/admin/blogs`, {
            cache: 'no-store'
        });
        const data = await response.json();

        if (data.success) {
            const post = data.data.find(p =>
                p.slug === params.id ||
                p._id === params.id ||
                p.id === parseInt(params.id)
            );

            if (post) {
                const canonicalUrl = `https://www.tara4u.com/blog/${post.slug || post._id}`;

                return {
                    title: `${post.title} | Tara4u - Mental Wellness Blog`,
                    description: post.excerpt || post.description,
                    keywords: post.tags?.join(', ') || '',
                    alternates: {
                        canonical: canonicalUrl,
                    },
                    openGraph: {
                        title: post.title,
                        description: post.excerpt || post.description,
                        url: canonicalUrl,
                        siteName: 'Tara4u - Mental Wellness Companion',
                        images: [
                            {
                                url: post.featuredImage || 'https://www.tara4u.com/taralogo.jpg',
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
                        tags: post.tags || [],
                    },
                    twitter: {
                        card: 'summary_large_image',
                        title: post.title,
                        description: post.excerpt || post.description,
                        images: [post.featuredImage || 'https://www.tara4u.com/taralogo.jpg'],
                        creator: '@tara4u',
                        site: '@tara4u',
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

        // If post not found, return basic metadata
        return {
            title: 'Blog Post Not Found | Tara4u',
            description: 'The blog post you are looking for could not be found.',
            robots: {
                index: false,
                follow: true,
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Blog Post | Tara4u',
            description: 'Mental health and wellness blog post',
        };
    }
}

// Server Component - handles metadata and initial data check
export default async function BlogPostPage({ params }) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.tara4u.com'}/api/admin/blogs`, {
            cache: 'no-store'
        });
        const data = await response.json();

        if (data.success) {
            const post = data.data.find(p =>
                p.slug === params.id ||
                p._id === params.id ||
                p.id === parseInt(params.id)
            );

            // if (!post) {
            //     notFound(); // This will return a proper 404 status
            // }
        }
    } catch (error) {
        console.error('Error checking blog post:', error);
    }

    // Render the client component
    return <BlogPostClient />;
}