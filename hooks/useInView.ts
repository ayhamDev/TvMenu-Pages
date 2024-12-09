// src/hooks/useInView.ts
import { useState, useEffect, useRef } from "react";

interface IntersectionObserverOptions extends IntersectionObserverInit {
  threshold?: number | number[];
}

const useInView = (options: IntersectionObserverOptions = {}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isInView] as const;
};

export default useInView;
