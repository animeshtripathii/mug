import React, { useState } from 'react';
import { 
  Type, 
  Image, 
  Shapes, 
  QrCode, 
  Table, 
  Upload, 
  Palette,
  RotateCcw,
  RotateCw,
  Copy,
  Trash2,
  Save,
  Eye,
  Settings,
  FileText,
  Layers,
  Undo,
  Redo,
  Plus
} from 'lucide-react';
import TextEditor from './TextEditor';
import ImageEditor from './ImageEditor';
import GraphicsLibrary from './GraphicsLibrary';
import QRCodeGenerator from './QRCodeGenerator';
import TableEditor from './TableEditor';
import { DesignElement, GraphicItem, QRCodeOptions, TableData } from '../../types';

interface ToolbarProps {
  activeMode: string;
  selectedElement: string | null;
  elements: DesignElement[];
  onModeChange: (mode: string) => void;
  onAddText: () => void;
  onUploadImage: (file: File) => void;
  onAddGraphic: (graphic: GraphicItem) => void;
  onAddQR: (options: QRCodeOptions) => void;
  onAddTable: (tableData: TableData) => void;
  onDeleteElement: () => void;
  onDuplicateElement: () => void;
  onElementStyleChange: (property: string, value: any) => void;
  onElementUpdate: (id: string, updates: Partial<DesignElement>) => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  activeMode,
  selectedElement,
  elements,
  onModeChange,
  onAddText,
  onUploadImage,
  onAddGraphic,
  onAddQR,
  onAddTable,
  onDeleteElement,
  onDuplicateElement,
  onElementStyleChange,
  onElementUpdate,
  onUndo,
  onRedo
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');

  const tools = [
    { id: 'text', icon: Type, label: 'Text', tooltip: 'Add and edit text' },
    { id: 'image', icon: Image, label: 'Images', tooltip: 'Upload and edit images' },
    { id: 'graphics', icon: Shapes, label: 'Graphics', tooltip: 'Add shapes and icons' },
    { id: 'qr', icon: QrCode, label: 'QR Code', tooltip: 'Generate QR codes' },
    { id: 'table', icon: Table, label: 'Tables', tooltip: 'Insert and edit tables' }
  ];

  const selectedElementData = elements.find(el => el.id === selectedElement);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUploadImage(file);
    }
  };

  const renderToolContent = () => {
    switch (activeMode) {
      case 'text':
        return (
          <div className="space-y-4">
            <button
              onClick={onAddText}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>New Text Field</span>
            </button>
            <TextEditor
              selectedElement={selectedElementData}
              onElementUpdate={onElementUpdate}
            />
          </div>
        );
      
      case 'image':
        return (
          <ImageEditor
            selectedElement={selectedElementData}
            onElementUpdate={onElementUpdate}
            onImageUpload={onUploadImage}
          />
        );
      
      case 'graphics':
        return (
          <GraphicsLibrary
            onGraphicSelect={onAddGraphic}
          />
        );
      
      case 'qr':
        return (
          <QRCodeGenerator
            onQRCodeGenerate={onAddQR}
          />
        );
      
      case 'table':
        return (
          <TableEditor
            onTableCreate={onAddTable}
            selectedElement={selectedElementData}
            onElementUpdate={onElementUpdate}
          />
        );
      
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🎨</div>
            <p>Select a tool to get started</p>
          </div>
        );
    }
  };

  return (
    <div className="w-80 bg-white shadow-lg h-full border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h3 className="text-lg font-semibold">Design Tools</h3>
        <p className="text-sm opacity-90">Create your perfect mug design</p>
      </div>
      
      {/* Undo/Redo */}
      <div className="p-4 border-b">
        <div className="flex space-x-2">
          <button
            onClick={onUndo}
            className="flex-1 flex items-center justify-center space-x-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            title="Undo"
          >
            <Undo className="h-4 w-4" />
            <span className="text-sm">Undo</span>
          </button>
          <button
            onClick={onRedo}
            className="flex-1 flex items-center justify-center space-x-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            title="Redo"
          >
            <Redo className="h-4 w-4" />
            <span className="text-sm">Redo</span>
          </button>
        </div>
      </div>

      {/* Main Tools */}
      <div className="p-4 space-y-2">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Design Elements</h4>
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onModeChange(tool.id)}
            title={tool.tooltip}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
              activeMode === tool.id 
                ? 'bg-blue-100 text-blue-700 border border-blue-200 shadow-sm' 
                : 'hover:bg-gray-100 text-gray-700 hover:shadow-sm'
            }`}
          >
            <tool.icon className="h-5 w-5" />
            <span className="font-medium">{tool.label}</span>
          </button>
        ))}
      </div>

      {/* Tool Content */}
      <div className="p-4 border-t bg-gray-50">
        {renderToolContent()}
      </div>

      {/* Element Actions */}
      {selectedElement && (
        <div className="p-4 border-t">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Element Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => onElementStyleChange('rotation', -90)}
              className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
              title="Rotate Left"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button 
              onClick={() => onElementStyleChange('rotation', 90)}
              className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
              title="Rotate Right"
            >
              <RotateCw className="h-4 w-4" />
            </button>
            <button 
              onClick={onDuplicateElement}
              className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
              title="Duplicate"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button 
              onClick={onDeleteElement}
              className="flex items-center justify-center p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};

export default Toolbar;