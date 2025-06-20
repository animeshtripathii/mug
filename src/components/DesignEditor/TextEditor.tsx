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
  Superscript,
  Subscript,
  Code,
  Quote
} from 'lucide-react';
import { DesignElement } from '../../types';

interface TextEditorProps {
  selectedElement: DesignElement | null;
  onElementUpdate: (id: string, updates: Partial<DesignElement>) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ selectedElement, onElementUpdate }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkNewWindow, setLinkNewWindow] = useState(true);

  const fontFamilies = [
    'Arial', 'Times New Roman', 'Verdana', 'Georgia', 'Courier New',
    'Helvetica', 'Trebuchet MS', 'Comic Sans MS', 'Impact', 'Lucida Console'
  ];

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A',
    '#808080', '#C0C0C0', '#800000', '#008000', '#000080', '#808000'
  ];

  useEffect(() => {
    if (selectedElement?.link) {
      setLinkUrl(selectedElement.link.url);
      setLinkNewWindow(selectedElement.link.openInNewWindow);
    }
  }, [selectedElement]);

  if (!selectedElement || selectedElement.type !== 'text') {
    return null;
  }

  const updateStyle = (property: string, value: any) => {
    onElementUpdate(selectedElement.id, {
      styles: { ...selectedElement.styles, [property]: value }
    });
  };

  const updateContent = (content: string) => {
    onElementUpdate(selectedElement.id, { content });
  };

  const toggleStyle = (property: string, activeValue: any, inactiveValue: any) => {
    const currentValue = selectedElement.styles?.[property] || inactiveValue;
    updateStyle(property, currentValue === activeValue ? inactiveValue : activeValue);
  };

  const handleLinkSave = () => {
    onElementUpdate(selectedElement.id, {
      link: linkUrl ? { url: linkUrl, openInNewWindow: linkNewWindow } : undefined
    });
    setShowLinkDialog(false);
  };

  return (
    <div className="space-y-4">
      <div className="border-b pb-4">
        <h4 className="font-semibold text-gray-900 mb-3">Text Content</h4>
        <textarea
          value={selectedElement.content}
          onChange={(e) => updateContent(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="Enter your text here..."
        />
      </div>

      {/* Font Family */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
        <select
          value={selectedElement.styles?.fontFamily || 'Arial'}
          onChange={(e) => updateStyle('fontFamily', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {fontFamilies.map(font => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Font Size: {selectedElement.styles?.fontSize || 16}px
        </label>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => updateStyle('fontSize', Math.max(8, (selectedElement.styles?.fontSize || 16) - 2))}
            className="p-1 border border-gray-300 rounded hover:bg-gray-100"
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="range"
            min="8"
            max="72"
            value={selectedElement.styles?.fontSize || 16}
            onChange={(e) => updateStyle('fontSize', parseInt(e.target.value))}
            className="flex-1"
          />
          <button
            onClick={() => updateStyle('fontSize', Math.min(72, (selectedElement.styles?.fontSize || 16) + 2))}
            className="p-1 border border-gray-300 rounded hover:bg-gray-100"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Text Formatting */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Formatting</label>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => toggleStyle('fontWeight', 'bold', 'normal')}
            className={`p-2 border rounded hover:bg-gray-100 ${
              selectedElement.styles?.fontWeight === 'bold' ? 'bg-blue-100 border-blue-300' : 'border-gray-300'
            }`}
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            onClick={() => toggleStyle('fontStyle', 'italic', 'normal')}
            className={`p-2 border rounded hover:bg-gray-100 ${
              selectedElement.styles?.fontStyle === 'italic' ? 'bg-blue-100 border-blue-300' : 'border-gray-300'
            }`}
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            onClick={() => toggleStyle('textDecoration', 'underline', 'none')}
            className={`p-2 border rounded hover:bg-gray-100 ${
              selectedElement.styles?.textDecoration === 'underline' ? 'bg-blue-100 border-blue-300' : 'border-gray-300'
            }`}
          >
            <Underline className="h-4 w-4" />
          </button>
          <button
            onClick={() => toggleStyle('textDecoration', 'line-through', 'none')}
            className={`p-2 border rounded hover:bg-gray-100 ${
              selectedElement.styles?.textDecoration === 'line-through' ? 'bg-blue-100 border-blue-300' : 'border-gray-300'
            }`}
          >
            <Strikethrough className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Text Alignment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Alignment</label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { value: 'left', icon: AlignLeft },
            { value: 'center', icon: AlignCenter },
            { value: 'right', icon: AlignRight },
            { value: 'justify', icon: AlignJustify }
          ].map(({ value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => updateStyle('textAlign', value)}
              className={`p-2 border rounded hover:bg-gray-100 ${
                (selectedElement.styles?.textAlign || 'left') === value ? 'bg-blue-100 border-blue-300' : 'border-gray-300'
              }`}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Lists */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Lists</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => updateStyle('listType', 'bulleted')}
            className={`p-2 border rounded hover:bg-gray-100 flex items-center justify-center ${
              selectedElement.styles?.listType === 'bulleted' ? 'bg-blue-100 border-blue-300' : 'border-gray-300'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => updateStyle('listType', 'numbered')}
            className={`p-2 border rounded hover:bg-gray-100 flex items-center justify-center ${
              selectedElement.styles?.listType === 'numbered' ? 'bg-blue-100 border-blue-300' : 'border-gray-300'
            }`}
          >
            <ListOrdered className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Special Formatting */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Special</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => updateStyle('verticalAlign', 'super')}
            className="p-2 border border-gray-300 rounded hover:bg-gray-100 flex items-center justify-center"
          >
            <Superscript className="h-4 w-4" />
          </button>
          <button
            onClick={() => updateStyle('verticalAlign', 'sub')}
            className="p-2 border border-gray-300 rounded hover:bg-gray-100 flex items-center justify-center"
          >
            <Subscript className="h-4 w-4" />
          </button>
          <button
            onClick={() => updateStyle('fontFamily', 'monospace')}
            className="p-2 border border-gray-300 rounded hover:bg-gray-100 flex items-center justify-center"
          >
            <Code className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Colors */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-full h-10 border border-gray-300 rounded-lg flex items-center px-3"
              style={{ backgroundColor: selectedElement.styles?.color || '#000000' }}
            >
              <Palette className="h-4 w-4 text-white mix-blend-difference" />
            </button>
            {showColorPicker && (
              <div className="absolute top-12 left-0 z-10 bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                <div className="grid grid-cols-6 gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        updateStyle('color', color);
                        setShowColorPicker(false);
                      }}
                      className="w-8 h-8 rounded border-2 border-gray-300 hover:border-blue-400"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
          <div className="relative">
            <button
              onClick={() => setShowBgColorPicker(!showBgColorPicker)}
              className="w-full h-10 border border-gray-300 rounded-lg flex items-center px-3"
              style={{ backgroundColor: selectedElement.styles?.backgroundColor || 'transparent' }}
            >
              <Palette className="h-4 w-4 text-black mix-blend-difference" />
            </button>
            {showBgColorPicker && (
              <div className="absolute top-12 left-0 z-10 bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                <div className="grid grid-cols-6 gap-2">
                  <button
                    onClick={() => {
                      updateStyle('backgroundColor', 'transparent');
                      setShowBgColorPicker(false);
                    }}
                    className="w-8 h-8 rounded border-2 border-gray-300 hover:border-blue-400 bg-white relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-500 opacity-50 rounded"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-xs">×</div>
                  </button>
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        updateStyle('backgroundColor', color);
                        setShowBgColorPicker(false);
                      }}
                      className="w-8 h-8 rounded border-2 border-gray-300 hover:border-blue-400"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Line Height */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Line Height: {selectedElement.styles?.lineHeight || 1.5}
        </label>
        <input
          type="range"
          min="1"
          max="3"
          step="0.1"
          value={selectedElement.styles?.lineHeight || 1.5}
          onChange={(e) => updateStyle('lineHeight', parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Link */}
      <div>
        <button
          onClick={() => setShowLinkDialog(true)}
          className="w-full flex items-center justify-center space-x-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          <Link className="h-4 w-4" />
          <span>{selectedElement.link ? 'Edit Link' : 'Add Link'}</span>
        </button>
      </div>

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add/Edit Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="newWindow"
                  checked={linkNewWindow}
                  onChange={(e) => setLinkNewWindow(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="newWindow" className="text-sm text-gray-700">
                  Open in new window
                </label>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleLinkSave}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowLinkDialog(false)}
                  className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextEditor;