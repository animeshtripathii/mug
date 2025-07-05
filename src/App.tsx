import React from 'react';
import EnhancedHeader from './components/EnhancedHeader';
import EnhancedSidebar from './components/EnhancedSidebar';
import Canvas from './components/Canvas';
import BottomControls from './components/BottomControls';
import { TextProvider } from './context/TextContext';
import { ImageProvider } from './context/ImageContext';
import { GraphicsProvider } from './context/GraphicsContext';
import { QRProvider } from './context/QRContext';

function App() {
  return (
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
            </div>
          </QRProvider>
        </GraphicsProvider>
      </ImageProvider>
    </TextProvider>
  );
}

export default App;