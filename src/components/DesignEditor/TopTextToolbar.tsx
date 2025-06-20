import React, { useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Minus,
  Plus,
  MoreHorizontal,
  Copy,
  Trash2,
  Lock,
  Layers,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { DesignElement } from '../../types';

interface TopTextToolbarProps {
  selectedElement: DesignElement;
  onElementUpdate: (id: string, updates: Partial<DesignElement>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const TopTextToolbar: React.FC<TopTextToolbarProps> = ({ 
  selectedElement, 
  onElementUpdate, 
  onDuplicate, 
  onDelete 
}) => {
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSpacingPanel, setShowSpacingPanel] = useState(false);
  const [showLayerPanel, setShowLayerPanel] = useState(false);

  const fontFamilies = [
    'Arimo', 'Arial', 'Times New Roman', 'Verdana', 'Georgia', 'Courier New',
    'Helvetica', 'Trebuchet MS', 'Comic Sans MS', 'Impact', 'Lucida Console'
  ];

  const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 46, 48, 54, 60, 66, 72];

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A',
    '#808080', '#C0C0C0', '#800000', '#008000', '#000080', '#808000'
  ];

  const updateStyle = (property: string, value: any) => {
    onElementUpdate(selectedElement.id, {
      styles: { ...selectedElement.styles, [property]: value }
    });
  };

  const toggleStyle = (property: string, activeValue: any, inactiveValue: any) => {
    const currentValue = selectedElement.styles?.[property] || inactiveValue;
    updateStyle(property, currentValue === activeValue ? inactiveValue : activeValue);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Text formatting tools */}
        <div className="flex items-center space-x-2">
          {/* Font Family */}
          <div className="relative">
            <button
              onClick={() => setShowFontDropdown(!showFontDropdown)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 min-w-[120px] justify-between"
            >
              <span className="text-sm font-medium">{selectedElement.styles?.fontFamily || 'Arimo'}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {showFontDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                {fontFamilies.map(font => (
                  <button
                    key={font}
                    onClick={() => {
                      updateStyle('fontFamily', font);
                      setShowFontDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Font Size Controls */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => updateStyle('fontSize', Math.max(8, (selectedElement.styles?.fontSize || 46) - 2))}
              className="p-2 hover:bg-gray-100 rounded border border-gray-300"
            >
              <Minus className="h-4 w-4" />
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowSizeDropdown(!showSizeDropdown)}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 min-w-[60px] justify-center"
              >
                <span className="text-sm font-medium">{selectedElement.styles?.fontSize || 46}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              {showSizeDropdown && (
                <div className="absolute top-full left-0 mt-1 w-20 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                  {fontSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => {
                        updateStyle('fontSize', size);
                        setShowSizeDropdown(false);
                      }}
                      className="w-full text-center px-2 py-1 hover:bg-gray-100 text-sm"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => updateStyle('fontSize', Math.min(72, (selectedElement.styles?.fontSize || 46) + 2))}
              className="p-2 hover:bg-gray-100 rounded border border-gray-300"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Color Picker */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-10 h-10 rounded border-2 border-gray-300 hover:border-gray-400"
              style={{ backgroundColor: selectedElement.styles?.color || '#000000' }}
            />
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-20">
                <div className="grid grid-cols-6 gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        updateStyle('color', color);
                        setShowColorPicker(false);
                      }}
                      className="w-8 h-8 rounded border border-gray-300 hover:border-gray-500"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Text Formatting */}
          <div className="flex items-center space-x-1 border-l border-gray-300 pl-3 ml-3">
            <button
              onClick={() => toggleStyle('fontWeight', 'bold', 'normal')}
              className={`p-2 rounded hover:bg-gray-100 ${
                selectedElement.styles?.fontWeight === 'bold' ? 'bg-blue-100 text-blue-700' : ''
              }`}
            >
              <Bold className="h-4 w-4" />
            </button>

            <button
              onClick={() => toggleStyle('fontStyle', 'italic', 'normal')}
              className={`p-2 rounded hover:bg-gray-100 ${
                selectedElement.styles?.fontStyle === 'italic' ? 'bg-blue-100 text-blue-700' : ''
              }`}
            >
              <Italic className="h-4 w-4" />
            </button>

            <button
              onClick={() => toggleStyle('textDecoration', 'underline', 'none')}
              className={`p-2 rounded hover:bg-gray-100 ${
                selectedElement.styles?.textDecoration === 'underline' ? 'bg-blue-100 text-blue-700' : ''
              }`}
            >
              <Underline className="h-4 w-4" />
            </button>
          </div>

          {/* Text Alignment */}
          <div className="flex items-center space-x-1 border-l border-gray-300 pl-3 ml-3">
            <button
              onClick={() => updateStyle('textAlign', 'left')}
              className={`p-2 rounded hover:bg-gray-100 ${
                (selectedElement.styles?.textAlign || 'center') === 'left' ? 'bg-blue-100 text-blue-700' : ''
              }`}
            >
              <AlignLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => updateStyle('textAlign', 'center')}
              className={`p-2 rounded hover:bg-gray-100 ${
                (selectedElement.styles?.textAlign || 'center') === 'center' ? 'bg-blue-100 text-blue-700' : ''
              }`}
            >
              <AlignCenter className="h-4 w-4" />
            </button>
            <button
              onClick={() => updateStyle('textAlign', 'right')}
              className={`p-2 rounded hover:bg-gray-100 ${
                (selectedElement.styles?.textAlign || 'center') === 'right' ? 'bg-blue-100 text-blue-700' : ''
              }`}
            >
              <AlignRight className="h-4 w-4" />
            </button>
          </div>

          {/* Lists */}
          <div className="flex items-center space-x-1 border-l border-gray-300 pl-3 ml-3">
            <button
              onClick={() => updateStyle('listType', 'bulleted')}
              className={`p-2 rounded hover:bg-gray-100 ${
                selectedElement.styles?.listType === 'bulleted' ? 'bg-blue-100 text-blue-700' : ''
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => updateStyle('listType', 'numbered')}
              className={`p-2 rounded hover:bg-gray-100 ${
                selectedElement.styles?.listType === 'numbered' ? 'bg-blue-100 text-blue-700' : ''
              }`}
            >
              <ListOrdered className="h-4 w-4" />
            </button>
          </div>

          {/* Spacing Controls */}
          <div className="relative border-l border-gray-300 pl-3 ml-3">
            <button
              onClick={() => setShowSpacingPanel(!showSpacingPanel)}
              className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded"
            >
              <span className="text-sm font-medium">Spacing</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {showSpacingPanel && (
              <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-20">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Line spacing</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={selectedElement.styles?.lineHeight || 1.4}
                        onChange={(e) => updateStyle('lineHeight', parseFloat(e.target.value))}
                        className="flex-1"
                      />
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <RotateCcw className="h-4 w-4" />
                      </button>
                      <div className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center">
                        {selectedElement.styles?.lineHeight || 1.4}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Letter spacing</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="range"
                        min="-2"
                        max="10"
                        step="0.1"
                        value={selectedElement.styles?.letterSpacing || 0}
                        onChange={(e) => updateStyle('letterSpacing', parseFloat(e.target.value))}
                        className="flex-1"
                      />
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <RotateCcw className="h-4 w-4" />
                      </button>
                      <div className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center">
                        {selectedElement.styles?.letterSpacing || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Format Menu */}
          <button className="px-3 py-2 hover:bg-gray-100 rounded">
            <span className="text-sm font-medium">Format</span>
          </button>

          {/* More Options */}
          <button className="p-2 hover:bg-gray-100 rounded">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Right side - Element actions */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              onClick={() => setShowLayerPanel(!showLayerPanel)}
              className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded"
            >
              <Layers className="h-4 w-4" />
              <ChevronDown className="h-4 w-4" />
            </button>
            {showLayerPanel && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-20">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2">
                  <ChevronUp className="h-4 w-4" />
                  <span className="text-sm">Bring to front</span>
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2">
                  <ChevronUp className="h-4 w-4" />
                  <span className="text-sm">Bring forward</span>
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2">
                  <ChevronDown className="h-4 w-4" />
                  <span className="text-sm font-medium">Send backward</span>
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2">
                  <ChevronDown className="h-4 w-4" />
                  <span className="text-sm">Send to back</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onDuplicate}
            className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded"
            title="Duplicate"
          >
            <Copy className="h-4 w-4" />
            <span className="text-sm">Duplicate</span>
          </button>

          <button
            onClick={onDelete}
            className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded text-red-600"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
            <span className="text-sm">Delete</span>
          </button>

          <button className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded">
            <Lock className="h-4 w-4" />
            <span className="text-sm">Lock</span>
          </button>

          <button className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded">
            <Layers className="h-4 w-4" />
            <span className="text-sm">Copy style</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopTextToolbar;