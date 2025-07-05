import React, { useState } from 'react';
import { ChevronDown, Settings, RotateCcw } from 'lucide-react';

const BottomControls: React.FC = () => {
  const [zoomLevel, setZoomLevel] = useState<string>('100%');
  const [showZoomDropdown, setShowZoomDropdown] = useState<boolean>(false);

  const zoomOptions = ['25%', '50%', '75%', '100%', '125%', '150%', '200%', 'Fit to window'];

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Zoom Controls */}
        <div className="flex items-center space-x-4">
          {/* Zoom Slider */}
          <div className="flex items-center space-x-3">
            <input
              type="range"
              min="25"
              max="200"
              value={parseInt(zoomLevel)}
              onChange={(e) => setZoomLevel(`${e.target.value}%`)}
              className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            
            {/* Zoom Percentage Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowZoomDropdown(!showZoomDropdown)}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium">{zoomLevel}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showZoomDropdown && (
                <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  {zoomOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setZoomLevel(option);
                        setShowZoomDropdown(false);
                      }}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side - View Controls */}
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">View</span>
          </button>
          
          {/* Reset/Refresh Button */}
          <button className="p-2 text-orange-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors" title="Reset view">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomControls;