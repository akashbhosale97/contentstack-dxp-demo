/**
 * Contentstack CMS SDK Configuration
 *
 * This module sets up the connection to Contentstack's headless CMS
 * for fetching and managing content across your application.
 */

// Get configuration from environment
const apiKey = import.meta.env.VITE_CONTENTSTACK_API_KEY || '';
const deliveryToken = import.meta.env.VITE_CONTENTSTACK_DELIVERY_TOKEN || '';
const environment =
  import.meta.env.VITE_CONTENTSTACK_ENVIRONMENT || 'production';
const customHost =
  import.meta.env.VITE_CONTENTSTACK_HOST || 'cdn.contentstack.io';

// Log configuration (without sensitive data)
console.log('📦 Contentstack Config:', {
  apiKey: apiKey ? `${apiKey.slice(0, 10)}...` : 'NOT SET',
  deliveryToken: deliveryToken ? `${deliveryToken.slice(0, 10)}...` : 'NOT SET',
  environment,
  host: customHost,
});

// ============================================
// Direct API Fetch (Works with custom hosts like dev14)
// ============================================

const baseUrl = `https://${customHost}/v3`;

async function fetchFromAPI<T>(endpoint: string): Promise<T | null> {
  if (!apiKey || !deliveryToken) {
    console.error('❌ Missing API key or delivery token');
    return null;
  }

  try {
    const url = `${baseUrl}${endpoint}`;
    console.log('🔍 Fetching:', url);

    const response = await fetch(url, {
      headers: {
        api_key: apiKey,
        access_token: deliveryToken,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error ${response.status}:`, errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('❌ Fetch error:', error);
    return null;
  }
}

// ============================================
// Content Types - Define your content structure
// ============================================

export interface BlogPost {
  uid: string;
  title: string;
  url: string;
  summary: string;
  featured_image?: {
    url: string;
    title: string;
  };
  body: string;
  author_name: string;
  publish_date: string;
}

export interface Product {
  uid: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  image?: {
    url: string;
    title: string;
  };
  category: string;
  in_stock: boolean;
}

export interface HeroBanner {
  uid: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  background_image?: {
    url: string;
  };
  variant_id?: string;
}

// API Response types
interface EntriesResponse<T> {
  entries: T[];
}

interface EntryResponse<T> {
  entry: T;
}

// ============================================
// Content Fetching Functions (Using Direct API)
// ============================================

/**
 * Fetch all entries of a specific content type
 */
export async function getEntries<T>(contentType: string): Promise<T[]> {
  try {
    const response = await fetchFromAPI<EntriesResponse<T>>(
      `/content_types/${contentType}/entries?environment=${environment}`
    );

    if (response?.entries) {
      console.log(
        `✅ Fetched ${response.entries.length} ${contentType} entries`
      );
      return response.entries;
    }

    return [];
  } catch (error) {
    console.error(`Error fetching ${contentType}:`, error);
    return [];
  }
}

/**
 * Fetch a single entry by UID
 */
export async function getEntryByUid<T>(
  contentType: string,
  uid: string
): Promise<T | null> {
  try {
    const response = await fetchFromAPI<EntryResponse<T>>(
      `/content_types/${contentType}/entries/${uid}?environment=${environment}`
    );

    if (response?.entry) {
      return response.entry;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching ${contentType}/${uid}:`, error);
    return null;
  }
}

/**
 * Fetch entries with a query filter
 */
export async function queryEntries<T>(
  contentType: string,
  query?: Record<string, unknown>
): Promise<T[]> {
  try {
    let endpoint = `/content_types/${contentType}/entries?environment=${environment}`;

    if (query) {
      endpoint += `&query=${encodeURIComponent(JSON.stringify(query))}`;
    }

    const response = await fetchFromAPI<EntriesResponse<T>>(endpoint);

    if (response?.entries) {
      return response.entries;
    }

    return [];
  } catch (error) {
    console.error(`Error querying ${contentType}:`, error);
    return [];
  }
}

/**
 * Fetch entry by URL/slug
 */
export async function getEntryByUrl<T>(
  contentType: string,
  url: string
): Promise<T | null> {
  try {
    const entries = await queryEntries<T>(contentType, { url });
    return entries[0] || null;
  } catch (error) {
    console.error(`Error fetching ${contentType} by url ${url}:`, error);
    return null;
  }
}

/**
 * Fetch hero banners by variant ID
 */
export async function getHeroBannerByVariant(
  variantId: string
): Promise<HeroBanner | null> {
  try {
    const allBanners = await getEntries<HeroBanner>('hero_banner');
    return allBanners.find((b) => b.variant_id === variantId) || null;
  } catch (error) {
    console.error(
      `Error fetching hero_banner for variant ${variantId}:`,
      error
    );
    return null;
  }
}

// Export a dummy Stack for backward compatibility with hooks
export default {
  ContentType: () => ({
    Query: () => ({
      toJSON: () => ({
        find: async () => [[]],
        findOne: async () => null,
      }),
      where: () => ({
        toJSON: () => ({
          findOne: async () => null,
        }),
      }),
    }),
    Entry: () => ({
      toJSON: () => ({
        fetch: async () => null,
      }),
    }),
  }),
};
