import { useEffect, useState } from 'react';
import api from '../api/client.js';

let cache = null;

export function useCategories() {
  const [categories, setCategories] = useState(cache || []);

  useEffect(() => {
    if (cache) return undefined;
    let cancelled = false;

    api
      .get('/categories')
      .then(({ data }) => {
        cache = data.items;
        if (!cancelled) setCategories(data.items);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return categories;
}
