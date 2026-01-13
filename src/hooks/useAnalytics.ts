/**
 * Custom React Hooks for Contentstack Analytics
 *
 * These hooks enable easy tracking of content views,
 * user interactions, and personalization performance.
 */
import { useEffect, useRef, useCallback } from 'react';
import { analytics, createVisibilityTracker } from '../lib/analytics';

// ============================================
// Hooks
// ============================================

/**
 * Track content view when component mounts
 */
export function useContentTracking(
  contentType: string,
  entryUid: string,
  title: string,
  variant?: string
) {
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current && entryUid) {
      analytics.trackContentView(contentType, entryUid, title, variant);
      tracked.current = true;
    }
  }, [contentType, entryUid, title, variant]);
}

/**
 * Track element visibility using Intersection Observer
 */
export function useVisibilityTracking(
  contentType: string,
  entryUid: string,
  title: string
) {
  const elementRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const callback = createVisibilityTracker(contentType, entryUid, title);
    observerRef.current = new IntersectionObserver(callback, {
      threshold: 0.5,
    });

    observerRef.current.observe(elementRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [contentType, entryUid, title]);

  return elementRef;
}

/**
 * Track user interactions
 */
export function useInteractionTracking() {
  const trackClick = useCallback((element: string, contentUid?: string) => {
    analytics.trackInteraction('click', element, contentUid);
  }, []);

  const trackCTA = useCallback(
    (ctaText: string, destination: string, contentUid?: string) => {
      analytics.trackCTAClick(ctaText, destination, contentUid);
    },
    []
  );

  const trackSearch = useCallback((query: string, resultsCount: number) => {
    analytics.trackSearch(query, resultsCount);
  }, []);

  const trackCustom = useCallback(
    (action: string, element: string, metadata?: Record<string, unknown>) => {
      analytics.trackInteraction(action, element, undefined, metadata);
    },
    []
  );

  return { trackClick, trackCTA, trackSearch, trackCustom };
}

/**
 * Get session analytics stats
 */
export function useSessionStats() {
  return analytics.getSessionStats();
}

/**
 * Track personalization conversions
 */
export function useConversionTracking(experienceId: string, variantId: string) {
  const trackConversion = useCallback(() => {
    analytics.trackPersonalization(experienceId, variantId, true);
  }, [experienceId, variantId]);

  const trackImpression = useCallback(() => {
    analytics.trackPersonalization(experienceId, variantId, false);
  }, [experienceId, variantId]);

  return { trackConversion, trackImpression };
}
