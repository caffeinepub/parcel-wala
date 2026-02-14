import { useRef, useCallback, RefObject } from 'react';
import { TabId } from '../App';

export function useTabScrollRestoration() {
  const scrollPositions = useRef<Map<TabId, number>>(new Map());
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  const saveScrollPosition = useCallback((tabId: TabId) => {
    if (scrollContainerRef.current) {
      scrollPositions.current.set(tabId, scrollContainerRef.current.scrollTop);
    }
  }, []);

  const restoreScrollPosition = useCallback((tabId: TabId) => {
    if (scrollContainerRef.current) {
      const savedPosition = scrollPositions.current.get(tabId) || 0;
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = savedPosition;
        }
      });
    }
  }, []);

  const setScrollContainer = useCallback((element: HTMLElement | null) => {
    scrollContainerRef.current = element;
  }, []);

  return {
    saveScrollPosition,
    restoreScrollPosition,
    setScrollContainer,
    scrollContainerRef: scrollContainerRef as RefObject<HTMLElement>,
  };
}
