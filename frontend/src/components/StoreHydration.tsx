'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';

export function StoreHydration() {
  useEffect(() => {
    useAuthStore.persist.rehydrate();
  }, []);

  return null;
}
