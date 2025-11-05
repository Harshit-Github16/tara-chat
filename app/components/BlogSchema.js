export default function BlogSchema({
    title,
    description,
    author = "Tara Team",
    datePublished,
    dateModified,
    image,
    url,
    category = "Mental Health",
    tags = []
}) {
    const blogSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "description": description,
        "image": {
            "@type": "ImageObject",
            "url": image,
            "width": 1200,
            "height": 630
        },
        "author": {
            "@type": "Person",
            "name": author
        },
        "publisher": {
            "@type": "Organization",
            "name": "Tara",
            "logo": {
                "@type": "ImageObject",
                "url": "https://yourdomain.com/taralogo.jpg",
                "width": 200,
                "height": 200
            }
        },
        "datePublished": datePublished,
        "dateModified": dateModified || datePublished,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": url
        },
        "articleSection": category,
        "keywords": tags.join(", "),
        "wordCount": description.split(' ').length * 10, // Estimate
        "articleBody": description
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://yourdomain.com"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Blogs",
                "item": "https://yourdomain.com/blogs"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": title,
                "item": url
            }
        ]
    };

    const combinedSchema = {
        "@context": "https://schema.org",
        "@graph": [blogSchema, breadcrumbSchema]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(combinedSchema)
            }}
        />
    );
}