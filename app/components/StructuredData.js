export default function StructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": "https://tara4u.com/#website",
                "url": "https://tara4u.com",
                "name": "Tara - Mental Wellness Companion",
                "description": "AI-powered mental health and emotional wellness companion",
                "publisher": {
                    "@id": "https://tara4u.com/#organization"
                },
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": "https://tara4u.com/search?q={search_term_string}"
                    },
                    "query-input": "required name=search_term_string"
                }
            },
            {
                "@type": "Organization",
                "@id": "https://tara4u.com/#organization",
                "name": "Tara",
                "url": "https://tara4u.com",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://tara4u.com/taralogo.jpg",
                    "width": 512,
                    "height": 512
                },
                "sameAs": [
                    "https://twitter.com/tara4u",
                    "https://facebook.com/tara4u",
                    "https://instagram.com/tara4u",
                    "https://linkedin.com/company/tara4u"
                ],
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+91-9876543210",
                    "contactType": "Customer Service",
                    "email": "hello@tara4u.com",
                    "areaServed": "IN",
                    "availableLanguage": ["English", "Hindi"]
                }
            },
            {
                "@type": "WebApplication",
                "name": "Tara - Mental Wellness Companion",
                "url": "https://tara4u.com",
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

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}
