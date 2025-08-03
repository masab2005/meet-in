'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from './userStore';

export default function StoreHydrationWrapper({ children }: { children: React.ReactNode }) {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const unsub = useUserStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    // In case hydration already finished before effect ran
    if (useUserStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }

    return () => unsub?.();
  }, []);

  if (!hasHydrated) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500 text-sm">Loading store...</p>
      </div>
    );
  }

  return <>{children}</>;
}
