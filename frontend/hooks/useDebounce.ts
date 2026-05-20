import { useEffect, useState } from "react";

/**
 * Returns a debounced copy of a value.
 *
 * @template T
 * @param {T} value - The input value to debounce.
 * @param {number} delay - Debounce delay in milliseconds.
 * @returns {T} The debounced value.
 */
export default function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [delay, value]);

  return debouncedValue;
}
