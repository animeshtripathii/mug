import React, { useState, useRef, useEffect } from 'react';
import { Move3D, RotateCw } from 'lucide-react';
import { GraphicElement as GraphicElementType } from '../types/GraphicElement';
import { useGraphicsContext } from '../context/GraphicsContext';
import GraphicsFloatingToolbar from './GraphicsFloatingToolbar';

interface GraphicElementProps {
  element: GraphicElementType;
}

const GraphicElement: React.FC<GraphicElementProps> = ({ element }) => {
  const { updateGraphicElement, selectGraphicElement, selectedGraphicId } = useGraphicsContext();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string>('');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, elementX: 0, elementY: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, elementX: 0, elementY: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const isSelected = element.id === selectedGraphicId;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    selectGraphicElement(element.id);
    
    const canvasElement = document.querySelector('.canvas-area');
    if (!canvasElement) return;

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

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      let newX = dragStart.elementX + deltaX;
      let newY = dragStart.elementY + deltaY;

      newX = Math.max(0, Math.min(canvasRect.width - elementWidth, newX));
      newY = Math.max(0, Math.min(canvasRect.height - elementHeight, newY));

      updateGraphicElement(element.id, { x: newX, y: newY });
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

      switch (resizeHandle) {
        case 'nw':
          newWidth = Math.max(20, resizeStart.width - deltaX);
          newHeight = Math.max(20, resizeStart.height - deltaY);
          newX = Math.max(0, resizeStart.elementX + deltaX);
          newY = Math.max(0, resizeStart.elementY + deltaY);
          break;
        case 'n':
          newHeight = Math.max(20, resizeStart.height - deltaY);
          newY = Math.max(0, resizeStart.elementY + deltaY);
          break;
        case 'ne':
          newWidth = Math.max(20, resizeStart.width + deltaX);
          newHeight = Math.max(20, resizeStart.height - deltaY);
          newY = Math.max(0, resizeStart.elementY + deltaY);
          break;
        case 'e':
          newWidth = Math.max(20, resizeStart.width + deltaX);
          break;
        case 'se':
          newWidth = Math.max(20, resizeStart.width + deltaX);
          newHeight = Math.max(20, resizeStart.height + deltaY);
          break;
        case 's':
          newHeight = Math.max(20, resizeStart.height + deltaY);
          break;
        case 'sw':
          newWidth = Math.max(20, resizeStart.width - deltaX);
          newHeight = Math.max(20, resizeStart.height + deltaY);
          newX = Math.max(0, resizeStart.elementX + deltaX);
          break;
        case 'w':
          newWidth = Math.max(20, resizeStart.width - deltaX);
          newX = Math.max(0, resizeStart.elementX + deltaX);
          break;
      }

      if (newX + newWidth > canvasRect.width) {
        newWidth = canvasRect.width - newX;
      }
      if (newY + newHeight > canvasRect.height) {
        newHeight = canvasRect.height - newY;
      }

      updateGraphicElement(element.id, { 
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

  const elementStyle: React.CSSProperties = {
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
    zIndex: isSelected ? 10 : 1,
    backgroundColor: element.fillColor || '#000000',
    borderColor: isSelected ? '#3b82f6' : 'transparent',
    borderWidth: element.strokeWidth || 0,
    borderStyle: element.strokeStyle || 'solid',
  };

  const renderShape = () => {
    const commonProps = {
      width: '100%',
      height: '100%',
      fill: element.fillColor || '#000000',
      stroke: element.strokeWidth ? '#000000' : 'none',
      strokeWidth: element.strokeWidth || 0,
    };

    switch (element.type) {
      case 'circle':
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" {...commonProps} />
          </svg>
        );
      case 'rectangle':
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <rect x="5" y="5" width="90" height="90" {...commonProps} />
          </svg>
        );
      case 'triangle':
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <polygon points="50,5 95,95 5,95" {...commonProps} />
          </svg>
        );
      default:
        return null;
    }
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
        style={elementStyle}
        onMouseDown={handleMouseDown}
        className="graphic-element"
      >
        {renderShape()}
        
        {isSelected && <ResizeHandles />}
      </div>

      {/* Element Controls - positioned below the shape */}
      {isSelected && (
        <div 
          className="absolute bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 z-20"
          style={{
            left: element.x + element.width / 2 - 40,
            top: element.y + element.height + 10,
          }}
        >
          <div className="flex items-center space-x-2">
            {/* Move tool */}
            <button
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Move"
            >
              <Move3D className="w-4 h-4 text-gray-600" />
            </button>
            
            {/* Rotate tool */}
            <button
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Rotate"
            >
              <RotateCw className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toolbar - Always render when selected */}
      {isSelected && (
        <GraphicsFloatingToolbar 
          isVisible={true} 
          selectedGraphicId={element.id}
        />
      )}
    </>
  );
};

export default GraphicElement;