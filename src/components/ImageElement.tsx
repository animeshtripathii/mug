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
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, elementX: 0, elementY: 0 });
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
      elementX: element.x,
      elementY: element.y,
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
      let newX = resizeStart.elementX;
      let newY = resizeStart.elementY;

      // Maintain aspect ratio
      const aspectRatio = element.originalWidth / element.originalHeight;

      switch (resizeHandle) {
        case 'nw':
          newWidth = Math.max(50, resizeStart.width - deltaX);
          newHeight = newWidth / aspectRatio;
          newX = Math.max(0, resizeStart.elementX + deltaX);
          newY = Math.max(0, resizeStart.elementY + (resizeStart.height - newHeight));
          break;
        case 'n':
          newHeight = Math.max(50, resizeStart.height - deltaY);
          newWidth = newHeight * aspectRatio;
          newY = Math.max(0, resizeStart.elementY + deltaY);
          newX = resizeStart.elementX + (resizeStart.width - newWidth) / 2;
          break;
        case 'ne':
          newWidth = Math.max(50, resizeStart.width + deltaX);
          newHeight = newWidth / aspectRatio;
          newY = Math.max(0, resizeStart.elementY + (resizeStart.height - newHeight));
          break;
        case 'e':
          newWidth = Math.max(50, resizeStart.width + deltaX);
          newHeight = newWidth / aspectRatio;
          newY = resizeStart.elementY + (resizeStart.height - newHeight) / 2;
          break;
        case 'se':
          newWidth = Math.max(50, resizeStart.width + deltaX);
          newHeight = newWidth / aspectRatio;
          break;
        case 's':
          newHeight = Math.max(50, resizeStart.height + deltaY);
          newWidth = newHeight * aspectRatio;
          newX = resizeStart.elementX + (resizeStart.width - newWidth) / 2;
          break;
        case 'sw':
          newWidth = Math.max(50, resizeStart.width - deltaX);
          newHeight = newWidth / aspectRatio;
          newX = Math.max(0, resizeStart.elementX + deltaX);
          break;
        case 'w':
          newWidth = Math.max(50, resizeStart.width - deltaX);
          newHeight = newWidth / aspectRatio;
          newX = Math.max(0, resizeStart.elementX + deltaX);
          newY = resizeStart.elementY + (resizeStart.height - newHeight) / 2;
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

  // 8 Anchor Resize Handles Component
  const ResizeHandles = () => (
    <>
      {/* Corner handles */}
      <div 
        className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-nw-resize hover:bg-blue-600 transition-colors shadow-sm"
        style={{ top: -6, left: -6 }}
        onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
      ></div>
      <div 
        className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-ne-resize hover:bg-blue-600 transition-colors shadow-sm"
        style={{ top: -6, right: -6 }}
        onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
      ></div>
      <div 
        className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-sw-resize hover:bg-blue-600 transition-colors shadow-sm"
        style={{ bottom: -6, left: -6 }}
        onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
      ></div>
      <div 
        className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-se-resize hover:bg-blue-600 transition-colors shadow-sm"
        style={{ bottom: -6, right: -6 }}
        onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
      ></div>
      
      {/* Side handles */}
      <div 
        className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-n-resize hover:bg-blue-600 transition-colors shadow-sm"
        style={{ top: -6, left: '50%', transform: 'translateX(-50%)' }}
        onMouseDown={(e) => handleResizeMouseDown(e, 'n')}
      ></div>
      <div 
        className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-s-resize hover:bg-blue-600 transition-colors shadow-sm"
        style={{ bottom: -6, left: '50%', transform: 'translateX(-50%)' }}
        onMouseDown={(e) => handleResizeMouseDown(e, 's')}
      ></div>
      <div 
        className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-w-resize hover:bg-blue-600 transition-colors shadow-sm"
        style={{ top: '50%', left: -6, transform: 'translateY(-50%)' }}
        onMouseDown={(e) => handleResizeMouseDown(e, 'w')}
      ></div>
      <div 
        className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-e-resize hover:bg-blue-600 transition-colors shadow-sm"
        style={{ top: '50%', right: -6, transform: 'translateY(-50%)' }}
        onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
      ></div>
    </>
  );

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
        
        {isSelected && <ResizeHandles />}
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