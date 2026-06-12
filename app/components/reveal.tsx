'use client';

import { useEffect, useRef, type ReactNode, type CSSProperties } from 'react';

interface RevealProps {
  children: ReactNode;
  /** Slide-in direction; defaults to rising up from below */
  direction?: 'up' | 'left' | 'right' | 'pop';
  /** Seconds to wait once visible, e.g. 0.15 */
  delay?: number;
  className?: string;
}

/** Fades content in the first time it scrolls into view. */
export default function Reveal({ children, direction = 'up', delay = 0, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const directionClass = direction === 'up' ? '' : `reveal--${direction}`;

  return (
    <div
      ref={ref}
      className={`reveal ${directionClass} ${className}`}
      style={{ '--delay': `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}
