import { useCallback, useEffect, useState } from 'react';

const DEFAULT_DURATION_MS = 3000;

export function useFlashMessage(duration = DEFAULT_DURATION_MS) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;

    const timeoutId = window.setTimeout(() => setMessage(null), duration);
    return () => window.clearTimeout(timeoutId);
  }, [message, duration]);

  const showFlash = useCallback((nextMessage: string) => {
    setMessage(nextMessage);
  }, []);

  const clearFlash = useCallback(() => {
    setMessage(null);
  }, []);

  return { message, showFlash, clearFlash };
}
