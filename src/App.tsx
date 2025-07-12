import React from 'react';
import { useEffect, useState, Suspense } from 'react';
import EnhancedHeader from './components/EnhancedHeader';
import EnhancedSidebar from './components/EnhancedSidebar';
import Canvas from './components/Canvas';
import BottomControls from './components/BottomControls';
import CanvasInfoPanel from './components/CanvasInfoPanel';
import ARViewer from './components/ARViewer';

import { TextProvider } from './context/TextContext';
import { ImageProvider } from './context/ImageContext';
import { GraphicsProvider } from './context/GraphicsContext';
import { QRProvider } from './context/QRContext';
import { ViewProvider } from './context/ViewContext';
import { CanvasProvider } from './context/CanvasContext';

// Loading component for AR
const ARLoadingFallback = () => (
  <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
    <div className="text-white text-center">
      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p>Loading AR experience...</p>
    </div>
  </div>
);

function App() {
  const [showARViewer, setShowARViewer] = useState(false);

  // Handle AR view from URL hash
  useEffect(() => {
    const checkARRoute = () => {
      if (window.location.pathname === '/ar-view' || window.location.search.includes('designId=')) {
        setShowARViewer(true);
      } else {
        setShowARViewer(false);
      }
    };

    checkARRoute();
    window.addEventListener('popstate', checkARRoute);
    window.addEventListener('hashchange', checkARRoute);

    return () => {
      window.removeEventListener('popstate', checkARRoute);
      window.removeEventListener('hashchange', checkARRoute);
    };
  }, []);

  const handleCloseAR = () => {
    console.log('Closing AR viewer');
    setShowARViewer(false);
    // Remove hash from URL
    if (window.location.hash === '#ar-view') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  // If AR viewer should be shown, render only that
  if (showARViewer) {
    return (
      <ViewProvider>
        <CanvasProvider>
          <TextProvider>
            <ImageProvider>
              <GraphicsProvider>
                <QRProvider>
                  <Suspense fallback={<ARLoadingFallback />}>
                    <ARViewer 
                      isOpen={true}
                      onClose={handleCloseAR}
                    />
                  </Suspense>
                </QRProvider>
              </GraphicsProvider>
            </ImageProvider>
          </TextProvider>
        </CanvasProvider>
      </ViewProvider>
    );
  }

  return (
    <ViewProvider>
      <CanvasProvider>
        <TextProvider>
          <ImageProvider>
            <GraphicsProvider>
              <QRProvider>
                <div className="h-screen flex flex-col bg-gray-50">
                  {/* Header */}
                  <EnhancedHeader />
                  
                  {/* Main Content */}
                  <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar */}
                    <EnhancedSidebar />
                    
                    {/* Canvas Area */}
                    <Canvas />
                  </div>
                  
                  {/* Bottom Controls */}
                  <BottomControls />
                  
                  {/* Canvas Info Panel */}
                  <CanvasInfoPanel />
                </div>
              </QRProvider>
            </GraphicsProvider>
          </ImageProvider>
        </TextProvider>
      </CanvasProvider>
    </ViewProvider>
  );
}

export default App;