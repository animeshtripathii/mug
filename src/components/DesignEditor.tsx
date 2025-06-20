import React, { useState, useCallback } from 'react';
import { DesignElement, MugOptions, GraphicItem, QRCodeOptions, TableData } from '../types';
import Toolbar from './DesignEditor/Toolbar';
import Canvas from './DesignEditor/Canvas';
import { Save, Download, Share2, ArrowLeft, Settings } from 'lucide-react';

interface DesignEditorProps {
  onBack: () => void;
  onSave: (elements: DesignElement[]) => void;
}

const DesignEditor: React.FC<DesignEditorProps> = ({ onBack, onSave }) => {
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState('');
  const [mugView, setMugView] = useState<'front' | 'wrap'>('front');
  const [showSpecs, setShowSpecs] = useState(false);
  const [history, setHistory] = useState<DesignElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // History management
  const addToHistory = useCallback((newElements: DesignElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements([...history[historyIndex - 1]]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements([...history[historyIndex + 1]]);
    }
  }, [history, historyIndex]);

  const addTextElement = useCallback(() => {
    const newElement: DesignElement = {
      id: generateId(),
      type: 'text',
      content: 'Your Text Here',
      x: 100,
      y: 100,
      width: 150,
      height: 30,
      rotation: 0,
      zIndex: elements.length,
      surface: mugView,
      styles: {
        fontSize: 16,
        fontFamily: 'Arial',
        color: '#000000',
        fontWeight: 'normal',
        textAlign: 'left',
        lineHeight: 1.5
      },
      mapping: {
        u: 100 / 300,
        v: 100 / 200,
        scale: 1
      }
    };
    const newElements = [...elements, newElement];
    setElements(newElements);
    addToHistory(newElements);
    setSelectedElement(newElement.id);
    setActiveMode('text');
  }, [elements, mugView, addToHistory]);

  const addImageElement = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const newElement: DesignElement = {
        id: generateId(),
        type: 'image',
        content: e.target?.result as string,
        x: 120,
        y: 120,
        width: 100,
        height: 100,
        rotation: 0,
        zIndex: elements.length,
        surface: mugView,
        altText: file.name,
        mapping: {
          u: 120 / 300,
          v: 120 / 200,
          scale: 1
        }
      };
      const newElements = [...elements, newElement];
      setElements(newElements);
      addToHistory(newElements);
      setSelectedElement(newElement.id);
    };
    reader.readAsDataURL(file);
  }, [elements, mugView, addToHistory]);

  const addGraphicElement = useCallback((graphic: GraphicItem) => {
    const newElement: DesignElement = {
      id: generateId(),
      type: 'graphic',
      content: graphic.svg,
      x: 140,
      y: 140,
      width: 60,
      height: 60,
      rotation: 0,
      zIndex: elements.length,
      surface: mugView,
      styles: {
        fontSize: 48,
        color: '#FFD700'
      },
      mapping: {
        u: 140 / 300,
        v: 140 / 200,
        scale: 1
      }
    };
    const newElements = [...elements, newElement];
    setElements(newElements);
    addToHistory(newElements);
    setSelectedElement(newElement.id);
    setActiveMode('graphics');
  }, [elements, mugView, addToHistory]);

  const addQRElement = useCallback((options: QRCodeOptions) => {
    const newElement: DesignElement = {
      id: generateId(),
      type: 'qr',
      content: options.data,
      x: 160,
      y: 160,
      width: options.size / 4, // Scale down for canvas
      height: options.size / 4,
      rotation: 0,
      zIndex: elements.length,
      surface: mugView,
      styles: {
        color: options.color,
        backgroundColor: options.backgroundColor,
        borderRadius: options.borderRadius
      },
      mapping: {
        u: 160 / 300,
        v: 160 / 200,
        scale: 1
      }
    };
    const newElements = [...elements, newElement];
    setElements(newElements);
    addToHistory(newElements);
    setSelectedElement(newElement.id);
    setActiveMode('qr');
  }, [elements, mugView, addToHistory]);

  const addTableElement = useCallback((tableData: TableData) => {
    const newElement: DesignElement = {
      id: generateId(),
      type: 'table',
      content: JSON.stringify(tableData),
      x: 80,
      y: 80,
      width: 140,
      height: 60,
      rotation: 0,
      zIndex: elements.length,
      surface: mugView,
      mapping: {
        u: 80 / 300,
        v: 80 / 200,
        scale: 1
      }
    };
    const newElements = [...elements, newElement];
    setElements(newElements);
    addToHistory(newElements);
    setSelectedElement(newElement.id);
    setActiveMode('table');
  }, [elements, mugView, addToHistory]);

  const updateElement = useCallback((id: string, updates: Partial<DesignElement>) => {
    const newElements = elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    setElements(newElements);
    addToHistory(newElements);
  }, [elements, addToHistory]);

  const deleteElement = useCallback(() => {
    if (selectedElement) {
      const newElements = elements.filter(el => el.id !== selectedElement);
      setElements(newElements);
      addToHistory(newElements);
      setSelectedElement(null);
    }
  }, [selectedElement, elements, addToHistory]);

  const duplicateElement = useCallback(() => {
    if (selectedElement) {
      const element = elements.find(el => el.id === selectedElement);
      if (element) {
        const newElement = {
          ...element,
          id: generateId(),
          x: element.x + 20,
          y: element.y + 20,
          zIndex: elements.length
        };
        const newElements = [...elements, newElement];
        setElements(newElements);
        addToHistory(newElements);
        setSelectedElement(newElement.id);
      }
    }
  }, [selectedElement, elements, addToHistory]);

  const handleElementStyleChange = useCallback((property: string, value: any) => {
    if (selectedElement) {
      const element = elements.find(el => el.id === selectedElement);
      if (element) {
        updateElement(selectedElement, {
          styles: { ...element.styles, [property]: value }
        });
      }
    }
  }, [selectedElement, elements, updateElement]);

  const handleSave = () => {
    onSave(elements);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Product</span>
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-xl font-semibold text-gray-900">Mug Design Editor</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSpecs(!showSpecs)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Specs & Guidelines</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save Design</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download className="h-4 w-4" />
              <span>Next</span>
            </button>
          </div>
        </div>
      </div>

      {/* Specs Modal */}
      {showSpecs && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Design Specifications</h2>
              <button
                onClick={() => setShowSpecs(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Print Area Dimensions</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Front design area: 17.2 cm × 7 cm</li>
                  <li>• Wraparound design area: 22 cm × 7 cm</li>
                  <li>• Safe print margin: 2 cm from edges</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Image Requirements</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Minimum resolution: 300 DPI</li>
                  <li>• Supported formats: JPG, PNG, PDF</li>
                  <li>• Maximum file size: 10 MB</li>
                  <li>• Color mode: RGB</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Design Tips</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Keep important content within safe area</li>
                  <li>• Use high contrast for better visibility</li>
                  <li>• Consider mug curvature for wraparound designs</li>
                  <li>• Test readability at actual size</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Editor */}
      <div className="flex-1 flex">
        <Toolbar
          activeMode={activeMode}
          selectedElement={selectedElement}
          elements={elements}
          onModeChange={setActiveMode}
          onAddText={addTextElement}
          onUploadImage={addImageElement}
          onAddGraphic={addGraphicElement}
          onAddQR={addQRElement}
          onAddTable={addTableElement}
          onDeleteElement={deleteElement}
          onDuplicateElement={duplicateElement}
          onElementStyleChange={handleElementStyleChange}
          onElementUpdate={updateElement}
          onUndo={undo}
          onRedo={redo}
        />
        
        <Canvas
          elements={elements}
          selectedElement={selectedElement}
          mugView={mugView}
          onElementSelect={setSelectedElement}
          onElementUpdate={updateElement}
          onMugViewChange={setMugView}
        />
      </div>
    </div>
  );
};

export default DesignEditor;