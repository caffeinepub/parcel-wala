import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { TabId } from '../App';

interface NavigationContextType {
  history: TabId[];
  canGoBack: boolean;
  goBack: () => void;
  pushHistory: (tab: TabId) => void;
  transientBackHandler: (() => void) | null;
  setTransientBackHandler: (handler: (() => void) | null) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<TabId[]>(['home']);
  const [transientBackHandler, setTransientBackHandler] = useState<(() => void) | null>(null);

  const canGoBack = history.length > 1 || transientBackHandler !== null;

  const goBack = useCallback(() => {
    if (transientBackHandler) {
      transientBackHandler();
      return;
    }

    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
    }
  }, [history.length, transientBackHandler]);

  const pushHistory = useCallback((tab: TabId) => {
    setHistory(prev => {
      if (prev[prev.length - 1] === tab) return prev;
      return [...prev, tab];
    });
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        history,
        canGoBack,
        goBack,
        pushHistory,
        transientBackHandler,
        setTransientBackHandler,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}
