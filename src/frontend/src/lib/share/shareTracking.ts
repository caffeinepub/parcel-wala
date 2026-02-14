export async function shareTrackingLink(trackingId: string): Promise<boolean> {
  const url = `${window.location.origin}/#/track?id=${trackingId}`;
  const text = `Track your ParcelGo delivery: ${url}`;

  if (navigator.share) {
    try {
      await navigator.share({ title: 'ParcelGo Tracking', text, url });
      return true;
    } catch (error) {
      console.error('Share failed:', error);
    }
  }

  // Fallback to clipboard
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch (error) {
    console.error('Clipboard failed:', error);
    return false;
  }
}
