import React, { useState, useCallback } from 'react';
import { DesignElement, MugOptions, GraphicItem, QRCodeOptions, TableData } from '../types';
import Toolbar from './DesignEditor/Toolbar';
import Canvas from './DesignEditor/Canvas';
import { Save, Download, Share2, ArrowLeft, Settings, Undo, Redo, Eye } from 'lucide-react';

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
      content: 'Type text here',
      x: 100,
      y: 100,
      width: 200,
      height: 40,
      rotation: 0,
      zIndex: elements.length,
      surface: mugView,
      styles: {
        fontSize: 24,
        fontFamily: 'Arial',
        color: '#000000',
        fontWeight: 'normal',
        textAlign: 'center',
        lineHeight: 1.2
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
      width: options.size / 4,
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>My Projects</span>
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MugCraft Pro
            </h1>
            <div className="h-6 w-px bg-gray-300" />
            <span className="text-gray-600">Personalised Mugs</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span>Save</span>
            </button>
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Undo"
            >
              <Undo className="h-5 w-5" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Redo"
            >
              <Redo className="h-5 w-5" />
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
              <Eye className="h-4 w-4" />
              <span>Specs & Templates</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
              <Settings className="h-4 w-4" />
              <span>Change size</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              <span>Next</span>
            </button>
          </div>
        </div>
      </div>

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