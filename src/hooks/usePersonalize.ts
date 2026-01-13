/**
 * Custom React Hooks for Contentstack Personalize
 *
 * These hooks enable personalized content delivery and
 * A/B testing within React components.
 */
import { useState, useEffect, useCallback } from 'react';
import {
  personalize,
  initializePersonalization,
  type UserAttributes,
} from '../lib/personalize';

// ============================================
// Hooks
// ============================================

/**
 * Initialize personalization and get user attributes
 */
export function usePersonalization() {
  const [initialized, setInitialized] = useState(false);
  const [attributes, setAttributes] = useState<UserAttributes>({});

  useEffect(() => {
    const init = async () => {
      await initializePersonalization();
      setAttributes(personalize.getUserAttributes());
      setInitialized(true);
    };
    init();
  }, []);

  const updateAttributes = useCallback((newAttributes: UserAttributes) => {
    personalize.setUserAttributes(newAttributes);
    setAttributes(personalize.getUserAttributes());
  }, []);

  return { initialized, attributes, updateAttributes };
}

/**
 * Get variant for an experience
 */
export function useVariant(experienceShortId: string) {
  const [variant, setVariant] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getVariant = async () => {
      setLoading(true);
      try {
        const v = await personalize.getVariant(experienceShortId);
        setVariant(v);
      } catch (error) {
        console.error('Failed to get variant:', error);
        setVariant('default');
      } finally {
        setLoading(false);
      }
    };
    getVariant();
  }, [experienceShortId]);

  return { variant, loading };
}

/**
 * A/B Test hook for easy variant rendering
 */
export function useABTest<T extends Record<string, React.ReactNode>>(
  experienceId: string,
  variants: T,
  defaultVariant: keyof T
): { variant: keyof T; loading: boolean; content: React.ReactNode } {
  const { variant, loading } = useVariant(experienceId);

  const selectedVariant = (
    variant && variant in variants ? variant : defaultVariant
  ) as keyof T;
  const content = variants[selectedVariant];

  return { variant: selectedVariant, loading, content };
}

/**
 * Track personalization events
 */
export function usePersonalizationTracking() {
  const trackEvent = useCallback(
    (eventName: string, data?: Record<string, unknown>) => {
      personalize.triggerEvent(eventName, data);
    },
    []
  );

  const trackConversion = useCallback(
    (experienceId: string, conversionType: string) => {
      personalize.triggerEvent('conversion', {
        experienceId,
        conversionType,
        timestamp: Date.now(),
      });
    },
    []
  );

  return { trackEvent, trackConversion };
}

/**
 * Segment-based content selection
 */
export function useSegmentedContent<T>(
  segments: { segment: string; content: T }[],
  defaultContent: T
): T {
  const { attributes } = usePersonalization();
  const [content, setContent] = useState<T>(defaultContent);

  useEffect(() => {
    // Find matching segment based on user attributes
    const userType = attributes.userType as string;
    const deviceType = attributes.deviceType as string;

    for (const { segment, content } of segments) {
      if (segment === userType || segment === deviceType) {
        setContent(content);
        return;
      }
    }
    setContent(defaultContent);
  }, [attributes, segments, defaultContent]);

  return content;
}
