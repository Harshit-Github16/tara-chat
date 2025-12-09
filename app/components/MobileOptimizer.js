'use client';
import { useEffect } from 'react';

export default function MobileOptimizer() {
    useEffect(() => {
        // Reduce animations on mobile for better performance
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
            // Disable heavy animations on mobile
            document.documentElement.classList.add('mobile-optimized');

            // Reduce motion if user prefers
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                document.documentElement.classList.add('reduce-motion');
            }
        }

        // Intersection Observer for lazy loading sections
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    rootMargin: '50px',
                    threshold: 0.1,
                }
            );

            // Observe all lazy sections
            document.querySelectorAll('.lazy-section').forEach((section) => {
                observer.observe(section);
            });

            return () => observer.disconnect();
        }
    }, []);

    return null;
}
