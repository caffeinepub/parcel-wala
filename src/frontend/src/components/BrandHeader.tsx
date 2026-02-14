import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigation } from '../contexts/NavigationContext';

interface BrandHeaderProps {
  onBack: () => void;
}

export default function BrandHeader({ onBack }: BrandHeaderProps) {
  const { canGoBack } = useNavigation();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90 sky-gradient-header">
      <div className="container flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {canGoBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-foreground hover:bg-accent"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
          )}
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/parcelwala-app-icon.dim_512x512.png"
              alt="Parcel Wala"
              className="h-14 w-14 rounded-xl"
            />
            <img
              src="/assets/generated/parcelwala-logo.dim_1200x400.png"
              alt="Parcel Wala"
              className="h-10 w-auto"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
