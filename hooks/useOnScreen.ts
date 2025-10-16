
import { useState, useEffect, useRef, MutableRefObject } from 'react';

export const useOnScreen = <T extends Element,>(options?: IntersectionObserverInit): [MutableRefObject<T | null>, boolean] => {
  const ref = useRef<T | null>(null);
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIntersecting(true);
        // Optional: unobserve after it's visible once
        // observer.unobserve(entry.target);
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, isIntersecting];
};
