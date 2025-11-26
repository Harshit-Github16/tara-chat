import Head from 'next/head';

export default function SEO({
    title = "Tara - AI Mental Health & Wellness Companion",
    description = "Transform your mental wellness journey with Tara - your AI-powered companion for mindfulness, emotional support, and personal growth. Track insights and build healthy habits.",
    keywords = "mental health, AI companion, wellness, mindfulness, emotional support, therapy, meditation, personal growth, mental wellness, AI chat, mood tracking, journal, insights",
    canonicalUrl = "",
    ogImage = "/taralogo.jpg",
    ogType = "website",
    twitterCard = "summary_large_image",
    structuredData = null,
    noIndex = false,
    noFollow = false
}) {
    const fullTitle = title.includes('Tara') ? title : `${title} | Tara`;

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Tara",
        "description": "AI-powered mental health and wellness companion",
        "url": "https://www.tara4u.com",
        "logo": {
            "@type": "ImageObject",
            "url": "https://www.tara4u.com/taralogo.jpg",
            "width": 200,
            "height": 200
        },
        "sameAs": [
            "https://twitter.com/tara",
            "https://facebook.com/tara",
            "https://instagram.com/tara"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-XXX-XXX-XXXX",
            "contactType": "customer service",
            "availableLanguage": ["English", "Hindi"]
        }
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Tara",
        "url": "https://www.tara4u.com",
        "description": description,
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.tara4u.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    const softwareApplicationSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Tara",
        "description": description,
        "applicationCategory": "HealthApplication",
        "operatingSystem": "Web Browser",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "1250"
        }
    };

    const combinedSchema = {
        "@context": "https://schema.org",
        "@graph": [
            organizationSchema,
            websiteSchema,
            softwareApplicationSchema,
            ...(structuredData ? [structuredData] : [])
        ]
    };

    const robotsContent = `${noIndex ? 'noindex' : 'index'},${noFollow ? 'nofollow' : 'follow'}`;

    return (
        <Head>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="robots" content={robotsContent} />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="author" content="Tara Team" />
            <meta name="language" content="English" />

            {/* Canonical URL */}
            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

            {/* Open Graph Meta Tags */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={ogType} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:alt" content="Tara - AI Mental Health Companion" />
            <meta property="og:site_name" content="Tara" />
            {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
            <meta name="twitter:image:alt" content="Tara - AI Mental Health Companion" />

            {/* Additional Meta Tags */}
            <meta name="theme-color" content="#f43f5e" />
            <meta name="msapplication-TileColor" content="#f43f5e" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="apple-mobile-web-app-title" content="Tara" />

            {/* Favicon */}
            <link rel="icon" href="https://ik.imagekit.io/exerovn5q/32x32px%20logo%20(1).png" sizes="32x32" type="image/png" />

            <link rel="apple-touch-icon" href="/taralogo.jpg" />

            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(combinedSchema)
                }}
            />
        </Head>
    );
}