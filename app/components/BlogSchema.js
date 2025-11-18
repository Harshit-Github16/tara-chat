export default function BlogSchema({
    title,
    description,
    author = "Tara Team",
    datePublished,
    dateModified,
    image,
    url,
    category = "Mental Health",
    tags = [],
    schemaType = "BlogPosting",
    faqItems = [],
    howToSteps = []
}) {
    // Base schema based on type
    let mainSchema;

    if (schemaType === "FAQPage" && faqItems.length > 0) {
        mainSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqItems.map(item => ({
                "@type": "Question",
                "name": item.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item.answer
                }
            }))
        };
    } else if (schemaType === "HowTo" && howToSteps.length > 0) {
        mainSchema = {
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": title,
            "description": description,
            "image": {
                "@type": "ImageObject",
                "url": image,
                "width": 1200,
                "height": 630
            },
            "step": howToSteps.map((step, index) => ({
                "@type": "HowToStep",
                "position": index + 1,
                "name": step.name,
                "text": step.text
            }))
        };
    } else if (schemaType === "Article") {
        mainSchema = {
            "@context": "https://schema.org",
            "@type": "Article",
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
                    "url": "https://tara4u.com/taralogo.jpg",
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
            "keywords": tags.join(", ")
        };
    } else {
        // Default BlogPosting
        mainSchema = {
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
                    "url": "https://tara4u.com/taralogo.jpg",
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
            "wordCount": description.split(' ').length * 10,
            "articleBody": description
        };
    }

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
                "item": "https://yourdomain.com/blog"
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
        "@graph": [mainSchema, breadcrumbSchema]
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