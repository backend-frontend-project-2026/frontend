import { useCallback, useEffect, useState } from 'react';

export function useCountdown(initial: number) {
  const [seconds, setSeconds] = useState(0);

  const start = useCallback(() => {
    setSeconds(initial);
  }, [initial]);

  useEffect(() => {
    if (seconds <= 0) return;

    const id = setInterval(() => {
      setSeconds((s) => (s > 1 ? s - 1 : 0));
    }, 1000);

    return () => clearInterval(id);
  }, [seconds]);

  return { seconds, start } as const;
}
