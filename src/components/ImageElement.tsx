import React, { useState, useRef, useEffect } from 'react';
import { ImageElement as ImageElementType } from '../types/ImageElement';
import { useImageContext } from '../context/ImageContext';
import ImageFloatingToolbar from './ImageFloatingToolbar';

interface ImageElementProps {
  element: ImageElementType;
}

const ImageElement: React.FC<ImageElementProps> = ({ element }) => {
  const { updateImageElement, selectImageElement, selectedImageId } = useImageContext();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string>('');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, elementX: 0, elementY: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const isSelected = element.id === selectedImageId;

  // Debug logging
  useEffect(() => {
    console.log('ImageElement render:', { 
      elementId: element.id, 
      selectedImageId, 
      isSelected 
    });
  }, [element.id, selectedImageId, isSelected]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Image clicked, selecting:', element.id);
    // Always select the image when clicked
    selectImageElement(element.id);
    
    // Get canvas bounds for proper constraint calculation
    const canvasElement = document.querySelector('.canvas-area');
    if (!canvasElement) return;

    const canvasRect = canvasElement.getBoundingClientRect();
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      elementX: element.x,
      elementY: element.y,
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setResizeHandle(handle);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: element.width,
      height: element.height,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const canvasElement = document.querySelector('.canvas-area');
      if (!canvasElement) return;

      const canvasRect = canvasElement.getBoundingClientRect();
      const elementWidth = element.width;
      const elementHeight = element.height;

      // Calculate the movement delta
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      // Calculate new position based on original position + delta
      let newX = dragStart.elementX + deltaX;
      let newY = dragStart.elementY + deltaY;

      // Constrain to canvas boundaries
      newX = Math.max(0, Math.min(canvasRect.width - elementWidth, newX));
      newY = Math.max(0, Math.min(canvasRect.height - elementHeight, newY));

      updateImageElement(element.id, { x: newX, y: newY });
    } else if (isResizing) {
      const canvasElement = document.querySelector('.canvas-area');
      if (!canvasElement) return;

      const canvasRect = canvasElement.getBoundingClientRect();
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newX = element.x;
      let newY = element.y;

      // Maintain aspect ratio
      const aspectRatio = element.originalWidth / element.originalHeight;

      switch (resizeHandle) {
        case 'nw':
          newWidth = Math.max(50, resizeStart.width - deltaX);
          newHeight = newWidth / aspectRatio;
          newX = Math.max(0, element.x + (resizeStart.width - newWidth));
          newY = Math.max(0, element.y + (resizeStart.height - newHeight));
          break;
        case 'ne':
          newWidth = Math.max(50, Math.min(canvasRect.width - element.x, resizeStart.width + deltaX));
          newHeight = newWidth / aspectRatio;
          newY = Math.max(0, element.y + (resizeStart.height - newHeight));
          break;
        case 'sw':
          newWidth = Math.max(50, resizeStart.width - deltaX);
          newHeight = newWidth / aspectRatio;
          newX = Math.max(0, element.x + (resizeStart.width - newWidth));
          break;
        case 'se':
          newWidth = Math.max(50, Math.min(canvasRect.width - element.x, resizeStart.width + deltaX));
          newHeight = newWidth / aspectRatio;
          break;
      }

      // Ensure the element doesn't go outside canvas bounds
      if (newX + newWidth > canvasRect.width) {
        newWidth = canvasRect.width - newX;
        newHeight = newWidth / aspectRatio;
      }
      if (newY + newHeight > canvasRect.height) {
        newHeight = canvasRect.height - newY;
        newWidth = newHeight * aspectRatio;
      }

      updateImageElement(element.id, { 
        x: newX, 
        y: newY, 
        width: newWidth, 
        height: newHeight 
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle('');
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart, element.x, element.y, element.width, element.height]);

  const imageStyle: React.CSSProperties = {
    position: 'absolute',
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    cursor: isDragging ? 'grabbing' : (isSelected ? 'grab' : 'pointer'),
    userSelect: 'none',
    border: isSelected ? '2px dashed #3b82f6' : '2px dashed transparent',
    borderRadius: '4px',
    transition: isDragging || isResizing ? 'none' : 'all 0.2s ease',
    opacity: (element.opacity || 100) / 100,
    transform: `rotate(${element.rotation || 0}deg)`,
    filter: element.filter || 'none',
    zIndex: isSelected ? 10 : 1,
    clipPath: element.clipPath || 'none',
  };

  return (
    <>
      <div
        ref={elementRef}
        style={imageStyle}
        onMouseDown={handleMouseDown}
        className="image-element"
      >
        <img
          src={element.src}
          alt="Uploaded content"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none',
            borderRadius: '2px',
          }}
          draggable={false}
        />
        
        {isSelected && (
          <>
            {/* Resize handles */}
            <div 
              className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full cursor-nw-resize hover:bg-blue-600 transition-colors"
              onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
            ></div>
            <div 
              className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full cursor-ne-resize hover:bg-blue-600 transition-colors"
              onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
            ></div>
            <div 
              className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 rounded-full cursor-sw-resize hover:bg-blue-600 transition-colors"
              onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
            ></div>
            <div 
              className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize hover:bg-blue-600 transition-colors"
              onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
            ></div>
            
            {/* Move cursor indicator */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-6 h-6 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Floating Toolbar - Always render when selected */}
      {isSelected && (
        <ImageFloatingToolbar 
          isVisible={true} 
          selectedImageId={element.id}
        />
      )}
    </>
  );
};

export default ImageElement;