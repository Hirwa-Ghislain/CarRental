
import { useEffect, useState, useRef } from 'react';

interface UseAnimateInOptions {
  threshold?: number;
  delay?: number;
  rootMargin?: string;
}

// Hook to animate elements when they enter the viewport
export function useAnimateIn(options: UseAnimateInOptions = {}) {
  const { threshold = 0.1, delay = 0, rootMargin = '0px' } = options;
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add delay if specified
          if (delay > 0) {
            const timer = setTimeout(() => {
              setIsVisible(true);
            }, delay);
            return () => clearTimeout(timer);
          } else {
            setIsVisible(true);
          }
        }
      },
      { threshold, rootMargin }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, delay, rootMargin]);

  return { ref, isVisible };
}

// Hook to create staggered animations for lists
export function useStaggeredAnimation(itemCount: number, baseDelay: number = 100) {
  const delays = [];
  for (let i = 0; i < itemCount; i++) {
    delays.push(i * baseDelay);
  }
  return delays;
}

// Hook to track scroll position
export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollPosition;
}

// Hook to add parallax effect to elements
export function useParallax(speed: number = 0.5) {
  const elementRef = useRef<HTMLElement | null>(null);
  const [translate, setTranslate] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;
      
      const rect = elementRef.current.getBoundingClientRect();
      const elementPosition = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const distanceFromCenter = elementPosition - viewportCenter;
      
      setTranslate(-distanceFromCenter * speed);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return { elementRef, style: { transform: `translateY(${translate}px)` } };
}
