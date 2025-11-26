// SEO Configuration for Tara App
export const SEO_CONFIG = {
    // Default site configuration
    site: {
        name: "Tara",
        description: "AI-powered mental health and wellness companion",
        url: "https://www.tara4u.com",
        logo: "/taralogo.jpg",
        author: "Tara Team",
        language: "en",
        locale: "en_US",
        themeColor: "#f43f5e",
    },

    // Default meta tags
    defaultMeta: {
        title: "Tara - AI Mental Health & Wellness Companion",
        description: "Transform your mental wellness journey with Tara - your AI-powered companion for mindfulness, emotional support, and personal growth. Track insights and build healthy habits.",
        keywords: "mental health, AI companion, wellness, mindfulness, emotional support, therapy, meditation, personal growth, mental wellness, AI chat, mood tracking, journal, insights",
        robots: "index, follow",
    },

    // Page-specific SEO configurations
    pages: {
        home: {
            title: "Tara - AI Mental Health & Wellness Companion | Emotional Support Chat",
            description: "Transform your mental wellness journey with Tara - your AI-powered companion for mindfulness, emotional support, and personal growth. Chat with AI characters, track moods, and build healthy habits.",
            keywords: "mental health app, AI companion, emotional wellness, mindfulness, therapy chat, mood tracking, journal app, personal growth, mental wellness, AI therapy, emotional support",
            path: "/",
        },

        chatlist: {
            title: "AI Chat & Conversations | Mental Health Support - Tara",
            description: "Connect with AI characters for emotional support, motivation, and guidance. Start meaningful conversations that support your mental wellness journey.",
            keywords: "AI chat, emotional support chat, mental health conversations, AI therapy, virtual companions, emotional wellness chat",
            path: "/chatlist",
        },

        blogs: {
            title: "Mental Health & Wellness Blog | Expert Tips & Insights - Tara",
            description: "Discover expert insights, tips, and stories to support your mental wellness journey. Read articles from leading professionals in psychology, neuroscience, and wellness.",
            keywords: "mental health blog, wellness articles, psychology tips, mindfulness guides, emotional wellness, mental health resources, therapy insights, self-care tips",
            path: "/blog",
        },

        insights: {
            title: "Mood Analytics & Emotional Insights | Track Your Wellness - Tara",
            description: "Visualize your emotional patterns with beautiful analytics and personalized insights. Track your mood, identify triggers, and monitor your mental wellness progress.",
            keywords: "mood tracking, emotional analytics, mental health insights, wellness dashboard, mood patterns, emotional intelligence, progress tracking",
            path: "/insights",
        },

        journal: {
            title: "Smart Journaling & Mood Tracking | Guided Reflection - Tara",
            description: "Express your thoughts with AI-guided journaling prompts. Track your emotions, reflect on your day, and build healthy mental wellness habits.",
            keywords: "digital journal, mood journal, guided journaling, emotional reflection, mental health diary, wellness journal, mindfulness writing",
            path: "/journal",
        },

        profile: {
            title: "Your Wellness Profile | Personal Mental Health Dashboard - Tara",
            description: "Manage your mental wellness journey with personalized settings, progress tracking, and wellness goals. Your private space for emotional growth.",
            keywords: "wellness profile, mental health dashboard, personal settings, wellness goals, progress tracking, emotional growth",
            path: "/profile",
        },

        welcome: {
            title: "Welcome to Tara | Start Your Mental Wellness Journey",
            description: "Begin your personalized mental wellness journey with Tara. Complete your profile and discover AI companions tailored to your emotional needs.",
            keywords: "mental wellness onboarding, AI companion setup, emotional wellness journey, personalized mental health",
            path: "/welcome",
        },
    },

    // Organization schema
    organizationSchema: {
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
            "https://instagram.com/tara",
            "https://linkedin.com/company/tara"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-XXX-XXX-XXXX",
            "contactType": "customer service",
            "availableLanguage": ["English", "Hindi"]
        }
    },

    // Website schema
    websiteSchema: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Tara",
        "url": "https://www.tara4u.com",
        "description": "AI-powered mental health and wellness companion",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.tara4u.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    },

    // Software Application schema
    softwareApplicationSchema: {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Tara",
        "description": "AI-powered mental health and wellness companion",
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
    },

    // Social media links
    socialMedia: {
        twitter: "https://twitter.com/tara",
        facebook: "https://facebook.com/tara",
        instagram: "https://instagram.com/tara",
        linkedin: "https://linkedin.com/company/tara",
        youtube: "https://youtube.com/tara"
    }
};

// Helper function to get page-specific SEO config
export function getPageSEO(pageName) {
    const pageConfig = SEO_CONFIG.pages[pageName];
    if (!pageConfig) {
        return {
            ...SEO_CONFIG.defaultMeta,
            canonicalUrl: `${SEO_CONFIG.site.url}${pageName}`,
        };
    }

    return {
        title: pageConfig.title,
        description: pageConfig.description,
        keywords: pageConfig.keywords,
        canonicalUrl: `${SEO_CONFIG.site.url}${pageConfig.path}`,
        ogUrl: `${SEO_CONFIG.site.url}${pageConfig.path}`,
    };
}

// Helper function to generate structured data
export function generateStructuredData(additionalSchemas = []) {
    return {
        "@context": "https://schema.org",
        "@graph": [
            SEO_CONFIG.organizationSchema,
            SEO_CONFIG.websiteSchema,
            SEO_CONFIG.softwareApplicationSchema,
            ...additionalSchemas
        ]
    };
}