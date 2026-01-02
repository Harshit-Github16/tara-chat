"use client";
import { useEffect } from 'react';
import { usePageTracking } from '../hooks/usePageTracking';

export default function TrackPageView({ pageName }) {
    const { trackEvent } = usePageTracking(pageName);

    // This component just initializes tracking for the page
    // The hook handles all the tracking logic

    return null;
}