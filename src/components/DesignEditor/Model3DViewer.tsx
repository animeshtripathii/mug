import React, { useRef, useEffect, useState } from 'react';
import { RotateCcw, ZoomIn, ZoomOut, Maximize, Eye, RotateCw } from 'lucide-react';
import { DesignElement } from '../../types';

interface Model3DViewerProps {
  elements: DesignElement[];
  mugView: 'front' | 'wrap';
  mugColor: string;
  onViewChange?: (view: 'front' | 'wrap') => void;
}

// THIS IS WHERE YOU CAN CHANGE THE 3D MODEL
// Replace this component with your actual 3D model implementation
// The UV mapping coordinates from elements[].mapping can be directly applied to your 3D model
const Model3DViewer: React.FC<Model3DViewerProps> = ({ 
  elements, 
  mugView, 
  mugColor,
  onViewChange 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  // 🔥 IMPORTANT: This is where you integrate your 3D model
  // Replace this entire useEffect with your 3D rendering library (Three.js, Babylon.js, etc.)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw mock 3D mug (replace this with your actual 3D model)
    drawMock3DMug(ctx, canvas.width, canvas.height, rotation, zoom, mugColor);

    // Apply design elements using UV mapping
    elements.forEach(element => {
      if (element.mapping) {
        // Convert UV coordinates to canvas coordinates
        // This is the key part - your 3D model should use these same UV coordinates
        const x = element.mapping.u * canvas.width;
        const y = element.mapping.v * canvas.height;
        
        // Apply the element to the 3D surface
        applyElementTo3D(ctx, element, x, y, element.mapping.scale);
      }
    });
  }, [elements, rotation, zoom, mugColor]);

  // Mock 3D mug drawing (replace with your 3D model)
  const drawMock3DMug = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    rotation: { x: number; y: number }, 
    zoom: number,
    color: string
  ) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const mugWidth = 200 * zoom;
    const mugHeight = 250 * zoom;

    // Apply rotation transform
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation.y * Math.PI / 180);
    ctx.translate(-centerX, -centerY);

    // Draw mug body (cylinder approximation)
    const gradient = ctx.createLinearGradient(centerX - mugWidth/2, 0, centerX + mugWidth/2, 0);
    gradient.addColorStop(0, darkenColor(color, 0.3));
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, darkenColor(color, 0.2));

    ctx.fillStyle = gradient;
    ctx.fillRect(centerX - mugWidth/2, centerY - mugHeight/2, mugWidth, mugHeight);

    // Draw mug handle
    ctx.strokeStyle = darkenColor(color, 0.4);
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(centerX + mugWidth/2 + 20, centerY, 40, -Math.PI/3, Math.PI/3);
    ctx.stroke();

    // Draw mug rim
    ctx.fillStyle = darkenColor(color, 0.1);
    ctx.fillRect(centerX - mugWidth/2 - 5, centerY - mugHeight/2 - 10, mugWidth + 10, 20);

    ctx.restore();
  };

  // Apply design element to 3D surface using UV mapping
  const applyElementTo3D = (
    ctx: CanvasRenderingContext2D,
    element: DesignElement,
    x: number,
    y: number,
    scale: number
  ) => {
    ctx.save();
    
    // Apply element transformations
    ctx.translate(x, y);
    ctx.rotate(element.rotation * Math.PI / 180);
    ctx.scale(scale, scale);

    switch (element.type) {
      case 'text':
        ctx.fillStyle = element.styles?.color || '#000000';
        ctx.font = `${element.styles?.fontSize || 16}px ${element.styles?.fontFamily || 'Arial'}`;
        ctx.textAlign = (element.styles?.textAlign as CanvasTextAlign) || 'left';
        ctx.fillText(element.content, 0, 0);
        break;
      
      case 'image':
        // For images, you'd load and draw the image
        // This is simplified - in real implementation, you'd handle image loading
        ctx.fillStyle = '#cccccc';
        ctx.fillRect(-element.width/2, -element.height/2, element.width, element.height);
        ctx.fillStyle = '#666666';
        ctx.fillText('IMG', -10, 5);
        break;
      
      case 'graphic':
        ctx.font = `${element.styles?.fontSize || 24}px Arial`;
        ctx.fillStyle = element.styles?.color || '#000000';
        ctx.fillText(element.content, -10, 10);
        break;
    }

    ctx.restore();
  };

  // Utility function to darken colors
  const darkenColor = (color: string, factor: number): string => {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) * (1 - factor));
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) * (1 - factor));
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) * (1 - factor));
    return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
  };

  // Mouse interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;

    setRotation(prev => ({
      x: prev.x + deltaY * 0.5,
      y: prev.y + deltaX * 0.5
    }));

    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">3D Preview</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            className="p-2 border border-gray-300 rounded hover:bg-gray-100"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            className="p-2 border border-gray-300 rounded hover:bg-gray-100"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={resetView}
            className="p-2 border border-gray-300 rounded hover:bg-gray-100"
            title="Reset View"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="w-full h-80 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        
        {/* Interaction Instructions */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm">
          <div className="flex items-center space-x-2">
            <RotateCw className="h-4 w-4" />
            <span>Click and drag to rotate</span>
          </div>
        </div>

        {/* View Toggle */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2">
          <div className="flex space-x-1">
            <button
              onClick={() => onViewChange?.('front')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                mugView === 'front' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Front
            </button>
            <button
              onClick={() => onViewChange?.('wrap')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                mugView === 'wrap' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Wrap
            </button>
          </div>
        </div>
      </div>

      {/* 3D Model Information */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">3D Model Integration Guide</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• Replace the <code>Model3DViewer</code> component with your 3D library (Three.js, Babylon.js, etc.)</p>
          <p>• Use the <code>element.mapping</code> UV coordinates to position elements on your 3D model</p>
          <p>• The UV coordinates are normalized (0-1) and ready for 3D texture mapping</p>
          <p>• All design elements maintain their properties for seamless 3D integration</p>
        </div>
      </div>
    </div>
  );
};

export default Model3DViewer;