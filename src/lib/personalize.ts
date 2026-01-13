/**
 * Contentstack Personalize SDK Configuration
 *
 * This module enables personalized content delivery based on
 * user attributes, behaviors, and A/B testing experiments.
 */

// Types for Personalize SDK
interface PersonalizeConfig {
  projectUid: string;
}

interface UserAttributes {
  [key: string]: string | number | boolean | string[];
}

interface Experience {
  shortId: string;
  name: string;
  variants: Variant[];
}

interface Variant {
  uid: string;
  name: string;
  shortId: string;
}

// ============================================
// Personalize Manager Class
// ============================================

class PersonalizeManager {
  private initialized = false;
  private projectUid: string;
  private userAttributes: UserAttributes = {};
  private variantCache: Map<string, string> = new Map();

  constructor() {
    this.projectUid =
      import.meta.env.VITE_PERSONALIZE_PROJECT_UID || 'demo_project';
  }

  /**
   * Initialize the Personalize SDK
   */
  async init(config?: Partial<PersonalizeConfig>): Promise<void> {
    if (this.initialized) return;

    if (config?.projectUid) {
      this.projectUid = config.projectUid;
    }

    // In production, you would initialize the actual SDK here:
    // await Personalize.init({ projectUid: this.projectUid });

    this.initialized = true;
    console.log('🎯 Personalize initialized with project:', this.projectUid);
  }

  /**
   * Set user attributes for segmentation
   */
  setUserAttributes(attributes: UserAttributes): void {
    this.userAttributes = { ...this.userAttributes, ...attributes };
    console.log('👤 User attributes updated:', this.userAttributes);
  }

  /**
   * Get current user attributes
   */
  getUserAttributes(): UserAttributes {
    return { ...this.userAttributes };
  }

  /**
   * Get the variant for an experience
   * In production, this calls the Personalize Edge SDK
   */
  async getVariant(experienceShortId: string): Promise<string> {
    // Check cache first
    if (this.variantCache.has(experienceShortId)) {
      return this.variantCache.get(experienceShortId)!;
    }

    // In production, you would call:
    // const variant = await Personalize.getVariant(experienceShortId);

    // Demo: Simulate variant selection based on user attributes
    const variant = this.simulateVariantSelection();
    this.variantCache.set(experienceShortId, variant);

    return variant;
  }

  /**
   * Trigger an event for analytics
   */
  triggerEvent(eventName: string, eventData?: Record<string, unknown>): void {
    console.log('📊 Event triggered:', eventName, eventData);
    // In production: Personalize.triggerEvent(eventName, eventData);
  }

  /**
   * Simulate variant selection for demo purposes
   */
  private simulateVariantSelection(): string {
    const userType = this.userAttributes.userType as string;
    const location = this.userAttributes.location as string;

    // Demo logic: different variants based on user type
    if (userType === 'returning') {
      return 'variant_returning';
    } else if (location === 'EU') {
      return 'variant_eu';
    } else {
      return 'variant_default';
    }
  }

  /**
   * Clear variant cache (useful for testing)
   */
  clearCache(): void {
    this.variantCache.clear();
  }
}

// Export singleton instance
export const personalize = new PersonalizeManager();

// ============================================
// Personalization Helpers
// ============================================

/**
 * Audience segments for targeting
 */
export const AudienceSegments = {
  NEW_VISITOR: 'new_visitor',
  RETURNING_USER: 'returning_user',
  PREMIUM_MEMBER: 'premium_member',
  MOBILE_USER: 'mobile_user',
  DESKTOP_USER: 'desktop_user',
  US_REGION: 'us_region',
  EU_REGION: 'eu_region',
  APAC_REGION: 'apac_region',
} as const;

/**
 * Detect user attributes automatically
 */
export function detectUserAttributes(): UserAttributes {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const language = navigator.language;
  const isReturning = localStorage.getItem('cs_returning_user') === 'true';

  // Mark user as returning for next visit
  localStorage.setItem('cs_returning_user', 'true');

  return {
    deviceType: isMobile ? 'mobile' : 'desktop',
    timezone,
    language,
    userType: isReturning ? 'returning' : 'new',
    visitTime: new Date().getHours() < 12 ? 'morning' : 'afternoon',
  };
}

/**
 * Initialize personalization with auto-detected attributes
 */
export async function initializePersonalization(): Promise<void> {
  await personalize.init();
  const attributes = detectUserAttributes();
  personalize.setUserAttributes(attributes);
}

export type { UserAttributes, Experience, Variant };
