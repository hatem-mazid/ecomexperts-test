import { useEffect, useRef } from 'react';

import {
  mergeSavedSelections,
  useBundleStore,
  type SaveBundleInput,
} from '@/state/bundle-store';

export function useRestoreSavedBundle(onRestore: (selections: SaveBundleInput) => void) {
  const hasRestored = useRef(false);

  useEffect(() => {
    const restore = () => {
      if (hasRestored.current) return;

      const saved = useBundleStore.getState().savedSystem;
      if (!saved) return;

      hasRestored.current = true;
      onRestore(mergeSavedSelections(saved));
    };

    restore();

    return useBundleStore.persist.onFinishHydration(restore);
  }, [onRestore]);
}
