/**
 * Custom React Hooks for Contentstack CMS
 *
 * These hooks provide easy-to-use interfaces for fetching
 * and managing content from Contentstack.
 */
import { useState, useEffect, useCallback } from 'react';
import { getEntries, getEntryByUid, getEntryByUrl } from '../lib/contentstack';

// ============================================
// Types
// ============================================

interface UseContentResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface UseEntriesResult<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// ============================================
// Hooks
// ============================================

/**
 * Fetch multiple entries of a content type
 */
export function useEntries<T>(contentType: string): UseEntriesResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const entries = await getEntries<T>(contentType);
      setData(entries);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch entries')
      );
    } finally {
      setLoading(false);
    }
  }, [contentType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Fetch a single entry by UID
 */
export function useEntry<T>(
  contentType: string,
  uid: string
): UseContentResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!uid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const entry = await getEntryByUid<T>(contentType, uid);
      setData(entry);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch entry'));
    } finally {
      setLoading(false);
    }
  }, [contentType, uid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Fetch entry by URL/slug
 */
export function useEntryByUrl<T>(
  contentType: string,
  url: string
): UseContentResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!url) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const entry = await getEntryByUrl<T>(contentType, url);
      setData(entry);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch entry'));
    } finally {
      setLoading(false);
    }
  }, [contentType, url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Lazy load content on demand
 */
export function useLazyContent<T>(contentType: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchByUid = useCallback(
    async (uid: string) => {
      setLoading(true);
      setError(null);
      try {
        const entry = await getEntryByUid<T>(contentType, uid);
        setData(entry);
        return entry;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [contentType]
  );

  const fetchByUrl = useCallback(
    async (url: string) => {
      setLoading(true);
      setError(null);
      try {
        const entry = await getEntryByUrl<T>(contentType, url);
        setData(entry);
        return entry;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [contentType]
  );

  return { data, loading, error, fetchByUid, fetchByUrl };
}
