'use client';

import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [hasMounted, setHasMounted] = useState(false);

  // On mount, read from localStorage
  useEffect(() => {
    setHasMounted(true);
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.log(error);
    }
  }, [key]);

  // When storedValue changes, and we've mounted, update localStorage
  useEffect(() => {
    if (hasMounted) {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.error(error);
      }
    }
  }, [key, storedValue, hasMounted]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
