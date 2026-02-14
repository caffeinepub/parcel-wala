import { useState, useEffect } from 'react';

const STORAGE_KEY = 'parcel-wala-profile-photo';

export function useProfilePhoto() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Load saved photo from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setPhotoUrl(saved);
    }
  }, []);

  const updatePhoto = (file: File) => {
    // Create object URL for preview
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);

    // Convert to base64 and save to localStorage for persistence
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      localStorage.setItem(STORAGE_KEY, base64);
    };
    reader.readAsDataURL(file);
  };

  const clearPhoto = () => {
    if (photoUrl && photoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(photoUrl);
    }
    setPhotoUrl(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    photoUrl,
    updatePhoto,
    clearPhoto,
  };
}
