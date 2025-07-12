import React, { useState, useEffect } from 'react';
import { X, Smartphone, Download, Share2, RefreshCw, Info } from 'lucide-react';
import { useTextContext } from '../context/TextContext';
import { useImageContext } from '../context/ImageContext';
import { useGraphicsContext } from '../context/GraphicsContext';
import { useQRContext } from '../context/QRContext';
import { useCanvasContext } from '../context/CanvasContext';
import { 
  generateCurrentDesignARQR, 
  getARInstructions, 
  getARSetupInstructions, 
  getARRecommendations,
  generateARShareLink,
  isARSupported
} from '../utils/arUtils';

interface ARQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const ARQRCodeModal: React.FC<ARQRCodeModalProps> = ({ 
  isOpen, 
  onClose, 
  title = "View in AR" 
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareLink, setShareLink] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const { textElements } = useTextContext();
  const { imageElements } = useImageContext();
  const { graphicElements } = useGraphicsContext();
  const { qrElements } = useQRContext();
  const { canvasSize, canvasBackgroundColor } = useCanvasContext();

  const generateQRCode = async () => {
    if (!isOpen) return;
    
    try {
      setIsGenerating(true);
      console.log('Generating AR QR code...');
      
      const qrUrl = await generateCurrentDesignARQR(
        textElements,
        imageElements,
        graphicElements,
        qrElements,
        canvasSize,
        canvasBackgroundColor,
        window.location.origin // <-- This will use the current domain!
      );
      
      setQrCodeUrl(qrUrl);
      
      // Generate share link
      const designData = {
        textElements,
        imageElements,
        graphicElements,
        qrElements,
        canvasSize,
        canvasBackgroundColor,
        designId: `design_${Date.now()}`,
        timestamp: Date.now()
      };
      
      const link = generateARShareLink(designData, window.location.origin);
      setShareLink(link);
      
      console.log('AR QR code generated successfully');
    } catch (error) {
      console.error('Error generating AR QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (window.location.pathname === '/ar-view') {
      // setShowARViewer(true); // This state variable is not defined in the original file
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      generateQRCode();
    }
  }, [isOpen, textElements, imageElements, graphicElements, qrElements, canvasSize, canvasBackgroundColor]);

  const handleDownloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = 'ar-qr-code.png';
      link.href = qrCodeUrl;
      link.click();
    }
  };

  const handleShare = async () => {
    if (navigator.share && shareLink) {
      try {
        await navigator.share({
          title: 'View my custom mug in AR',
          text: 'Check out this awesome custom mug design in augmented reality!',
          url: shareLink
        });
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else if (shareLink) {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareLink);
        alert('AR link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy to clipboard');
      }
    }
  };

  const handleRegenerate = () => {
    generateQRCode();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Icon and Title */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">View in Augmented Reality</h4>
            <p className="text-sm text-gray-600">
              Scan this QR code with your mobile device to see your custom mug in the real world
            </p>
          </div>

          {/* QR Code */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6 text-center">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-8">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                <p className="text-sm text-gray-600">Generating QR code...</p>
              </div>
            ) : qrCodeUrl ? (
              <div>
                <img 
                  src={qrCodeUrl} 
                  alt="AR QR Code" 
                  className="w-48 h-48 mx-auto border border-gray-200 rounded-lg shadow-sm"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Point your phone's camera at this QR code
                </p>
              </div>
            ) : (
              <div className="py-8 text-gray-500">
                <p>Failed to generate QR code</p>
              </div>
            )}
          </div>

          {/* Setup Instructions */}
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h5 className="font-medium text-blue-900 mb-2 flex items-center">
              <Info className="w-4 h-4 mr-1" />
              Setup Instructions:
            </h5>
            <ul className="text-sm text-blue-800 space-y-1">
              {getARSetupInstructions().map((instruction, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  {instruction}
                </li>
              ))}
            </ul>
          </div>

          {/* Device Recommendations */}
          <div className="bg-yellow-50 rounded-lg p-3 mb-6">
            <p className="text-sm text-yellow-800">
              💡 {getARRecommendations()}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleDownloadQR}
              disabled={!qrCodeUrl || isGenerating}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download QR Code
            </button>
            
            <button
              onClick={handleShare}
              disabled={!shareLink || isGenerating}
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share AR Link
            </button>
            
            <button
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              Regenerate QR Code
            </button>
          </div>

          {/* Advanced Options */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            </button>
            
            {showAdvanced && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <h6 className="font-medium text-gray-900 mb-2">Technical Details:</h6>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>• Design ID: {`design_${Date.now()}`}</p>
                  <p>• Elements: {textElements.length + imageElements.length + graphicElements.length + qrElements.length}</p>
                  <p>• Canvas Size: {canvasSize.width} × {canvasSize.height}</p>
                  <p>• AR Support: {isARSupported() ? 'Available' : 'Not Available'}</p>
                  {shareLink && (
                    <p className="break-all">• Share Link: {shareLink}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARQRCodeModal; 
