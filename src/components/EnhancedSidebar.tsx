import React, { useState, useEffect } from 'react';
import { Type, Image, Shapes, QrCode, Table } from 'lucide-react';
import EnhancedTextPanel from './EnhancedTextPanel';
import ImageUploadPanel from './ImageUploadPanel';
import GraphicsPanel from './GraphicsPanel';
import QRCodePanel from './QRCodePanel';
import CropInterface from './CropInterface';

interface Tool {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const tools: Tool[] = [
  { id: 'text', name: 'Text', icon: Type },
  { id: 'images', name: 'Images', icon: Image },
  { id: 'graphics', name: 'Graphics', icon: Shapes },
  { id: 'qr-codes', name: 'QR-codes', icon: QrCode },
  { id: 'tables', name: 'Tables', icon: Table },
];

const EnhancedSidebar: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string>('text');
  const [showCropInterface, setShowCropInterface] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string>('');

  // Listen for crop interface events from the image toolbar
  useEffect(() => {
    const handleOpenCropInterface = (event: CustomEvent) => {
      console.log('Received crop interface event:', event.detail);
      setCropImageSrc(event.detail.imageSrc || '');
      setShowCropInterface(true);
      setActiveTool('images'); // Switch to images tab
    };

    window.addEventListener('openCropInterface', handleOpenCropInterface as EventListener);
    
    return () => {
      window.removeEventListener('openCropInterface', handleOpenCropInterface as EventListener);
    };
  }, []);

  const handleCloseCropInterface = () => {
    setShowCropInterface(false);
    setCropImageSrc('');
  };

  const handleApplyCrop = () => {
    console.log('Applying crop...');
    setShowCropInterface(false);
    setCropImageSrc('');
  };

  return (
    <div className="w-96 bg-white border-r border-gray-200 flex">
      {/* Tool Icons */}
      <div className="w-20 bg-gray-50 border-r border-gray-200">
        <div className="flex flex-col py-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;
            
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`flex flex-col items-center p-3 mx-2 mb-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{tool.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tool Panel */}
      <div className="flex-1 p-4 relative overflow-x-auto">
        <div className="min-w-0">
          {activeTool === 'text' && (
            <EnhancedTextPanel isActive={true} />
          )}
          
          {activeTool === 'images' && (
            <>
              {showCropInterface ? (
                <CropInterface
                  isOpen={showCropInterface}
                  onClose={handleCloseCropInterface}
                  onApply={handleApplyCrop}
                  imageSrc={cropImageSrc}
                />
              ) : (
                <ImageUploadPanel isActive={true} />
              )}
            </>
          )}
          
          {activeTool === 'graphics' && (
            <GraphicsPanel isActive={true} />
          )}
          
          {activeTool === 'qr-codes' && (
            <QRCodePanel isActive={true} />
          )}
          
          {activeTool === 'tables' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Tables</h3>
              <p className="text-sm text-gray-600 mb-4">
                Add tables for structured content layout.
              </p>
              <button className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                Insert Table
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedSidebar;