import QRCode from 'qrcode';

export interface ARCapabilities {
  isSupported: boolean;
  hasWebXR: boolean;
  isMobile: boolean;
  browser: string;
  os: string;
}

export interface ARDesignData {
  textElements: any[];
  imageElements: any[];
  graphicElements: any[];
  qrElements: any[];
  canvasSize: { width: number; height: number };
  canvasBackgroundColor: string;
  designId?: string;
  timestamp: number;
}

export function checkARCapabilities(): ARCapabilities {
  const userAgent = navigator.userAgent;
  
  // Detect browser
  let browser = 'unknown';
  if (userAgent.includes('Chrome')) browser = 'chrome';
  else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'safari';
  else if (userAgent.includes('Firefox')) browser = 'firefox';
  else if (userAgent.includes('Edge')) browser = 'edge';
  
  // Detect OS
  let os = 'unknown';
  if (userAgent.includes('Android')) os = 'android';
  else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'ios';
  else if (userAgent.includes('Windows')) os = 'windows';
  else if (userAgent.includes('Mac')) os = 'macos';
  else if (userAgent.includes('Linux')) os = 'linux';
  
  // Check if mobile
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  // Check WebXR support
  const hasWebXR = 'xr' in navigator;
  
  // Determine AR support
  let isSupported = false;
  
  if (hasWebXR) {
    // WebXR is available, check for AR session support
    isSupported = true; // Will be verified async
  } else if (isMobile) {
    // Fallback for mobile devices without WebXR
    // iOS Safari 12+ or Chrome on Android
    if (os === 'ios' && browser === 'safari') {
      isSupported = true;
    } else if (os === 'android' && browser === 'chrome') {
      isSupported = true;
    }
  }
  
  return {
    isSupported,
    hasWebXR,
    isMobile,
    browser,
    os
  };
}

export async function requestARSession(): Promise<any> {
  if (!('xr' in navigator)) {
    throw new Error('WebXR not supported');
  }
  
  try {
    const session = await (navigator as any).xr.requestSession('immersive-ar', {
      requiredFeatures: ['local', 'hit-test'],
      optionalFeatures: ['dom-overlay', 'light-estimation']
    });
    
    return session;
  } catch (error) {
    console.error('Failed to create AR session:', error);
    throw error;
  }
}

