import { useCallback, useRef } from "react";

export function useDebounce<
  T extends (...args: unknown[]) => unknown
>(func: T, delay: number = 500): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => func(...args), delay);
    },
    [func, delay]
  );
}
