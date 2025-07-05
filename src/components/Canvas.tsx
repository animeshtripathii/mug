import React from 'react';
import { useTextContext } from '../context/TextContext';
import { useImageContext } from '../context/ImageContext';
import { useGraphicsContext } from '../context/GraphicsContext';
import { useQRContext } from '../context/QRContext';
import { useViewContext } from '../context/ViewContext';
import TextElement from './TextElement';
import ImageElement from './ImageElement';
import GraphicElement from './GraphicElement';
import QRElement from './QRElement';
import CropOverlay from './CropOverlay';

const Canvas: React.FC = () => {
  const { textElements, selectTextElement } = useTextContext();
  const { imageElements, selectImageElement, selectedImageId } = useImageContext();
  const { graphicElements, selectGraphicElement } = useGraphicsContext();
  const { qrElements, selectQRElement } = useQRContext();
  const { 
    isGridVisible, 
    isRulersVisible, 
    isSafetyAreaVisible, 
    isHighlightEmptyTextVisible 
  } = useViewContext();

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only deselect if clicking on the canvas itself, not on text, image, graphic, or QR elements
    if (e.target === e.currentTarget) {
      selectTextElement(null);
      selectImageElement(null);
      selectGraphicElement(null);
      selectQRElement(null);
    }
  };

  const hasContent = textElements.length > 0 || imageElements.length > 0 || graphicElements.length > 0 || qrElements.length > 0;
  const selectedImage = selectedImageId ? imageElements.find(img => img.id === selectedImageId) : null;

  return (
    <div className="flex-1 bg-gray-100 p-8 flex items-center justify-center">
      <div className="relative">
        {/* Canvas Container */}
        <div className="relative bg-white shadow-lg">
          {/* Measurement Labels - only show if rulers are enabled */}
          {isRulersVisible && (
            <div className="absolute -top-8 left-0 right-0 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                {isSafetyAreaVisible && (
                  <>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Safety Area</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Bleed</span>
                    </div>
                  </>
                )}
              </div>
              <span className="text-sm font-medium text-gray-700">Front</span>
            </div>
          )}

          {/* Top Measurement - only show if rulers are enabled */}
          {isRulersVisible && (
            <div className="absolute -top-6 left-0 right-0 flex justify-center">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-px bg-gray-400"></div>
                <span className="text-xs text-gray-500">17.2cm</span>
                <div className="w-4 h-px bg-gray-400"></div>
              </div>
            </div>
          )}

          {/* Left Measurement - only show if rulers are enabled */}
          {isRulersVisible && (
            <div className="absolute -left-12 top-0 bottom-0 flex items-center">
              <div className="flex flex-col items-center space-y-2 -rotate-90">
                <div className="w-4 h-px bg-gray-400"></div>
                <span className="text-xs text-gray-500">7cm</span>
                <div className="w-4 h-px bg-gray-400"></div>
              </div>
            </div>
          )}

          {/* Design Area */}
          <div 
            className="canvas-area w-[688px] h-[280px] bg-gray-200 border-2 border-dashed border-gray-300 relative overflow-hidden cursor-default"
            onClick={handleCanvasClick}
          >
            {/* Safety Area Guide - only show if enabled */}
            {isSafetyAreaVisible && (
              <div className="absolute inset-4 border-2 border-dashed border-teal-500 opacity-60 pointer-events-none"></div>
            )}
            
            {/* Bleed Guide - only show if enabled */}
            {isSafetyAreaVisible && (
              <div className="absolute inset-2 border-2 border-dashed border-blue-500 opacity-60 pointer-events-none"></div>
            )}
            
            {/* Grid Pattern - only show if enabled */}
            {isGridVisible && (
              <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#3b82f6" strokeWidth="1"/>
                  </pattern>
                  <pattern id="smallGrid" width="5" height="5" patternUnits="userSpaceOnUse">
                    <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#3b82f6" strokeWidth="0.5" opacity="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#smallGrid)" />
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            )}

            {/* Default Grid Pattern - only show if grid is disabled */}
            {!isGridVisible && (
              <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="defaultGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#000" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#defaultGrid)" />
              </svg>
            )}
            
            {/* Upload Your Design Text - only show when no content */}
            {!hasContent && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-6xl font-light text-gray-400 mb-2">Upload Your</div>
                  <div className="text-6xl font-light text-gray-400">Design</div>
                </div>
              </div>
            )}

            {/* Graphic Elements */}
            {graphicElements.map((element) => (
              <GraphicElement key={element.id} element={element} />
            ))}

            {/* Image Elements */}
            {imageElements.map((element) => (
              <ImageElement key={element.id} element={element} />
            ))}

            {/* Text Elements */}
            {textElements.map((element) => (
              <TextElement 
                key={element.id} 
                element={element} 
                highlightEmpty={isHighlightEmptyTextVisible}
              />
            ))}

            {/* QR Code Elements */}
            {qrElements.map((element) => (
              <QRElement key={element.id} element={element} />
            ))}

            {/* Crop Overlay - only show when in crop mode */}
            {selectedImage && (
              <CropOverlay 
                imageElement={selectedImage}
                isVisible={true}
              />
            )}
          </div>
        </div>

        {/* Corner Handles */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-nw-resize"></div>
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-ne-resize"></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-sw-resize"></div>
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-se-resize"></div>
      </div>
    </div>
  );
};

export default Canvas;