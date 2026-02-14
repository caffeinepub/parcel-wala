import { ReactNode, useEffect, useState } from 'react';

interface AnimatedTabContentProps {
  children: ReactNode;
  tabKey: string;
  direction?: 'left' | 'right';
}

export default function AnimatedTabContent({ children, tabKey, direction = 'right' }: AnimatedTabContentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentKey, setCurrentKey] = useState(tabKey);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Handle tab transitions
  useEffect(() => {
    if (tabKey !== currentKey) {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setCurrentKey(tabKey);
        setIsVisible(true);
      }, prefersReducedMotion ? 0 : 150);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [tabKey, currentKey, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <div key={currentKey}>{children}</div>;
  }

  const translateFrom = direction === 'left' ? '-translate-x-4' : 'translate-x-4';
  const translateTo = 'translate-x-0';

  return (
    <div
      key={currentKey}
      className={`transition-all duration-300 ease-out ${
        isVisible
          ? `${translateTo} opacity-100`
          : `${translateFrom} opacity-0`
      }`}
    >
      {children}
    </div>
  );
}
