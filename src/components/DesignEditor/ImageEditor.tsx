import React, { useState } from 'react';
import { 
  Upload, 
  Link, 
  RotateCw, 
  Crop,
  Sliders,
  Eye,
  EyeOff,
  Download
} from 'lucide-react';
import { DesignElement } from '../../types';

interface ImageEditorProps {
  selectedElement: DesignElement | null;
  onElementUpdate: (id: string, updates: Partial<DesignElement>) => void;
  onImageUpload: (file: File) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ 
  selectedElement, 
  onElementUpdate, 
  onImageUpload 
}) => {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkNewWindow, setLinkNewWindow] = useState(true);
  const [imageUrl, setImageUrl] = useState('');

  if (!selectedElement || selectedElement.type !== 'image') {
    return (
      <div className="space-y-4">
        <div className="border-b pb-4">
          <h4 className="font-semibold text-gray-900 mb-3">Add Image</h4>
          <div className="space-y-3">
            <button
              onClick={() => document.getElementById('image-upload')?.click()}
              className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <Upload className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">Upload from Device</span>
            </button>
            
            <div className="text-center text-sm text-gray-500">or</div>
            
            <div className="space-y-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => {
                  if (imageUrl) {
                    // Create a mock file object for URL images
                    const mockFile = new File([''], 'url-image', { type: 'image/jpeg' });
                    onImageUpload(mockFile);
                    setImageUrl('');
                  }
                }}
                disabled={!imageUrl}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add Image from URL
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const updateStyle = (property: string, value: any) => {
    onElementUpdate(selectedElement.id, {
      styles: { ...selectedElement.styles, [property]: value }
    });
  };

  const handleLinkSave = () => {
    onElementUpdate(selectedElement.id, {
      link: linkUrl ? { url: linkUrl, openInNewWindow: linkNewWindow } : undefined
    });
    setShowLinkDialog(false);
  };

  const handleAltTextChange = (altText: string) => {
    onElementUpdate(selectedElement.id, { altText });
  };

  return (
    <div className="space-y-4">
      <div className="border-b pb-4">
        <h4 className="font-semibold text-gray-900 mb-3">Image Properties</h4>
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3">
          <img
            src={selectedElement.content}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Replace Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Replace Image</label>
        <div className="space-y-2">
          <button
            onClick={() => document.getElementById('image-replace')?.click()}
            className="w-full flex items-center justify-center space-x-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            <Upload className="h-4 w-4" />
            <span>Upload New Image</span>
          </button>
          
          <div className="flex space-x-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Or enter new URL"
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <button
              onClick={() => {
                if (imageUrl) {
                  onElementUpdate(selectedElement.id, { content: imageUrl });
                  setImageUrl('');
                }
              }}
              disabled={!imageUrl}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 text-sm"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Image Adjustments */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Opacity: {Math.round((selectedElement.styles?.opacity || 1) * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={selectedElement.styles?.opacity || 1}
          onChange={(e) => updateStyle('opacity', parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Brightness: {Math.round((selectedElement.styles?.brightness || 1) * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={selectedElement.styles?.brightness || 1}
          onChange={(e) => updateStyle('brightness', parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contrast: {Math.round((selectedElement.styles?.contrast || 1) * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={selectedElement.styles?.contrast || 1}
          onChange={(e) => updateStyle('contrast', parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Border Radius */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Corner Radius: {selectedElement.styles?.borderRadius || 0}px
        </label>
        <input
          type="range"
          min="0"
          max="50"
          value={selectedElement.styles?.borderRadius || 0}
          onChange={(e) => updateStyle('borderRadius', parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Alt Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text (Accessibility)</label>
        <input
          type="text"
          value={selectedElement.altText || ''}
          onChange={(e) => handleAltTextChange(e.target.value)}
          placeholder="Describe this image..."
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Link */}
      <div>
        <button
          onClick={() => setShowLinkDialog(true)}
          className="w-full flex items-center justify-center space-x-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          <Link className="h-4 w-4" />
          <span>{selectedElement.link ? 'Edit Link' : 'Add Link'}</span>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="border-t pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Quick Actions</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => updateStyle('filter', 'grayscale(100%)')}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm"
          >
            Grayscale
          </button>
          <button
            onClick={() => updateStyle('filter', 'sepia(100%)')}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm"
          >
            Sepia
          </button>
          <button
            onClick={() => updateStyle('filter', 'blur(2px)')}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm"
          >
            Blur
          </button>
          <button
            onClick={() => updateStyle('filter', 'none')}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        id="image-replace"
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onImageUpload(file);
        }}
        className="hidden"
      />

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add/Edit Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="newWindow"
                  checked={linkNewWindow}
                  onChange={(e) => setLinkNewWindow(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="newWindow" className="text-sm text-gray-700">
                  Open in new window
                </label>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleLinkSave}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowLinkDialog(false)}
                  className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageEditor;