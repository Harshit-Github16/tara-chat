import { memo } from 'react';

const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebSite",
            "@id": "https://www.tara4u.com/#website",
            "url": "https://www.tara4u.com",
            "name": "Tara - Mental Wellness Companion",
            "description": "AI-powered mental health and emotional wellness companion",
            "publisher": {
                "@id": "https://www.tara4u.com/#organization"
            },
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": "https://www.tara4u.com/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
            }
        },
        {
            "@type": "Organization",
            "@id": "https://www.tara4u.com/#organization",
            "name": "Tara4u",
            "alternateName": "Tara",
            "url": "https://www.tara4u.com",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.tara4u.com/icon-512x512.png",
                "width": 512,
                "height": 512,
                "caption": "Tara4u - AI Mental Health Companion Logo"
            },
            "image": {
                "@type": "ImageObject",
                "url": "https://www.tara4u.com/icon-512x512.png",
                "width": 512,
                "height": 512
            },
            "sameAs": [
                "https://x.com/HelloTara4u",
                "https://www.facebook.com/profile.php?id=61584786025622",
                "https://www.instagram.com/hello.tara4u/",
                "https://www.youtube.com/@Tara4uu"
            ],
            "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Service",
                "email": "hello@tara4u.com",
                "areaServed": "IN",
                "availableLanguage": ["English", "Hindi"]
            }
        },
        {
            "@type": "WebApplication",
            "name": "Tara - Mental Wellness Companion",
            "url": "https://www.tara4u.com",
            "applicationCategory": "HealthApplication",
            "operatingSystem": "Web, iOS, Android",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "INR"
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "2000",
                "bestRating": "5",
                "worstRating": "1"
            },
            "description": "AI-powered mental health companion providing 24/7 emotional support, mood tracking, journaling, and personalized wellness insights."
        },
        {
            "@type": "SoftwareApplication",
            "name": "Tara",
            "applicationCategory": "HealthApplication",
            "operatingSystem": "Web Browser",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "INR"
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "2000"
            }
        }
    ]
};

function StructuredData() {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}

export default memo(StructuredData);
