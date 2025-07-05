import React, { useState, useRef, useEffect } from 'react';
import { Check, X, RotateCcw } from 'lucide-react';
import { useImageContext } from '../context/ImageContext';

interface CropInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  imageSrc?: string;
}

const CropInterface: React.FC<CropInterfaceProps> = ({ isOpen, onClose, onApply, imageSrc }) => {
  const { selectedImageId, updateImageElement, imageElements } = useImageContext();
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);

  const selectedImage = selectedImageId ? imageElements.find(img => img.id === selectedImageId) : null;

  if (!isOpen) return null;

  const frames = [
    { id: 'none', icon: '🚫', label: 'No frame', shape: 'none' },
    { id: 'circle', icon: '🟢', label: 'Circle', shape: 'circle' },
    { id: 'triangle', icon: '🔺', label: 'Triangle', shape: 'triangle' },
    { id: 'square1', icon: '🟩', label: 'Square landscape', shape: 'square' },
    { id: 'square2', icon: '🟦', label: 'Square portrait', shape: 'square' },
    { id: 'heart', icon: '💚', label: 'Heart', shape: 'heart' },
    { id: 'star', icon: '⭐', label: 'Star', shape: 'star' },
    { id: 'badge', icon: '🏆', label: 'Badge', shape: 'badge' },
    { id: 'gear', icon: '⚙️', label: 'Gear', shape: 'gear' },
    { id: 'diamond1', icon: '💎', label: 'Diamond', shape: 'diamond' },
    { id: 'diamond2', icon: '💠', label: 'Diamond alt', shape: 'diamond-alt' },
    { id: 'diamond3', icon: '🔷', label: 'Diamond variant', shape: 'diamond-variant' }
  ];

  const handleFrameSelect = (frameId: string) => {
    setSelectedFrame(frameId === selectedFrame ? null : frameId);
  };

  const handleApply = () => {
    if (selectedImage && selectedImageId) {
      const cropData = {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        shape: selectedFrame || 'none'
      };

      updateImageElement(selectedImageId, {
        cropData,
        clipPath: getClipPath(selectedFrame)
      });
    }
    onApply();
    onClose();
  };

  const handleCancel = () => {
    setSelectedFrame(null);
    onClose();
  };

  const handleRemoveCrop = () => {
    setSelectedFrame(null);
    if (selectedImage && selectedImageId) {
      updateImageElement(selectedImageId, {
        cropData: null,
        clipPath: 'none'
      });
    }
  };

  const getClipPath = (frameType: string | null) => {
    if (!frameType || frameType === 'none') return 'none';
    
    switch (frameType) {
      case 'circle':
        return `circle(50% at 50% 50%)`;
      case 'triangle':
        return `polygon(50% 0%, 0% 100%, 100% 100%)`;
      case 'heart':
        return `path('M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5 C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z')`;
      case 'star':
        return `polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)`;
      case 'diamond':
      case 'diamond1':
      case 'diamond2':
      case 'diamond3':
        return `polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)`;
      case 'square':
      case 'square1':
      case 'square2':
        return `inset(0% 0% 0% 0%)`;
      default:
        return 'none';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Crop</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Lock Aspect Ratio */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-gray-900">Lock aspect ratio</span>
          <button
            onClick={() => setLockAspectRatio(!lockAspectRatio)}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              lockAspectRatio ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform flex items-center justify-center ${
                lockAspectRatio ? 'translate-x-7' : 'translate-x-1'
              }`}
            >
              {lockAspectRatio ? (
                <Check className="w-3 h-3 text-blue-500" />
              ) : (
                <X className="w-3 h-3 text-gray-400" />
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Frames Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Frames</h3>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          {frames.map((frame) => (
            <button
              key={frame.id}
              onClick={() => handleFrameSelect(frame.id)}
              className={`aspect-square border-2 rounded-lg p-4 flex items-center justify-center text-4xl hover:bg-gray-50 transition-all duration-200 hover:scale-105 ${
                selectedFrame === frame.id 
                  ? 'border-blue-500 bg-blue-50 scale-105 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              title={frame.label}
            >
              {frame.icon}
            </button>
          ))}
        </div>

        {/* Remove Crop Button */}
        <button
          onClick={handleRemoveCrop}
          className="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 mb-6"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Remove crop</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleCancel}
          className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleApply}
          className="flex-1 py-3 px-4 bg-cyan-400 hover:bg-cyan-500 text-black rounded-lg font-medium transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default CropInterface;