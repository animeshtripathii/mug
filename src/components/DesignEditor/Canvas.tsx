import React, { useRef, useState, useCallback } from 'react';
import { DesignElement } from '../../types';
import { ZoomIn, ZoomOut, Eye, RotateCcw, Maximize, Box } from 'lucide-react';
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

  // Canvas dimensions based on mug specifications
  const canvasWidth = mugView === 'front' ? 300 : 400;
  const canvasHeight = 200;
  
  // Design area with safety margins (for 3D mapping compatibility)
  const safeArea = {
    x: 20,
    y: 20,
    width: canvasWidth - 40,
    height: canvasHeight - 40
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

    // Constrain to safe area
    const constrainedX = Math.max(safeArea.x, Math.min(newX, safeArea.x + safeArea.width - 50));
    const constrainedY = Math.max(safeArea.y, Math.min(newY, safeArea.y + safeArea.height - 20));

    // Update 3D mapping coordinates for future compatibility
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
  }, [isDragging, selectedElement, dragStart, elements, onElementUpdate, safeArea, canvasWidth, canvasHeight]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

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
      border: isSelected ? '2px dashed #3b82f6' : 'none',
      ...element.styles
    };

    switch (element.type) {
      case 'text':
        return (
          <div
            key={element.id}
            style={baseStyle}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
          >
            <div style={{
              fontSize: element.styles?.fontSize || 16,
              fontFamily: element.styles?.fontFamily || 'Arial',
              color: element.styles?.color || '#000000',
              backgroundColor: element.styles?.backgroundColor || 'transparent',
              fontWeight: element.styles?.fontWeight || 'normal',
              fontStyle: element.styles?.fontStyle || 'normal',
              textDecoration: element.styles?.textDecoration || 'none',
              textAlign: element.styles?.textAlign || 'left',
              lineHeight: element.styles?.lineHeight || 1.5,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              userSelect: 'none',
              padding: '4px',
              borderRadius: '4px'
            }}>
              {element.content}
            </div>
            {isSelected && (
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded cursor-se-resize" />
            )}
          </div>
        );
      
      case 'image':
        return (
          <div
            key={element.id}
            style={baseStyle}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
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
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded cursor-se-resize" />
            )}
          </div>
        );
      
      case 'graphic':
        return (
          <div
            key={element.id}
            style={baseStyle}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
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
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded cursor-se-resize" />
            )}
          </div>
        );
      
      case 'qr':
        return (
          <div
            key={element.id}
            style={baseStyle}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
          >
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#FFFFFF',
              border: '1px solid #000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: '#666666',
              userSelect: 'none'
            }}>
              QR Code
            </div>
            {isSelected && (
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded cursor-se-resize" />
            )}
          </div>
        );
      
      case 'table':
        const tableData = JSON.parse(element.content);
        return (
          <div
            key={element.id}
            style={baseStyle}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
          >
            <table style={{
              width: '100%',
              height: '100%',
              fontSize: '10px',
              borderCollapse: 'collapse',
              userSelect: 'none'
            }}>
              <thead>
                <tr>
                  {tableData.headers.map((header: string, index: number) => (
                    <th key={index} style={{
                      border: '1px solid #000',
                      padding: '2px',
                      backgroundColor: '#f0f0f0'
                    }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.rows.map((row: string[], rowIndex: number) => (
                  <tr key={rowIndex}>
                    {row.map((cell: string, cellIndex: number) => (
                      <td key={cellIndex} style={{
                        border: '1px solid #000',
                        padding: '2px'
                      }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {isSelected && (
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded cursor-se-resize" />
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm">
            <span className="text-sm font-medium text-gray-700">View:</span>
            <button
              onClick={() => onMugViewChange('front')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                mugView === 'front' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Front
            </button>
            <button
              onClick={() => onMugViewChange('wrap')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                mugView === 'wrap' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Wraparound
            </button>
          </div>
          
          <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 25))}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-center">
              {zoom}%
            </span>
            <button
              onClick={() => setZoom(Math.min(200, zoom + 25))}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShow3D(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <Box className="h-4 w-4" />
            <span>3D Preview</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Maximize className="h-4 w-4" />
            <span>Full View</span>
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
        <div className="flex justify-center">
          <div className="relative">
            {/* Mug Template */}
            <div className="mb-4 text-center">
              <h3 className="text-lg font-semibold text-gray-800">
                {mugView === 'front' ? 'Front Design Area' : 'Wraparound Design Area'}
              </h3>
              <p className="text-sm text-gray-600">
                Safe print area: {safeArea.width/10}cm × {safeArea.height/10}cm
              </p>
            </div>
            
            {/* Design Canvas */}
            <div
              ref={canvasRef}
              className="relative bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
              style={{
                width: canvasWidth * (zoom / 100),
                height: canvasHeight * (zoom / 100),
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top left'
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Safety Guidelines */}
              <div
                className="absolute border border-blue-300 bg-blue-50 bg-opacity-20"
                style={{
                  left: safeArea.x,
                  top: safeArea.y,
                  width: safeArea.width,
                  height: safeArea.height
                }}
              />
              
              {/* Guidelines Text */}
              <div className="absolute top-2 left-2 text-xs text-gray-500">
                <div>Safe Print Area</div>
                <div className="text-xs text-blue-600">Keep important content here</div>
              </div>
              
              {/* Render Design Elements */}
              {elements
                .filter(element => element.surface === mugView)
                .sort((a, b) => a.zIndex - b.zIndex)
                .map(renderElement)}
              
              {/* Center Guidelines */}
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-300 opacity-50" />
              <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-300 opacity-50" />
            </div>
            
            {/* Mug Outline Preview */}
            <div className="mt-4 flex justify-center">
              <div className="w-64 h-32 bg-gradient-to-b from-gray-200 to-gray-300 rounded-lg flex items-center justify-center shadow-lg">
                <div className="text-gray-600 text-sm font-medium">
                  Mug Preview - {mugView === 'front' ? 'Front View' : '360° Wrap'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;