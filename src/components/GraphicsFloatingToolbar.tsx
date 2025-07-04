import React, { useRef, useEffect, useState } from 'react';
import { 
  Circle,
  Square,
  Triangle,
  Layers, 
  AlignCenter,
  AlignVerticalJustifyCenter,
  AlignHorizontalJustifyCenter,
  Copy,
  Trash2,
  RotateCw,
  Lock,
  MoreHorizontal,
  ChevronDown,
  Move3D,
  FlipVertical,
  FlipHorizontal,
  Eye,
  Palette,
  X,
  Minus,
  Plus
} from 'lucide-react';
import { useGraphicsContext } from '../context/GraphicsContext';
import FloatingPanel, { SliderControl, ButtonGroupControl, DropdownControl } from './FloatingPanel';

interface GraphicsFloatingToolbarProps {
  isVisible: boolean;
  selectedGraphicId: string | null;
}

const GraphicsFloatingToolbar: React.FC<GraphicsFloatingToolbarProps> = ({ 
  isVisible, 
  selectedGraphicId
}) => {
  const { graphicElements, updateGraphicElement, deleteGraphicElement, duplicateGraphicElement } = useGraphicsContext();
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  
  // Graphic adjustment states
  const [fillColor, setFillColor] = useState('#000000');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [strokeStyle, setStrokeStyle] = useState('solid');
  const [opacity, setOpacity] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [layerOrder, setLayerOrder] = useState('front');
  
  // Refs for panel positioning
  const opacityRef = useRef<HTMLButtonElement>(null);
  const layerRef = useRef<HTMLButtonElement>(null);
  const alignRef = useRef<HTMLButtonElement>(null);
  const flipRef = useRef<HTMLButtonElement>(null);
  const rotationRef = useRef<HTMLButtonElement>(null);
  const moreRef = useRef<HTMLButtonElement>(null);
  const strokeRef = useRef<HTMLButtonElement>(null);
  const fillColorRef = useRef<HTMLButtonElement>(null);
  const borderColorRef = useRef<HTMLButtonElement>(null);
  const borderWidthRef = useRef<HTMLButtonElement>(null);

  const selectedElement = graphicElements.find(el => el.id === selectedGraphicId);

  // Initialize values from selected element
  useEffect(() => {
    if (selectedElement) {
      setFillColor(selectedElement.fillColor || '#000000');
      setStrokeColor(selectedElement.strokeColor || '#000000');
      setStrokeWidth(selectedElement.strokeWidth || 0);
      setStrokeStyle(selectedElement.strokeStyle || 'solid');
      setOpacity(selectedElement.opacity || 100);
      setRotation(selectedElement.rotation || 0);
    }
  }, [selectedElement]);

  if (!isVisible || !selectedElement) {
    return null;
  }

  const openPanel = (panelName: string) => {
    setActivePanel(activePanel === panelName ? null : panelName);
    setShowMoreMenu(false);
  };

  const closePanel = () => {
    setActivePanel(null);
  };

  const handleFillColorChange = (color: string) => {
    setFillColor(color);
    if (selectedElement) {
      updateGraphicElement(selectedElement.id, { fillColor: color });
    }
  };

  const handleStrokeColorChange = (color: string) => {
    setStrokeColor(color);
    if (selectedElement) {
      updateGraphicElement(selectedElement.id, { strokeColor: color });
    }
  };

  const handleStrokeWidthChange = (width: number) => {
    setStrokeWidth(width);
    if (selectedElement) {
      updateGraphicElement(selectedElement.id, { strokeWidth: width });
    }
  };

  const handleStrokeStyleChange = (style: string) => {
    setStrokeStyle(style);
    if (selectedElement) {
      updateGraphicElement(selectedElement.id, { strokeStyle: style as 'solid' | 'dashed' | 'dotted' });
    }
  };

  const handleOpacityChange = (value: number) => {
    setOpacity(value);
    if (selectedElement) {
      updateGraphicElement(selectedElement.id, { opacity: value });
    }
  };

  const handleRotationChange = (value: number) => {
    setRotation(value);
    if (selectedElement) {
      updateGraphicElement(selectedElement.id, { rotation: value });
    }
  };

  const adjustStrokeWidth = (increment: number) => {
    const newWidth = Math.max(0, Math.min(20, strokeWidth + increment));
    handleStrokeWidthChange(newWidth);
  };

  const handleDuplicate = () => {
    if (selectedElement) {
      duplicateGraphicElement(selectedElement.id);
    }
    setShowMoreMenu(false);
  };

  const handleDelete = () => {
    if (selectedElement) {
      deleteGraphicElement(selectedElement.id);
    }
    setShowMoreMenu(false);
  };

  const handleLock = () => {
    if (selectedElement) {
      updateGraphicElement(selectedElement.id, { locked: !selectedElement.locked });
    }
    setShowMoreMenu(false);
  };

  const handleCenterAlign = () => {
    if (selectedElement) {
      const canvasWidth = 688;
      const canvasHeight = 280;
      const elementWidth = selectedElement.width || 100;
      const elementHeight = selectedElement.height || 100;
      
      const centerX = (canvasWidth - elementWidth) / 2;
      const centerY = (canvasHeight - elementHeight) / 2;
      
      updateGraphicElement(selectedElement.id, { x: centerX, y: centerY });
    }
  };

  const handleMiddleAlign = () => {
    if (selectedElement) {
      const canvasHeight = 280;
      const elementHeight = selectedElement.height || 100;
      const centerY = (canvasHeight - elementHeight) / 2;
      
      updateGraphicElement(selectedElement.id, { y: centerY });
    }
  };

  const handleFlipHorizontal = () => {
    if (selectedElement) {
      const currentRotation = selectedElement.rotation || 0;
      updateGraphicElement(selectedElement.id, { rotation: currentRotation + 180 });
    }
  };

  const handleFlipVertical = () => {
    if (selectedElement) {
      // Apply vertical flip using CSS transform
      const currentTransform = selectedElement.transform || '';
      const newTransform = currentTransform.includes('scaleY(-1)') 
        ? currentTransform.replace('scaleY(-1)', '') 
        : `${currentTransform} scaleY(-1)`;
      updateGraphicElement(selectedElement.id, { transform: newTransform.trim() });
    }
  };

  const strokeStyles = [
    { value: 'solid', label: 'Solid' },
    { value: 'dashed', label: 'Dashed' },
    { value: 'dotted', label: 'Dotted' }
  ];

  const presetColors = [
    '#FFFFFF', '#87CEEB', '#90EE90', '#F0E68C', '#DEB887', '#F5A9A9',
    '#808080', '#4682B4', '#32CD32', '#FFD700', '#FF8C00', '#FF6347'
  ];

  const recentColors = ['#FF0000', '#DC143C', '#000000'];

  const ColorPickerPanel = ({ title, currentColor, onColorChange }: { 
    title: string; 
    currentColor: string; 
    onColorChange: (color: string) => void; 
  }) => (
    <div className="w-80 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <button
          onClick={closePanel}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Color Gradient Picker */}
      <div className="mb-6">
        <div 
          className="w-full h-32 rounded-lg mb-4 relative cursor-crosshair"
          style={{
            background: `linear-gradient(to bottom, 
              rgba(255,255,255,1) 0%, 
              rgba(255,255,255,0) 50%, 
              rgba(0,0,0,0) 50%, 
              rgba(0,0,0,1) 100%),
              linear-gradient(to right, 
              rgba(255,0,0,1) 0%, 
              rgba(255,255,0,1) 17%, 
              rgba(0,255,0,1) 33%, 
              rgba(0,255,255,1) 50%, 
              rgba(0,0,255,1) 67%, 
              rgba(255,0,255,1) 83%, 
              rgba(255,0,0,1) 100%)`
          }}
        >
          {/* Color picker circle indicator */}
          <div 
            className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg pointer-events-none"
            style={{ 
              left: '20px', 
              top: '20px',
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>

        {/* Hue slider */}
        <div className="w-full h-4 rounded-lg mb-4 relative cursor-pointer"
          style={{
            background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
          }}
        >
          <div 
            className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg pointer-events-none"
            style={{ 
              left: '0%', 
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>

        {/* Color input */}
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={currentColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="#000000"
          />
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Palette className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mb-4 border-b border-gray-200">
        <button className="px-4 py-2 font-medium text-sm text-blue-600 border-b-2 border-blue-600">
          Swatches
        </button>
        <button className="px-4 py-2 font-medium text-sm text-gray-600 hover:text-gray-800 ml-6">
          CMYK
        </button>
      </div>

      {/* Recent colors */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Recent colors</h4>
        <div className="flex space-x-2">
          {recentColors.map((color, index) => (
            <button
              key={index}
              onClick={() => onColorChange(color)}
              className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Preset colors */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Pre-set colors</h4>
        <div className="grid grid-cols-6 gap-2">
          {presetColors.map((color, index) => (
            <button
              key={index}
              onClick={() => onColorChange(color)}
              className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div 
        className="graphics-toolbar fixed bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 px-4 py-3"
        style={{
          top: '120px',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'auto'
        }}
      >
        {/* Main Toolbar */}
        <div className="flex items-center space-x-2">
          {/* Fill Color */}
          <div className="relative">
            <button
              ref={fillColorRef}
              onClick={() => openPanel('fillColor')}
              className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
              style={{ backgroundColor: fillColor }}
              title="Fill Color"
            />
          </div>

          {/* Border Color */}
          <div className="relative">
            <button
              ref={borderColorRef}
              onClick={() => openPanel('borderColor')}
              className="w-10 h-10 rounded-full border-4 cursor-pointer hover:opacity-80 transition-opacity"
              style={{ 
                backgroundColor: 'transparent',
                borderColor: strokeColor
              }}
              title="Border Color"
            />
          </div>

          {/* Border Width Control */}
          <div className="relative">
            <button
              ref={borderWidthRef}
              onClick={() => openPanel('borderWidth')}
              className={`flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors ${
                activePanel === 'borderWidth' ? 'bg-blue-50 text-blue-600 border-blue-300' : ''
              }`}
              title="Border Width"
            >
              <Minus className="w-3 h-3" />
              <span className="text-sm font-medium min-w-[20px]">{strokeWidth}</span>
              <Plus className="w-3 h-3" />
            </button>
            
            <FloatingPanel
              isOpen={activePanel === 'borderWidth'}
              onClose={closePanel}
              title="Border Width"
              anchorRef={borderWidthRef}
            >
              <div className="space-y-4">
                <SliderControl
                  label="Width"
                  value={strokeWidth}
                  min={0}
                  max={20}
                  step={1}
                  unit="px"
                  onChange={handleStrokeWidthChange}
                  onReset={() => handleStrokeWidthChange(0)}
                  defaultValue={0}
                />
                
                <DropdownControl
                  label="Style"
                  options={strokeStyles}
                  value={strokeStyle}
                  onChange={handleStrokeStyleChange}
                />
              </div>
            </FloatingPanel>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300"></div>

          {/* Opacity Control */}
          <button
            ref={opacityRef}
            onClick={() => openPanel('opacity')}
            className={`p-2 rounded-md transition-colors ${
              activePanel === 'opacity' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
            }`}
            title="Opacity"
          >
            <Eye className="w-5 h-5" />
          </button>
          
          <FloatingPanel
            isOpen={activePanel === 'opacity'}
            onClose={closePanel}
            title="Opacity"
            anchorRef={opacityRef}
          >
            <SliderControl
              label="Transparency"
              value={opacity}
              min={0}
              max={100}
              step={1}
              unit="%"
              onChange={handleOpacityChange}
              onReset={() => handleOpacityChange(100)}
              defaultValue={100}
            />
          </FloatingPanel>

          {/* Align Tools */}
          <button
            ref={alignRef}
            onClick={() => openPanel('align')}
            className={`p-2 rounded-md transition-colors ${
              activePanel === 'align' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
            }`}
            title="Align"
          >
            <AlignCenter className="w-5 h-5" />
          </button>
          
          <FloatingPanel
            isOpen={activePanel === 'align'}
            onClose={closePanel}
            title="Alignment"
            anchorRef={alignRef}
          >
            <ButtonGroupControl
              label="Align to Canvas"
              options={[
                { value: 'center', label: 'Center', icon: AlignHorizontalJustifyCenter },
                { value: 'middle', label: 'Middle', icon: AlignVerticalJustifyCenter }
              ]}
              value="center"
              onChange={(value) => {
                if (value === 'center') {
                  handleCenterAlign();
                } else if (value === 'middle') {
                  handleMiddleAlign();
                }
              }}
            />
          </FloatingPanel>

          {/* Rotation Control */}
          <button
            ref={rotationRef}
            onClick={() => openPanel('rotation')}
            className={`p-2 rounded-md transition-colors ${
              activePanel === 'rotation' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
            }`}
            title="Rotation"
          >
            <RotateCw className="w-5 h-5" />
          </button>
          
          <FloatingPanel
            isOpen={activePanel === 'rotation'}
            onClose={closePanel}
            title="Rotation"
            anchorRef={rotationRef}
          >
            <SliderControl
              label="Angle"
              value={rotation}
              min={0}
              max={360}
              step={1}
              unit="°"
              onChange={handleRotationChange}
              onReset={() => handleRotationChange(0)}
              defaultValue={0}
            />
          </FloatingPanel>

          {/* Flip Control */}
          <button
            ref={flipRef}
            onClick={() => openPanel('flip')}
            className={`p-2 rounded-md transition-colors ${
              activePanel === 'flip' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
            }`}
            title="Flip"
          >
            <FlipHorizontal className="w-5 h-5" />
          </button>
          
          <FloatingPanel
            isOpen={activePanel === 'flip'}
            onClose={closePanel}
            title="Flip"
            anchorRef={flipRef}
          >
            <ButtonGroupControl
              label="Direction"
              options={[
                { value: 'horizontal', label: 'Horizontally', icon: FlipHorizontal },
                { value: 'vertical', label: 'Vertically', icon: FlipVertical }
              ]}
              value="horizontal"
              onChange={(value) => {
                if (value === 'horizontal') {
                  handleFlipHorizontal();
                } else {
                  handleFlipVertical();
                }
              }}
            />
          </FloatingPanel>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300"></div>

          {/* Layer Control */}
          <button
            ref={layerRef}
            onClick={() => openPanel('layer')}
            className={`p-2 rounded-md transition-colors ${
              activePanel === 'layer' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
            }`}
            title="Layer Order"
          >
            <Layers className="w-5 h-5" />
          </button>
          
          <FloatingPanel
            isOpen={activePanel === 'layer'}
            onClose={closePanel}
            title="Layer Order"
            anchorRef={layerRef}
          >
            <ButtonGroupControl
              label="Position"
              options={[
                { value: 'front', label: 'Front' },
                { value: 'back', label: 'Back' }
              ]}
              value={layerOrder}
              onChange={setLayerOrder}
            />
          </FloatingPanel>

          {/* Duplicate */}
          <button
            onClick={handleDuplicate}
            className="p-2 hover:bg-gray-50 rounded-md transition-colors"
            title="Duplicate"
          >
            <Copy className="w-5 h-5" />
          </button>

          {/* More Options */}
          <div className="relative">
            <button 
              ref={moreRef}
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className={`p-2 rounded-md transition-colors ${
                showMoreMenu ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
              title="More Options"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            
            {showMoreMenu && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 min-w-[140px]">
                <button 
                  onClick={handleDuplicate}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>Duplicate</span>
                </button>
                
                <button 
                  onClick={handleDelete}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
                
                <button 
                  onClick={handleLock}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  <span>{selectedElement?.locked ? 'Unlock' : 'Lock'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Color Picker Panels - positioned in sidebar area like graphics panel */}
      {activePanel === 'fillColor' && (
        <div 
          className="fixed bg-white rounded-xl shadow-2xl border border-gray-200 z-40"
          style={{
            top: '80px',
            left: '80px',
            width: '320px'
          }}
        >
          <ColorPickerPanel
            title="Shape fill color"
            currentColor={fillColor}
            onColorChange={handleFillColorChange}
          />
        </div>
      )}

      {activePanel === 'borderColor' && (
        <div 
          className="fixed bg-white rounded-xl shadow-2xl border border-gray-200 z-40"
          style={{
            top: '80px',
            left: '80px',
            width: '320px'
          }}
        >
          <ColorPickerPanel
            title="Shape border color"
            currentColor={strokeColor}
            onColorChange={handleStrokeColorChange}
          />
        </div>
      )}

      {/* Click outside to close more menu */}
      {showMoreMenu && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => setShowMoreMenu(false)}
        />
      )}

      {/* Click outside to close color panels */}
      {(activePanel === 'fillColor' || activePanel === 'borderColor') && (
        <div 
          className="fixed inset-0 z-30"
          onClick={closePanel}
        />
      )}
    </>
  );
};

export default GraphicsFloatingToolbar;