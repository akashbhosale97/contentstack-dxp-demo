/**
 * Contentstack Data & Insights Analytics
 *
 * This module provides analytics tracking for content performance,
 * user engagement, and personalization effectiveness.
 */

// ============================================
// Types
// ============================================

interface ContentViewEvent {
  contentType: string;
  entryUid: string;
  title: string;
  variant?: string;
  timestamp: number;
}

interface UserInteractionEvent {
  action: string;
  element: string;
  contentUid?: string;
  metadata?: Record<string, unknown>;
  timestamp: number;
}

interface PersonalizationEvent {
  experienceId: string;
  variantId: string;
  converted: boolean;
  timestamp: number;
}

interface AnalyticsSession {
  sessionId: string;
  startTime: number;
  pageViews: number;
  events: (ContentViewEvent | UserInteractionEvent | PersonalizationEvent)[];
}

// ============================================
// Analytics Manager
// ============================================

class AnalyticsManager {
  private session: AnalyticsSession;
  private eventQueue: unknown[] = [];
  private flushInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.session = this.initSession();
    this.startFlushInterval();
  }

  private initSession(): AnalyticsSession {
    const existingSession = sessionStorage.getItem('cs_analytics_session');
    if (existingSession) {
      return JSON.parse(existingSession);
    }

    const newSession: AnalyticsSession = {
      sessionId: this.generateSessionId(),
      startTime: Date.now(),
      pageViews: 0,
      events: [],
    };

    sessionStorage.setItem('cs_analytics_session', JSON.stringify(newSession));
    return newSession;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;
  }

  private startFlushInterval(): void {
    // Flush events every 30 seconds
    this.flushInterval = setInterval(() => {
      this.flushEvents();
    }, 30000);
  }

  /**
   * Track content view
   */
  trackContentView(
    contentType: string,
    entryUid: string,
    title: string,
    variant?: string
  ): void {
    const event: ContentViewEvent = {
      contentType,
      entryUid,
      title,
      variant,
      timestamp: Date.now(),
    };

    this.session.pageViews++;
    this.session.events.push(event);
    this.eventQueue.push({ type: 'content_view', ...event });

    console.log('📈 Content viewed:', title, variant ? `(${variant})` : '');
    this.saveSession();
  }

  /**
   * Track user interaction
   */
  trackInteraction(
    action: string,
    element: string,
    contentUid?: string,
    metadata?: Record<string, unknown>
  ): void {
    const event: UserInteractionEvent = {
      action,
      element,
      contentUid,
      metadata,
      timestamp: Date.now(),
    };

    this.session.events.push(event);
    this.eventQueue.push({ type: 'interaction', ...event });

    console.log('🖱️ Interaction:', action, element);
    this.saveSession();
  }

  /**
   * Track personalization performance
   */
  trackPersonalization(
    experienceId: string,
    variantId: string,
    converted: boolean
  ): void {
    const event: PersonalizationEvent = {
      experienceId,
      variantId,
      converted,
      timestamp: Date.now(),
    };

    this.session.events.push(event);
    this.eventQueue.push({ type: 'personalization', ...event });

    console.log(
      '🎯 Personalization:',
      experienceId,
      variantId,
      converted ? '✓' : '✗'
    );
    this.saveSession();
  }

  /**
   * Track CTA click
   */
  trackCTAClick(
    ctaText: string,
    destination: string,
    contentUid?: string
  ): void {
    this.trackInteraction('click', 'cta', contentUid, {
      ctaText,
      destination,
    });
  }

  /**
   * Track search query
   */
  trackSearch(query: string, resultsCount: number): void {
    this.trackInteraction('search', 'search_bar', undefined, {
      query,
      resultsCount,
    });
  }

  /**
   * Get session analytics
   */
  getSessionStats(): {
    sessionId: string;
    duration: number;
    pageViews: number;
    totalEvents: number;
  } {
    return {
      sessionId: this.session.sessionId,
      duration: Date.now() - this.session.startTime,
      pageViews: this.session.pageViews,
      totalEvents: this.session.events.length,
    };
  }

  /**
   * Flush events to analytics service
   */
  private flushEvents(): void {
    if (this.eventQueue.length === 0) return;

    // In production, send to Contentstack Analytics API or your analytics service
    console.log('📤 Flushing events:', this.eventQueue.length);

    // Example: Send to API
    // await fetch('/api/analytics', {
    //   method: 'POST',
    //   body: JSON.stringify({ events: this.eventQueue, session: this.session }),
    // });

    this.eventQueue = [];
  }

  private saveSession(): void {
    sessionStorage.setItem(
      'cs_analytics_session',
      JSON.stringify(this.session)
    );
  }

  /**
   * Cleanup on page unload
   */
  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flushEvents();
  }
}

// Export singleton instance
export const analytics = new AnalyticsManager();

// ============================================
// React Integration Helpers
// ============================================

/**
 * Track component visibility using Intersection Observer
 */
export function createVisibilityTracker(
  contentType: string,
  entryUid: string,
  title: string
): IntersectionObserverCallback {
  let hasTracked = false;

  return (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasTracked) {
        analytics.trackContentView(contentType, entryUid, title);
        hasTracked = true;
      }
    });
  };
}

/**
 * Performance metrics
 */
export function trackPerformance(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming;

    if (navigation) {
      console.log('⚡ Performance Metrics:', {
        pageLoad: Math.round(navigation.loadEventEnd - navigation.startTime),
        domContentLoaded: Math.round(
          navigation.domContentLoadedEventEnd - navigation.startTime
        ),
        firstByte: Math.round(
          navigation.responseStart - navigation.requestStart
        ),
      });
    }
  });
}

// Auto-track performance on load
trackPerformance();
