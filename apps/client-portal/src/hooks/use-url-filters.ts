import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import type { FilterState, FilterValue } from '@/store/filter.store';

export function useUrlFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(() => {
    const state: FilterState = {};
    searchParams.forEach((value, key) => {
      if (value.includes(',')) {
        state[key] = value.split(',');
      } else if (value.startsWith('dateRange:')) {
        const [_, from, to] = value.split(':');
        state[key] = { from: from || undefined, to: to || undefined };
      } else {
        state[key] = value;
      }
    });
    return state;
  }, [searchParams]);

  const setFilter = useCallback((key: string, value: FilterValue | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      params.delete(key);
    } else if (Array.isArray(value)) {
      params.set(key, value.join(','));
    } else if (typeof value === 'object' && ('from' in value || 'to' in value)) {
      if (!value.from && !value.to) {
        params.delete(key);
      } else {
        params.set(key, `dateRange:${value.from || ''}:${value.to || ''}`);
      }
    } else {
      params.set(key, String(value));
    }
    
    if (key !== 'page' && params.has('page')) {
      params.set('page', '1');
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  const clearFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  const setAllFilters = useCallback((newFilters: FilterState) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) return;
      if (Array.isArray(value)) {
        params.set(key, value.join(','));
      } else if (typeof value === 'object' && ('from' in value || 'to' in value)) {
        params.set(key, `dateRange:${value.from || ''}:${value.to || ''}`);
      } else {
        params.set(key, String(value));
      }
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router]);

  return { filters, setFilter, clearFilters, setAllFilters };
}
