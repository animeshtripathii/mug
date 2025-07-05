import React, { useState, useRef, useEffect } from 'react';
import { ImageElement } from '../types/ImageElement';
import { useImageContext } from '../context/ImageContext';

interface CropOverlayProps {
  imageElement: ImageElement;
  isVisible: boolean;
}

const CropOverlay: React.FC<CropOverlayProps> = ({ imageElement, isVisible }) => {
  const { updateImageElement } = useImageContext();
  const [cropArea, setCropArea] = useState({ 
    x: imageElement.x + 20, 
    y: imageElement.y + 20, 
    width: imageElement.width - 40, 
    height: imageElement.height - 40 
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string>('');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, cropX: 0, cropY: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  if (!isVisible) return null;

  const handleMouseDown = (e: React.MouseEvent, type: 'drag' | 'resize', handle?: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (type === 'drag') {
      setIsDragging(true);
      setDragStart({
        x: e.clientX,
        y: e.clientY,
        cropX: cropArea.x,
        cropY: cropArea.y
      });
    } else if (type === 'resize' && handle) {
      setIsResizing(true);
      setResizeHandle(handle);
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: cropArea.width,
        height: cropArea.height
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    if (isDragging) {
      const newX = Math.max(imageElement.x, Math.min(imageElement.x + imageElement.width - cropArea.width, dragStart.cropX + deltaX));
      const newY = Math.max(imageElement.y, Math.min(imageElement.y + imageElement.height - cropArea.height, dragStart.cropY + deltaY));
      
      setCropArea(prev => ({
        ...prev,
        x: newX,
        y: newY
      }));
    } else if (isResizing) {
      const deltaXResize = e.clientX - resizeStart.x;
      const deltaYResize = e.clientY - resizeStart.y;
      
      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newX = cropArea.x;
      let newY = cropArea.y;

      switch (resizeHandle) {
        case 'se':
          newWidth = Math.max(50, Math.min(imageElement.x + imageElement.width - cropArea.x, resizeStart.width + deltaXResize));
          newHeight = Math.max(50, Math.min(imageElement.y + imageElement.height - cropArea.y, resizeStart.height + deltaYResize));
          break;
        case 'sw':
          newWidth = Math.max(50, resizeStart.width - deltaXResize);
          newHeight = Math.max(50, Math.min(imageElement.y + imageElement.height - cropArea.y, resizeStart.height + deltaYResize));
          newX = Math.max(imageElement.x, cropArea.x + (resizeStart.width - newWidth));
          break;
        case 'ne':
          newWidth = Math.max(50, Math.min(imageElement.x + imageElement.width - cropArea.x, resizeStart.width + deltaXResize));
          newHeight = Math.max(50, resizeStart.height - deltaYResize);
          newY = Math.max(imageElement.y, cropArea.y + (resizeStart.height - newHeight));
          break;
        case 'nw':
          newWidth = Math.max(50, resizeStart.width - deltaXResize);
          newHeight = Math.max(50, resizeStart.height - deltaYResize);
          newX = Math.max(imageElement.x, cropArea.x + (resizeStart.width - newWidth));
          newY = Math.max(imageElement.y, cropArea.y + (resizeStart.height - newHeight));
          break;
      }

      setCropArea({
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
  }, [isDragging, isResizing, dragStart, resizeStart, cropArea, imageElement]);

  return (
    <>
      {/* Crop Area Overlay */}
      <div 
        className="absolute border-2 border-blue-500 bg-blue-50 bg-opacity-30 cursor-move z-20"
        style={{
          left: cropArea.x,
          top: cropArea.y,
          width: cropArea.width,
          height: cropArea.height,
        }}
        onMouseDown={(e) => handleMouseDown(e, 'drag')}
      >
        {/* Corner Handles */}
        <div 
          className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full cursor-nw-resize border-2 border-white shadow-md hover:scale-110 transition-transform"
          onMouseDown={(e) => handleMouseDown(e, 'resize', 'nw')}
        ></div>
        <div 
          className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full cursor-ne-resize border-2 border-white shadow-md hover:scale-110 transition-transform"
          onMouseDown={(e) => handleMouseDown(e, 'resize', 'ne')}
        ></div>
        <div 
          className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 rounded-full cursor-sw-resize border-2 border-white shadow-md hover:scale-110 transition-transform"
          onMouseDown={(e) => handleMouseDown(e, 'resize', 'sw')}
        ></div>
        <div 
          className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize border-2 border-white shadow-md hover:scale-110 transition-transform"
          onMouseDown={(e) => handleMouseDown(e, 'resize', 'se')}
        ></div>
        
        {/* Grid lines inside crop area */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/3 top-0 bottom-0 w-px bg-blue-400 opacity-50"></div>
          <div className="absolute left-2/3 top-0 bottom-0 w-px bg-blue-400 opacity-50"></div>
          <div className="absolute top-1/3 left-0 right-0 h-px bg-blue-400 opacity-50"></div>
          <div className="absolute top-2/3 left-0 right-0 h-px bg-blue-400 opacity-50"></div>
        </div>
      </div>

      {/* Darkened overlay outside crop area */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Top overlay */}
        <div 
          className="absolute bg-black bg-opacity-40"
          style={{
            left: imageElement.x,
            top: imageElement.y,
            width: imageElement.width,
            height: cropArea.y - imageElement.y
          }}
        />
        
        {/* Bottom overlay */}
        <div 
          className="absolute bg-black bg-opacity-40"
          style={{
            left: imageElement.x,
            top: cropArea.y + cropArea.height,
            width: imageElement.width,
            height: imageElement.y + imageElement.height - (cropArea.y + cropArea.height)
          }}
        />
        
        {/* Left overlay */}
        <div 
          className="absolute bg-black bg-opacity-40"
          style={{
            left: imageElement.x,
            top: cropArea.y,
            width: cropArea.x - imageElement.x,
            height: cropArea.height
          }}
        />
        
        {/* Right overlay */}
        <div 
          className="absolute bg-black bg-opacity-40"
          style={{
            left: cropArea.x + cropArea.width,
            top: cropArea.y,
            width: imageElement.x + imageElement.width - (cropArea.x + cropArea.width),
            height: cropArea.height
          }}
        />
      </div>
    </>
  );
};

export default CropOverlay;