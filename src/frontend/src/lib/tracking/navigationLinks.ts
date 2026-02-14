export function openGoogleMaps(lat: number, lng: number) {
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  window.open(url, '_blank');
}

export function openAppleMaps(lat: number, lng: number) {
  const url = `http://maps.apple.com/?q=${lat},${lng}`;
  window.open(url, '_blank');
}

export function navigateFromMyLocation(destLat: number, destLng: number) {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${destLat},${destLng}`;
        window.open(url, '_blank');
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to get your location. Please enable location services.');
      }
    );
  } else {
    alert('Geolocation is not supported by your browser.');
  }
}

export function viewFullRoute(fromLat: number, fromLng: number, toLat: number, toLng: number) {
  const url = `https://www.google.com/maps/dir/?api=1&origin=${fromLat},${fromLng}&destination=${toLat},${toLng}`;
  window.open(url, '_blank');
}
