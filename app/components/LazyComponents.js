import dynamic from 'next/dynamic';

// Lazy load heavy components
export const LoginModal = dynamic(() => import('./LoginModal'), {
    ssr: false,
    loading: () => null
});

export const OnboardingModal = dynamic(() => import('./OnboardingModal'), {
    ssr: false,
    loading: () => null
});

export const ContactForm = dynamic(() => import('./ContactForm'), {
    ssr: false,
    loading: () => <div className="animate-pulse bg-gray-100 rounded-lg h-96" />
});

export const FAQSchema = dynamic(() => import('./FAQSchema'), {
    ssr: true,
    loading: () => null
});
