import { useRef } from 'react';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useProfilePhoto } from '../hooks/useProfilePhoto';
import { useQueryClient } from '@tanstack/react-query';
import VerificationDashboard from '../components/profile/VerificationDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { User, Star, Package, LogOut, Camera } from 'lucide-react';
import { SiCaffeine } from 'react-icons/si';

export default function ProfilePage() {
  const { identity, clear } = useInternetIdentity();
  const { data: profile, isLoading } = useGetCallerUserProfile();
  const { photoUrl, updatePhoto } = useProfilePhoto();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      updatePhoto(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const initials = profile?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U';

  const isVerified = profile?.identityVerified && profile?.phoneVerified;

  return (
    <div className="container max-w-2xl space-y-6 p-4">
      <h1 className="text-2xl font-bold">Profile</h1>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20 cursor-pointer" onClick={handlePhotoClick}>
                <AvatarImage src={photoUrl || '/assets/generated/parcelwala-app-icon.dim_512x512.png'} />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <button
                onClick={handlePhotoClick}
                className="absolute -bottom-1 -right-1 rounded-full bg-primary p-1.5 text-primary-foreground shadow-md hover:bg-primary/90 transition-colors"
                aria-label="Change profile photo"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
              {isVerified && (
                <div className="absolute -top-1 -right-1 rounded-full bg-green-500 p-1">
                  <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{profile?.name || 'User'}</h2>
              <p className="text-sm text-muted-foreground">
                Member since {new Date().getFullYear()}
              </p>
              {isVerified && (
                <Badge variant="default" className="mt-2">
                  Verified User
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <VerificationDashboard />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Rating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-5 w-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">(0 reviews)</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Parcels Sent</span>
            <span className="font-semibold">0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Trips Offered</span>
            <span className="font-semibold">0</span>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleLogout}
        variant="outline"
        className="w-full gap-2"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} Parcel Wala. Built with{' '}
          <SiCaffeine className="inline h-4 w-4 text-primary" /> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== 'undefined' ? window.location.hostname : 'parcel-wala'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
