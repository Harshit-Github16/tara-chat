// Metadata helper for Next.js 13+ App Router
// This file provides metadata configurations for all pages

const BASE_URL = 'https://www.tara4u.com';

export const createMetadata = ({
    title,
    description,
    path = '/',
    keywords = [],
    image = '/taralogo.jpg',
    type = 'website',
}) => {
    const fullTitle = title.includes('Tara') ? title : `${title} | Tara`;
    const canonicalUrl = `${BASE_URL}${path}`;
    const imageUrl = image.startsWith('http') ? image : `${BASE_URL}${image}`;

    return {
        title: fullTitle,
        description,
        keywords: keywords.join(', '),
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: fullTitle,
            description,
            url: canonicalUrl,
            siteName: 'Tara - Mental Wellness Companion',
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            locale: 'en_US',
            type,
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [imageUrl],
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
};

// Page-specific metadata configurations
export const pageMetadata = {
    home: createMetadata({
        title: 'Tara - Your AI Mental Health & Wellness Companion | Emotional Support 24/7',
        description: 'Your AI mental health companion. Get 24/7 emotional support, chat with AI characters, track mood, journal thoughts & receive personalized wellness insights.',
        path: '/',
        keywords: [
            'mental health app',
            'AI therapy',
            'emotional wellness',
            'mindfulness app',
            'mental health support',
            'AI companion',
            'mood tracker',
            'journal app',
            'therapy chat',
            'emotional support',
            'mental wellness',
            'AI counseling',
            'stress relief',
            'anxiety help',
            'depression support',
            'tara',
            'tara4u',
            'mental health india',
        ],
    }),

    chatlist: createMetadata({
        title: 'AI Chat & Conversations | Mental Health Support',
        description: 'Chat with AI characters for emotional support, motivation & guidance. Start meaningful conversations for your mental wellness.',
        path: '/chatlist',
        keywords: [
            'AI chat',
            'emotional support chat',
            'mental health conversations',
            'AI therapy',
            'virtual companions',
            'emotional wellness chat',
            'AI characters',
            'mental health support',
        ],
    }),

    blogs: createMetadata({
        title: 'Mental Health & Wellness Blog | Expert Tips & Insights',
        description: 'Expert mental health insights, tips & stories. Read articles from leading psychology & wellness professionals to support your wellness journey.',
        path: '/blog',
        keywords: [
            'mental health blog',
            'wellness articles',
            'psychology tips',
            'mindfulness guides',
            'emotional wellness',
            'mental health resources',
            'therapy insights',
            'self-care tips',
            'mental health advice',
            'wellness blog',
        ],
    }),

    insights: createMetadata({
        title: 'Mood Analytics & Emotional Insights | Track Your Wellness',
        description: 'Visualize emotional patterns with beautiful analytics. Track mood, identify triggers & monitor mental wellness progress with personalized insights.',
        path: '/insights',
        keywords: [
            'mood tracking',
            'emotional analytics',
            'mental health insights',
            'wellness dashboard',
            'mood patterns',
            'emotional intelligence',
            'progress tracking',
            'mental health analytics',
            'mood visualization',
        ],
    }),

    journal: createMetadata({
        title: 'Smart Journaling & Mood Tracking | Guided Reflection',
        description: 'AI-guided journaling with smart prompts. Track emotions, reflect on your day & build healthy mental wellness habits through guided journaling.',
        path: '/journal',
        keywords: [
            'digital journal',
            'mood journal',
            'guided journaling',
            'emotional reflection',
            'mental health diary',
            'wellness journal',
            'mindfulness writing',
            'AI journaling',
            'daily reflection',
        ],
    }),

    profile: createMetadata({
        title: 'Your Wellness Profile | Personal Mental Health Dashboard',
        description: 'Manage your mental wellness journey with personalized settings, progress tracking, and wellness goals. Your private space for emotional growth.',
        path: '/profile',
        keywords: [
            'wellness profile',
            'mental health dashboard',
            'personal settings',
            'wellness goals',
            'progress tracking',
            'emotional growth',
            'user profile',
            'mental health account',
        ],
    }),

    welcome: createMetadata({
        title: 'Welcome to Tara | Start Your Mental Wellness Journey',
        description: 'Begin your personalized mental wellness journey with Tara. Complete your profile and discover AI companions tailored to your emotional needs.',
        path: '/welcome',
        keywords: [
            'mental wellness onboarding',
            'AI companion setup',
            'emotional wellness journey',
            'personalized mental health',
            'get started',
            'welcome',
        ],
    }),

    onboarding: createMetadata({
        title: 'Complete Your Profile | Personalize Your Wellness Journey',
        description: 'Tell us about yourself to get personalized mental health support. Your information helps us provide better emotional guidance and support.',
        path: '/onboarding',
        keywords: [
            'onboarding',
            'profile setup',
            'personalization',
            'mental health profile',
            'wellness setup',
        ],
    }),

    goals: createMetadata({
        title: 'Wellness Goals & Achievements | Track Your Progress',
        description: 'Set and track your mental wellness goals. Celebrate achievements and build healthy habits for better emotional health.',
        path: '/goals',
        keywords: [
            'wellness goals',
            'mental health goals',
            'goal tracking',
            'achievements',
            'habit building',
            'progress tracking',
        ],
    }),

    privacyPolicy: createMetadata({
        title: 'Privacy Policy | Your Data Security & Privacy',
        description: 'Learn how Tara protects your privacy and handles your personal information. We are committed to keeping your mental health data secure and confidential.',
        path: '/privacy-policy',
        keywords: [
            'privacy policy',
            'data security',
            'privacy protection',
            'GDPR',
            'data handling',
            'confidentiality',
        ],
    }),

    termsOfService: createMetadata({
        title: 'Terms of Service | User Agreement',
        description: 'Read our terms of service to understand your rights and responsibilities when using Tara mental wellness platform.',
        path: '/terms-of-service',
        keywords: [
            'terms of service',
            'user agreement',
            'terms and conditions',
            'legal',
            'usage terms',
        ],
    }),
};
