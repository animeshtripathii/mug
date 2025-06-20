import React, { useRef, useState, useCallback } from 'react';
import { DesignElement } from '../../types';
import { ZoomIn, ZoomOut, Eye, RotateCcw, Maximize, Box, Settings } from 'lucide-react';
import Model3DViewer from './Model3DViewer';

interface CanvasProps {
  elements: DesignElement[];
  selectedElement: string | null;
  mugView: 'front' | 'wrap';
  onElementSelect: (id: string) => void;
  onElementUpdate: (id: string, updates: Partial<DesignElement>) => void;
  onMugViewChange: (view: 'front' | 'wrap') => void;
}

const Canvas: React.FC<CanvasProps> = ({
  elements,
  selectedElement,
  mugView,
  onElementSelect,
  onElementUpdate,
  onMugViewChange
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [show3D, setShow3D] = useState(false);

  // Canvas dimensions - larger for better editing
  const canvasWidth = 600;
  const canvasHeight = 400;
  
  // Design area with safety margins
  const safeArea = {
    x: 50,
    y: 50,
    width: canvasWidth - 100,
    height: canvasHeight - 100
  };

  const bleedArea = {
    x: 30,
    y: 30,
    width: canvasWidth - 60,
    height: canvasHeight - 60
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const element = elements.find(el => el.id === elementId);
    if (!element) return;

    setIsDragging(true);
    setDragStart({
      x: e.clientX - rect.left - element.x,
      y: e.clientY - rect.top - element.y
    });
    
    onElementSelect(elementId);
  }, [elements, onElementSelect]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !selectedElement) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const newX = e.clientX - rect.left - dragStart.x;
    const newY = e.clientY - rect.top - dragStart.y;

    // Constrain to canvas area
    const constrainedX = Math.max(0, Math.min(newX, canvasWidth - 50));
    const constrainedY = Math.max(0, Math.min(newY, canvasHeight - 50));

    // Update 3D mapping coordinates
    const element = elements.find(el => el.id === selectedElement);
    if (element) {
      const u = constrainedX / canvasWidth;
      const v = constrainedY / canvasHeight;
      
      onElementUpdate(selectedElement, {
        x: constrainedX,
        y: constrainedY,
        mapping: { u, v, scale: element.mapping?.scale || 1 }
      });
    }
  }, [isDragging, selectedElement, dragStart, elements, onElementUpdate, canvasWidth, canvasHeight]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onElementSelect('');
    }
  }, [onElementSelect]);

  const handleTextDoubleClick = useCallback((elementId: string) => {
    onElementSelect(elementId);
    // Focus on text editing
  }, [onElementSelect]);

  const renderElement = (element: DesignElement) => {
    const isSelected = selectedElement === element.id;
    
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      transform: `rotate(${element.rotation}deg)`,
      zIndex: element.zIndex,
      cursor: isDragging ? 'grabbing' : 'grab',
      border: isSelected ? '2px solid #3b82f6' : '1px solid transparent',
      ...element.styles
    };

    switch (element.type) {
      case 'text':
        return (
          <div
            key={element.id}
            style={baseStyle}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            onDoubleClick={() => handleTextDoubleClick(element.id)}
            className="group"
          >
            <div style={{
              fontSize: element.styles?.fontSize || 46,
              fontFamily: element.styles?.fontFamily || 'Arimo',
              color: element.styles?.color || '#000000',
              backgroundColor: element.styles?.backgroundColor || 'transparent',
              fontWeight: element.styles?.fontWeight || 'normal',
              fontStyle: element.styles?.fontStyle || 'normal',
              textDecoration: element.styles?.textDecoration || 'none',
              textAlign: element.styles?.textAlign || 'center',
              lineHeight: element.styles?.lineHeight || 1.4,
              letterSpacing: element.styles?.letterSpacing ? `${element.styles.letterSpacing}px` : 'normal',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: element.styles?.textAlign === 'center' ? 'center' : 
                           element.styles?.textAlign === 'right' ? 'flex-end' : 'flex-start',
              userSelect: 'none',
              padding: '8px',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
              overflow: 'hidden'
            }}>
              {element.content}
            </div>
            {isSelected && (
              <>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded cursor-se-resize" />
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded cursor-nw-resize" />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded cursor-ne-resize" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded cursor-sw-resize" />
              </>
            )}
          </div>
        );
      
      case 'image':
        return (
          <div
            key={element.id}
            style={baseStyle}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            className="group"
          >
            <img
              src={element.content}
              alt={element.altText || "Design element"}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: element.styles?.borderRadius || 0,
                opacity: element.styles?.opacity || 1,
                filter: `brightness(${element.styles?.brightness || 1}) contrast(${element.styles?.contrast || 1}) ${element.styles?.filter || ''}`
              }}
              draggable={false}
            />
            {isSelected && (
              <>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded cursor-se-resize" />
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded cursor-nw-resize" />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded cursor-ne-resize" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded cursor-sw-resize" />
              </>
            )}
          </div>
        );
      
      case 'graphic':
        return (
          <div
            key={element.id}
            style={baseStyle}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
            className="group"
          >
            <div style={{
              fontSize: element.styles?.fontSize || 48,
              color: element.styles?.color || '#FFD700',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none'
            }}>
              {element.content}
            </div>
            {isSelected && (
              <>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded cursor-se-resize" />
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded cursor-nw-resize" />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded cursor-ne-resize" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded cursor-sw-resize" />
              </>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  if (show3D) {
    return (
      <div className="flex-1 bg-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">3D Preview</h3>
          <button
            onClick={() => setShow3D(false)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Eye className="h-4 w-4" />
            <span>Back to 2D Editor</span>
          </button>
        </div>
        <Model3DViewer
          elements={elements}
          mugView={mugView}
          mugColor="#FFFFFF"
          onViewChange={onMugViewChange}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-100 p-6">
      {/* Canvas Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm border">
            <span className="text-sm font-medium text-gray-700">Safety Area</span>
            <div className="w-3 h-3 border-2 border-dashed border-green-500 rounded"></div>
          </div>
          <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm border">
            <span className="text-sm font-medium text-gray-700">Bleed</span>
            <div className="w-3 h-3 border-2 border-dashed border-blue-500 rounded"></div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
            <span className="text-sm font-medium text-gray-700">{mugView === 'front' ? 'Front' : 'Wraparound'}</span>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-6xl mx-auto">
        <div className="flex justify-center">
          <div className="relative">
            {/* Design Canvas */}
            <div
              ref={canvasRef}
              className="relative bg-gray-100 border border-gray-300 rounded-lg overflow-hidden"
              style={{
                width: canvasWidth,
                height: canvasHeight,
                backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3e%3cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='%23e5e7eb' stroke-width='1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23grid)' /%3e%3c/svg%3e")`,
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={handleCanvasClick}
            >
              {/* Safety Area Guidelines */}
              <div
                className="absolute border-2 border-dashed border-green-500 bg-green-50 bg-opacity-10 pointer-events-none"
                style={{
                  left: safeArea.x,
                  top: safeArea.y,
                  width: safeArea.width,
                  height: safeArea.height
                }}
              />
              
              {/* Bleed Area Guidelines */}
              <div
                className="absolute border-2 border-dashed border-blue-500 bg-blue-50 bg-opacity-10 pointer-events-none"
                style={{
                  left: bleedArea.x,
                  top: bleedArea.y,
                  width: bleedArea.width,
                  height: bleedArea.height
                }}
              />
              
              {/* Guidelines Labels */}
              <div className="absolute top-12 left-12 text-xs text-green-600 font-medium pointer-events-none">
                Safety Area
              </div>
              <div className="absolute top-12 right-12 text-xs text-blue-600 font-medium pointer-events-none">
                Bleed
              </div>
              
              {/* Center Guidelines */}
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-300 opacity-30 pointer-events-none" />
              <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-300 opacity-30 pointer-events-none" />
              
              {/* Render Design Elements */}
              {elements
                .filter(element => element.surface === mugView)
                .sort((a, b) => a.zIndex - b.zIndex)
                .map(renderElement)}
              
              {/* Upload Your Design Placeholder */}
              {elements.filter(el => el.surface === mugView).length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center text-gray-400">
                    <div className="text-8xl mb-4 opacity-50">📁</div>
                    <div className="text-4xl font-light opacity-70">Upload Your</div>
                    <div className="text-4xl font-light opacity-70">Design</div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Canvas Dimensions */}
            <div className="mt-4 flex justify-center">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>17.2cm</span>
                <div className="w-16 h-px bg-gray-400"></div>
                <span>7cm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Controls */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-full"></div>
            <input
              type="range"
              min="50"
              max="200"
              value={zoom}
              onChange={(e) => setZoom(parseInt(e.target.value))}
              className="w-32"
            />
          </div>
          <select
            value={zoom}
            onChange={(e) => setZoom(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded text-sm bg-white"
          >
            <option value="50">50%</option>
            <option value="75">75%</option>
            <option value="100">100%</option>
            <option value="125">125%</option>
            <option value="150">150%</option>
            <option value="200">200%</option>
          </select>
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 bg-white">
            <Settings className="h-4 w-4" />
            <span>View</span>
          </button>
        </div>
        
        <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg flex items-center space-x-2">
          <span className="text-sm">❓</span>
          <span className="text-sm font-medium">Need design help?</span>
        </div>
      </div>
    </div>
  );
};

export default Canvas;