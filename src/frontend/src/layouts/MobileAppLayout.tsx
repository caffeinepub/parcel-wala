import { ReactNode, useEffect, useRef } from 'react';
import BrandHeader from '../components/BrandHeader';
import MobileTabs from '../components/MobileTabs';
import AnimatedTabContent from '../components/motion/AnimatedTabContent';
import { useTabScrollRestoration } from '../hooks/useTabScrollRestoration';
import { useNavigation } from '../contexts/NavigationContext';
import { TabId } from '../App';

interface MobileAppLayoutProps {
  children: ReactNode;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const TAB_ORDER: TabId[] = ['home', 'browse', 'track', 'chat', 'profile', 'send', 'offer', 'listings', 'notifications', 'earnings'];

export default function MobileAppLayout({ children, activeTab, onTabChange }: MobileAppLayoutProps) {
  const { saveScrollPosition, restoreScrollPosition, setScrollContainer } = useTabScrollRestoration();
  const { pushHistory, history, goBack } = useNavigation();
  const previousTabRef = useRef<TabId>(activeTab);

  // Compute slide direction based on tab order
  const getSlideDirection = (from: TabId, to: TabId): 'left' | 'right' => {
    const fromIndex = TAB_ORDER.indexOf(from);
    const toIndex = TAB_ORDER.indexOf(to);
    return toIndex > fromIndex ? 'right' : 'left';
  };

  const slideDirection = getSlideDirection(previousTabRef.current, activeTab);

  // Handle tab changes with scroll restoration and history
  useEffect(() => {
    if (previousTabRef.current !== activeTab) {
      saveScrollPosition(previousTabRef.current);
      pushHistory(activeTab);
      previousTabRef.current = activeTab;
      setTimeout(() => restoreScrollPosition(activeTab), 50);
    }
  }, [activeTab, saveScrollPosition, restoreScrollPosition, pushHistory]);

  const handleBack = () => {
    goBack();
    if (history.length > 1) {
      const previousTab = history[history.length - 2];
      onTabChange(previousTab);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background sky-pattern-overlay">
      <BrandHeader onBack={handleBack} />
      <main 
        ref={setScrollContainer}
        className="flex-1 overflow-y-auto pb-20"
        style={{
          backgroundImage: 'url(/assets/generated/sky-bg.dim_1440x900.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundBlendMode: 'soft-light',
        }}
      >
        <AnimatedTabContent tabKey={activeTab} direction={slideDirection}>
          {children}
        </AnimatedTabContent>
      </main>
      <MobileTabs activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}