// Generate AR QR code with design data embedded
export async function generateARQRCode(designData: ARDesignData, baseUrl?: string): Promise<string> {
  try {
    // Create a unique design ID if not provided
    const designId = designData.designId || `design_${Date.now()}`;

    // Prepare the data for QR code
    const arData = {
      ...designData,
      designId,
      timestamp: Date.now(),
      version: '1.0'
    };

    // Always use URL-based approach for AR QR code
    const currentUrl = baseUrl || window.location.origin;
    const arUrl = `${currentUrl}/ar-view?designId=${designId}&t=${Date.now()}`;

    // Store design data in localStorage or send to server
    if (typeof window !== 'undefined') {
      localStorage.setItem(`ar_design_${designId}`, JSON.stringify(arData));
    }

    return await QRCode.toDataURL(arUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (error) {
    console.error('Error generating AR QR code:', error);
    throw error;
  }
}

// Generate AR QR code for current design state
export async function generateCurrentDesignARQR(
  textElements: any[],
  imageElements: any[],
  graphicElements: any[],
  qrElements: any[],
  canvasSize: { width: number; height: number },
  canvasBackgroundColor: string,
  baseUrl?: string
): Promise<string> {
  const designData: ARDesignData = {
    textElements,
    imageElements,
    graphicElements,
    qrElements,
    canvasSize,
    canvasBackgroundColor,
    designId: `design_${Date.now()}`,
    timestamp: Date.now()
  };
  
  return generateARQRCode(designData, baseUrl);
}

// Parse AR data from QR code
export function parseARData(qrData: string): ARDesignData | null {
  try {
    // Try to parse as JSON (direct data embedding)
    const parsed = JSON.parse(qrData);
    if (parsed.version && parsed.designId) {
      return parsed as ARDesignData;
    }
  } catch (error) {
    // Not JSON, might be URL
    console.log('QR data is not JSON, checking if it\'s a URL');
  }
  
  // Check if it's a URL
  if (qrData.startsWith('http')) {
    const url = new URL(qrData);
    const designId = url.searchParams.get('designId');
    
    if (designId && typeof window !== 'undefined') {
      const storedData = localStorage.getItem(`ar_design_${designId}`);
      if (storedData) {
        try {
          return JSON.parse(storedData) as ARDesignData;
        } catch (error) {
          console.error('Error parsing stored AR data:', error);
        }
      }
    }
  }
  
  return null;
}

// Get AR instructions based on device capabilities
export function getARInstructions(): string {
  const capabilities = checkARCapabilities();
  
  if (!capabilities.isMobile) {
    return 'Please scan this QR code with your mobile device to view in AR';
  }
  
  if (capabilities.hasWebXR) {
    return 'Tap to start AR experience';
  }
  
  if (capabilities.os === 'ios') {
    return 'Open in Safari to view in AR';
  }
  
  if (capabilities.os === 'android') {
    return 'Open in Chrome to view in AR';
  }
  
  return 'AR viewing requires a compatible mobile browser';
}

// Get detailed AR setup instructions
export function getARSetupInstructions(): string[] {
  const capabilities = checkARCapabilities();
  
  if (capabilities.os === 'ios') {
    return [
      '1. Open your iPhone camera',
      '2. Point it at the QR code',
      '3. Tap the notification that appears',
      '4. Allow camera access when prompted',
      '5. Point your camera at a flat surface',
      '6. Tap to place your custom mug in AR'
    ];
  }
  
  if (capabilities.os === 'android') {
    return [
      '1. Open Google Chrome on your Android device',
      '2. Scan the QR code with Chrome',
      '3. Allow camera access when prompted',
      '4. Point your camera at a flat surface',
      '5. Tap to place your custom mug in AR'
    ];
  }
  
  return [
    '1. Scan this QR code with your mobile device',
    '2. Open the link in a compatible browser',
    '3. Allow camera access when prompted',
    '4. Point your camera at a flat surface',
    '5. Tap to place your custom mug in AR'
  ];
}

// Check if current device supports AR
export function isARSupported(): boolean {
  const capabilities = checkARCapabilities();
  return capabilities.isSupported;
}

// Get device-specific AR recommendations
export function getARRecommendations(): string {
  const capabilities = checkARCapabilities();
  
  if (!capabilities.isMobile) {
    return 'For the best AR experience, use a mobile device with a camera.';
  }
  
  if (capabilities.os === 'ios') {
    return 'For optimal AR experience on iOS, use Safari browser.';
  }
  
  if (capabilities.os === 'android') {
    return 'For optimal AR experience on Android, use Chrome browser.';
  }
  
  return 'Make sure you have a stable internet connection for the AR experience.';
}

// Generate a shareable AR link
export function generateARShareLink(designData: ARDesignData, baseUrl?: string): string {
  const currentUrl = baseUrl || window.location.origin;
  const designId = designData.designId || `design_${Date.now()}`;
  
  // Store design data
  if (typeof window !== 'undefined') {
    localStorage.setItem(`ar_design_${designId}`, JSON.stringify(designData));
  }
  
  return `${currentUrl}/ar-view?designId=${designId}`;
}

// Clean up old AR design data
export function cleanupOldARData(maxAge: number = 24 * 60 * 60 * 1000): void {
  if (typeof window === 'undefined') return;
  
  const now = Date.now();
  const keys = Object.keys(localStorage);
  
  keys.forEach(key => {
    if (key.startsWith('ar_design_')) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        if (data.timestamp && (now - data.timestamp) > maxAge) {
          localStorage.removeItem(key);
        }
      } catch (error) {
        // Remove invalid data
        localStorage.removeItem(key);
      }
    }
  });
}