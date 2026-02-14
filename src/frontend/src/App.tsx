import { useEffect, useState } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import MobileAppLayout from './layouts/MobileAppLayout';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import SendParcelPage from './pages/SendParcelPage';
import OfferTripPage from './pages/OfferTripPage';
import TrackPage from './pages/TrackPage';
import MyListingsPage from './pages/MyListingsPage';
import ChatPage from './pages/ChatPage';
import NotificationsPage from './pages/NotificationsPage';
import EarningsPage from './pages/EarningsPage';
import ProfilePage from './pages/ProfilePage';
import AccessDeniedPage from './pages/AccessDeniedPage';
import ProfileSetupModal from './components/ProfileSetupModal';
import SignUpModal from './components/SignUpModal';
import { Toaster } from './components/ui/sonner';
import { NavigationProvider } from './contexts/NavigationContext';

export type TabId = 'home' | 'browse' | 'send' | 'offer' | 'track' | 'listings' | 'chat' | 'notifications' | 'earnings' | 'profile';

function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  // Check if sign up or profile setup is needed
  useEffect(() => {
    if (isAuthenticated && !profileLoading && isFetched) {
      const signUpIntent = sessionStorage.getItem('parcel-wala-signup-intent');
      
      if (userProfile === null) {
        if (signUpIntent === 'true') {
          setShowSignUp(true);
          setShowProfileSetup(false);
        } else {
          setShowProfileSetup(true);
          setShowSignUp(false);
        }
      } else {
        setShowProfileSetup(false);
        setShowSignUp(false);
        sessionStorage.removeItem('parcel-wala-signup-intent');
      }
    } else {
      setShowProfileSetup(false);
      setShowSignUp(false);
    }
  }, [isAuthenticated, profileLoading, isFetched, userProfile]);

  // Clear cache on logout
  useEffect(() => {
    if (!isAuthenticated && !isInitializing) {
      queryClient.clear();
    }
  }, [isAuthenticated, isInitializing, queryClient]);

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading Parcel Wala...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <AccessDeniedPage />
        <Toaster />
      </>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={setActiveTab} />;
      case 'browse':
        return <BrowsePage />;
      case 'send':
        return <SendParcelPage onNavigate={setActiveTab} />;
      case 'offer':
        return <OfferTripPage onNavigate={setActiveTab} />;
      case 'track':
        return <TrackPage />;
      case 'listings':
        return <MyListingsPage onNavigate={setActiveTab} />;
      case 'chat':
        return <ChatPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'earnings':
        return <EarningsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage onNavigate={setActiveTab} />;
    }
  };

  return (
    <NavigationProvider>
      <MobileAppLayout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
      </MobileAppLayout>
      <SignUpModal
        open={showSignUp}
        onClose={() => {
          setShowSignUp(false);
          sessionStorage.removeItem('parcel-wala-signup-intent');
        }}
      />
      <ProfileSetupModal
        open={showProfileSetup}
        onClose={() => setShowProfileSetup(false)}
      />
      <Toaster />
    </NavigationProvider>
  );
}

export default App;
