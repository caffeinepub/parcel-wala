import { Home, Search, Package, Car, MapPin, List, MessageCircle, Bell, IndianRupee, User } from 'lucide-react';
import { TabId } from '../App';
import { useUnreadCounts } from '../hooks/useQueries';

interface MobileTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs = [
  { id: 'home' as TabId, icon: Home, label: 'Home' },
  { id: 'browse' as TabId, icon: Search, label: 'Browse' },
  { id: 'offer' as TabId, icon: Car, label: 'Offer Trip' },
  { id: 'track' as TabId, icon: MapPin, label: 'Track' },
  { id: 'profile' as TabId, icon: User, label: 'Profile' },
];

export default function MobileTabs({ activeTab, onTabChange }: MobileTabsProps) {
  const { chatUnread, notificationsUnread } = useUnreadCounts();

  const getBadgeCount = (tabId: TabId) => {
    if (tabId === 'chat') return chatUnread;
    if (tabId === 'notifications') return notificationsUnread;
    return 0;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const badgeCount = getBadgeCount(tab.id);

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-all duration-200 motion-safe:active:scale-95 ${
                isActive
                  ? 'text-primary motion-safe:scale-105'
                  : 'text-muted-foreground hover:text-foreground motion-safe:hover:scale-105'
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 transition-transform duration-200 ${isActive ? 'motion-safe:scale-110' : ''}`} />
                {badgeCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground motion-safe:animate-pulse">
                    {badgeCount > 9 ? '9+' : badgeCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
