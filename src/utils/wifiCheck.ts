// Wi-Fi verification utility
// Check if the user is connected to the specific Wi-Fi network
export async function checkWiFiConnection(): Promise<boolean> {
  try {
    // Method 1: Network Information API (limited support)
    if ('connection' in navigator || 'mozConnection' in navigator || 'webkitConnection' in navigator) {
      // This API is limited and may not provide SSID
      // For now, we'll check if we're online
      if (navigator.onLine) {
        console.log('Device is online');
      }
    }

    // Method 2: IP-based verification (more reliable)
    // Check if the device IP is in the office network range
    // This requires the backend to verify the IP range
    const response = await fetch('/api/verify-network', {
      method: 'GET',
    }).catch(() => null);

    if (response && response.ok) {
      const data = await response.json();
      return data.isOfficeNetwork;
    }

    // Method 3: Fallback - For development/testing
    // In a real scenario, you would implement proper Wi-Fi verification
    // This could involve:
    // 1. Using a local server on the Wi-Fi network
    // 2. Checking IP ranges
    // 3. Using geolocation with network info
    
    // For now, return true if online (development mode)
    // In production, implement proper verification
    console.warn('Wi-Fi verification not fully implemented. Using online status.');
    return navigator.onLine;
    
  } catch (error) {
    console.error('Error checking Wi-Fi connection:', error);
    return false;
  }
}

// Mock verification for development (always returns true if online)
export function mockWiFiVerification(): boolean {
  return navigator.onLine;
}

// Check if device is online
export function isOnline(): boolean {
  return navigator.onLine;
}

// Listen for online/offline events
export function setupNetworkListeners(
  onOnline: () => void,
  onOffline: () => void
): () => void {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}
