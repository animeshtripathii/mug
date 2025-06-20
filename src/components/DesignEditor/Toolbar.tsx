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
    { id: 'qr', icon: QrCode, label: 'QR-codes', tooltip: 'Generate QR codes' },
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
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Text</h3>
              <p className="text-gray-600 text-sm mb-6">
                Edit your text below, or click on the field you'd like to edit directly on your design.
              </p>
              
              {selectedElementData?.type === 'text' ? (
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={selectedElementData.content}
                      onChange={(e) => onElementUpdate(selectedElementData.id, { content: e.target.value })}
                      placeholder="Type text here"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    />
                  </div>
                  <TextEditor
                    selectedElement={selectedElementData}
                    onElementUpdate={onElementUpdate}
                  />
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    placeholder="Type text here"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg mb-4"
                  />
                  <button
                    onClick={onAddText}
                    className="w-full bg-blue-400 text-white py-3 rounded-lg font-medium hover:bg-blue-500 transition-colors"
                  >
                    New Text Field
                  </button>
                </div>
              )}
            </div>
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
        return null;
    }
  };

  return (
    <div className="w-80 bg-white shadow-sm h-full border-r border-gray-200 overflow-y-auto">
      {/* Tool Icons */}
      <div className="p-4 space-y-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onModeChange(tool.id)}
            title={tool.tooltip}
            className={`w-full flex flex-col items-center p-4 rounded-lg transition-all duration-200 ${
              activeMode === tool.id 
                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <tool.icon className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">{tool.label}</span>
          </button>
        ))}
      </div>

      {/* Tool Content */}
      {activeMode && (
        <div className="border-t bg-gray-50 p-6 min-h-96">
          {renderToolContent()}
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