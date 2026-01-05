'use client';

import dynamic from 'next/dynamic';
import { Suspense, useState, useEffect } from 'react';

const GlobalPageTracker = dynamic(() => import('./GlobalPageTracker'), { ssr: false });
const TrackingDebug = dynamic(() => import('./TrackingDebug'), { ssr: false });
const MobileOptimizer = dynamic(() => import('./MobileOptimizer'), { ssr: false });
const PWAInstallPrompt = dynamic(() => import('./PWAInstallPrompt'), { ssr: false });
const ExitIntent = dynamic(() => import('./ExitIntent'), { ssr: false });

export default function ClientOnlyControls() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Suspense fallback={null}>
            <MobileOptimizer />
            <GlobalPageTracker />
            <PWAInstallPrompt />
            <ExitIntent />
        </Suspense>
    );
}
