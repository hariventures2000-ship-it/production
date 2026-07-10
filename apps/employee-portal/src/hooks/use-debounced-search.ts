// ═══════════════════════════════════════════════════════════════════
// MERVI EMPLOYEE PORTAL — Search Debounce Hook
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';

export function useDebouncedSearch(value: string, delay = 250) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
