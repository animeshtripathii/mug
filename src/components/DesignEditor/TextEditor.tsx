import React, { useState, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link,
  Palette,
  Type,
  Minus,
  Plus,
  MoreHorizontal
} from 'lucide-react';
import { DesignElement } from '../../types';

interface TextEditorProps {
  selectedElement: DesignElement | null;
  onElementUpdate: (id: string, updates: Partial<DesignElement>) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ selectedElement, onElementUpdate }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);

  const fontFamilies = [
    'Arimo', 'Arial', 'Times New Roman', 'Verdana', 'Georgia', 'Courier New',
    'Helvetica', 'Trebuchet MS', 'Comic Sans MS', 'Impact', 'Lucida Console'
  ];

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A',
    '#808080', '#C0C0C0', '#800000', '#008000', '#000080', '#808000'
  ];

  if (!selectedElement || selectedElement.type !== 'text') {
    return null;
  }

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
    <div className="space-y-4">
      {/* Font and Size Controls */}
      <div className="flex items-center space-x-2 p-2 bg-white border border-gray-200 rounded-lg">
        {/* Font Family */}
        <div className="relative">
          <button
            onClick={() => setShowFontDropdown(!showFontDropdown)}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 min-w-[100px]"
          >
            <span className="text-sm">{selectedElement.styles?.fontFamily || 'Arimo'}</span>
          </button>
          {showFontDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
              {fontFamilies.map(font => (
                <button
                  key={font}
                  onClick={() => {
                    updateStyle('fontFamily', font);
                    setShowFontDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                  style={{ fontFamily: font }}
                >
                  {font}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Font Size */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => updateStyle('fontSize', Math.max(8, (selectedElement.styles?.fontSize || 24) - 2))}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            value={selectedElement.styles?.fontSize || 24}
            onChange={(e) => updateStyle('fontSize', parseInt(e.target.value))}
            className="w-12 text-center text-sm border border-gray-300 rounded"
            min="8"
            max="72"
          />
          <button
            onClick={() => updateStyle('fontSize', Math.min(72, (selectedElement.styles?.fontSize || 24) + 2))}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Color */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="w-8 h-8 rounded border border-gray-300"
            style={{ backgroundColor: selectedElement.styles?.color || '#000000' }}
          />
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10">
              <div className="grid grid-cols-6 gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => {
                      updateStyle('color', color);
                      setShowColorPicker(false);
                    }}
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Text Formatting */}
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

        {/* Text Alignment */}
        <div className="flex border-l border-gray-300 pl-2 ml-2">
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
        <div className="flex border-l border-gray-300 pl-2 ml-2">
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

        {/* Format Menu */}
        <button className="p-2 rounded hover:bg-gray-100">
          <span className="text-sm font-medium">Format</span>
        </button>

        {/* More Options */}
        <button className="p-2 rounded hover:bg-gray-100">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TextEditor;