// # Lazy loading ke liye

import { useEffect, useRef, useState, useCallback } from 'react';

export function useIntersectionObserver({
  threshold = 0.1,      // 10% visible hone pe fire
  rootMargin = '0px',   // viewport se kitna door
  triggerOnce = false,  // sirf ek baar fire karna hai?
  root = null,          // custom scroll container
} = {}) {

  const ref = useRef(null);
  const [entry, setEntry] = useState(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef(null);

  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Browser support check
    if (!('IntersectionObserver' in window)) {
      setIsIntersecting(true); // fallback
      return;
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        setIsIntersecting(entry.isIntersecting);

        if (triggerOnce && entry.isIntersecting) {
          disconnect(); // ek baar dikh gaya, ab band karo
        }
      },
      { threshold, rootMargin, root }
    );

    observerRef.current.observe(node);
    return disconnect; // cleanup on unmount

  }, [threshold, rootMargin, root, triggerOnce, disconnect]);

  return { ref, isIntersecting, entry };
}