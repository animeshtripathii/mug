import React, { useRef, useEffect, useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline,
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List,
  ListOrdered,
  Type,
  Minus,
  Plus,
  ChevronDown,
  MoreHorizontal,
  Copy,
  Trash2,
  RotateCw,
  Layers,
  Eye,
  Move3D,
  Palette,
  AlignHorizontalJustifyCenter,
  AlignVerticalJustifyCenter,
  X,
  Type as SIcon,
  FlipHorizontal,
  FlipVertical
} from 'lucide-react';
import { useTextContext } from '../context/TextContext';
import FloatingPanel, { SliderControl, ButtonGroupControl, DropdownControl } from './FloatingPanel';

interface TextFloatingToolbarProps {
  isVisible: boolean;
  selectedTextId: string | null;
}

const TextFloatingToolbar: React.FC<TextFloatingToolbarProps> = ({ 
  isVisible, 
  selectedTextId
}) => {
  const { textElements, updateTextElement, deleteTextElement, duplicateTextElement, selectTextElement } = useTextContext();
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  const [showListDropdown, setShowListDropdown] = useState(false);
  const [showFlipDropdown, setShowFlipDropdown] = useState(false);
  const [showAlignmentDropdown, setShowAlignmentDropdown] = useState(false);
  
  // Text formatting states
  const [fontSize, setFontSize] = useState(46);
  const [fontFamily, setFontFamily] = useState('Arimo');
  const [textColor, setTextColor] = useState('#000000');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');
  const [lineSpacing, setLineSpacing] = useState(1.4);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [opacity, setOpacity] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [textCase, setTextCase] = useState<'normal' | 'lowercase' | 'uppercase'>('normal');
  const [curveStyle, setCurveStyle] = useState<'none' | 'slight-up' | 'medium-up' | 'full-up' | 'slight-down' | 'full-down'>('none');
  const [isBulletList, setIsBulletList] = useState(false);
  const [isNumberedList, setIsNumberedList] = useState(false);
  const [showLayerDropdown, setShowLayerDropdown] = useState(false);
  const [isFlippedHorizontal, setIsFlippedHorizontal] = useState(false);
  const [isFlippedVertical, setIsFlippedVertical] = useState(false);
  
  // Refs for panel positioning
  const fontRef = useRef<HTMLButtonElement>(null);
  const sizeRef = useRef<HTMLButtonElement>(null);
  const colorRef = useRef<HTMLButtonElement>(null);
  const alignRef = useRef<HTMLButtonElement>(null);
  const spacingRef = useRef<HTMLButtonElement>(null);
  const opacityRef = useRef<HTMLButtonElement>(null);
  const layerRef = useRef<HTMLButtonElement>(null);
  const moreRef = useRef<HTMLButtonElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const formatRef = useRef<HTMLButtonElement>(null);
  const rotationRef = useRef<HTMLButtonElement>(null);
  const layerDropdownRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLButtonElement>(null);
  const flipRef = useRef<HTMLButtonElement>(null);
  const alignmentDropdownRef = useRef<HTMLButtonElement>(null);

  const selectedElement = textElements.find(el => el.id === selectedTextId);

  // Debug logging
  useEffect(() => {
    console.log('TextFloatingToolbar state:', {
      isVisible,
      selectedTextId,
      hasSelectedElement: !!selectedElement,
      elementText: selectedElement?.text
    });
  }, [isVisible, selectedTextId, selectedElement]);

  const fonts = [
    'Arimo', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 
    'Verdana', 'Courier New', 'Roboto', 'Open Sans', 'Lato', 
    'Montserrat', 'Poppins', 'Inter', 'Source Sans Pro'
  ];

  const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 46, 52, 60, 72, 84, 96];

  // Initialize values from selected element
  useEffect(() => {
    if (selectedElement) {
      setFontSize(selectedElement.fontSize);
      setFontFamily(selectedElement.fontFamily);
      setTextColor(selectedElement.color);
      setIsBold(selectedElement.isBold);
      setIsItalic(selectedElement.isItalic || false);
      setIsUnderline(selectedElement.isUnderline || false);
      setAlignment(selectedElement.alignment);
      setLineSpacing(selectedElement.lineHeight || 1.4);
      setLetterSpacing(selectedElement.letterSpacing || 0);
      setOpacity(selectedElement.opacity || 100);
      setRotation(selectedElement.rotation || 0);
      setTextCase(selectedElement.textCase || 'normal');
      setCurveStyle(selectedElement.curveStyle || 'none');
      setIsBulletList(selectedElement.isBulletList || false);
      setIsNumberedList(selectedElement.isNumberedList || false);
      
      // Initialize flip states from transform
      const transform = selectedElement.transform || '';
      setIsFlippedHorizontal(transform.includes('scaleX(-1)'));
      setIsFlippedVertical(transform.includes('scaleY(-1)'));
    }
  }, [selectedElement]);

  if (!isVisible || !selectedElement) {
    return null;
  }

  const openPanel = (panelName: string) => {
    setActivePanel(activePanel === panelName ? null : panelName);
    setShowMoreMenu(false);
    setShowFontDropdown(false);
    setShowSizeDropdown(false);
    setShowFormatDropdown(false);
    setShowLayerDropdown(false);
    setShowListDropdown(false);
    setShowFlipDropdown(false);
    setShowAlignmentDropdown(false);
  };

  const closePanel = () => {
    setActivePanel(null);
    setShowFontDropdown(false);
    setShowSizeDropdown(false);
    setShowFormatDropdown(false);
    setShowLayerDropdown(false);
    setShowListDropdown(false);
    setShowFlipDropdown(false);
    setShowAlignmentDropdown(false);
  };

  const handleFontChange = (font: string) => {
    setFontFamily(font);
    if (selectedElement) {
      updateTextElement(selectedElement.id, { fontFamily: font });
    }
    setShowFontDropdown(false);
  };

  const handleSizeChange = (size: number) => {
    setFontSize(size);
    if (selectedElement) {
      updateTextElement(selectedElement.id, { fontSize: size });
    }
    setShowSizeDropdown(false);
  };

  const adjustFontSize = (increment: number) => {
    const newSize = Math.max(8, Math.min(96, fontSize + increment));
    setFontSize(newSize);
    if (selectedElement) {
      updateTextElement(selectedElement.id, { fontSize: newSize });
    }
  };

  const handleColorChange = (color: string) => {
    setTextColor(color);
    if (selectedElement) {
      updateTextElement(selectedElement.id, { color });
    }
  };

  const handleBoldToggle = () => {
    const newBold = !isBold;
    setIsBold(newBold);
    if (selectedElement) {
      updateTextElement(selectedElement.id, { isBold: newBold });
    }
  };

  const handleItalicToggle = () => {
    const newItalic = !isItalic;
    setIsItalic(newItalic);
    if (selectedElement) {
      updateTextElement(selectedElement.id, { isItalic: newItalic });
    }
  };

  const handleUnderlineToggle = () => {
    const newUnderline = !isUnderline;
    setIsUnderline(newUnderline);
    if (selectedElement) {
      updateTextElement(selectedElement.id, { isUnderline: newUnderline });
    }
  };

  const handleAlignmentChange = (newAlignment: 'left' | 'center' | 'right') => {
    setAlignment(newAlignment);
    if (selectedElement) {
      updateTextElement(selectedElement.id, { alignment: newAlignment });
    }
  };

  const handleLineSpacingChange = (value: number) => {
    setLineSpacing(value);
    if (selectedElement) {
      updateTextElement(selectedElement.id, { lineHeight: value });
    }
  };

  const handleLetterSpacingChange = (value: number) => {
    setLetterSpacing(value);
    if (selectedElement) {
      updateTextElement(selectedElement.id, { letterSpacing: value });
    }
  };

  const handleOpacityChange = (value: number) => {
    setOpacity(value);
    if (selectedElement) {
      updateTextElement(selectedElement.id, { opacity: value });
    }
  };

  const handleRotationChange = (value: number) => {
    setRotation(value);
    if (selectedElement) {
      updateTextElement(selectedElement.id, { rotation: value });
    }
  };

  const handleDuplicate = () => {
    if (selectedElement) {
      duplicateTextElement(selectedElement.id);
    }
    setShowMoreMenu(false);
  };

  const handleDelete = () => {
    if (selectedElement) {
      deleteTextElement(selectedElement.id);
    }
    setShowMoreMenu(false);
  };

  const handleTextCaseChange = (newCase: 'normal' | 'lowercase' | 'uppercase') => {
    setTextCase(newCase);
    if (selectedElement) {
      updateTextElement(selectedElement.id, { textCase: newCase });
    }
    // Keep dropdown open and element selected
    // Don't close the dropdown to allow multiple format changes
  };

  const handleCurveStyleChange = (newCurve: 'none' | 'slight-up' | 'medium-up' | 'full-up' | 'slight-down' | 'full-down') => {
    setCurveStyle(newCurve);
    if (selectedElement) {
      updateTextElement(selectedElement.id, { curveStyle: newCurve });
      
      // Adjust text element height for better curve display
      if (newCurve !== 'none') {
        const currentHeight = selectedElement.height || 50;
        const newHeight = Math.max(currentHeight, 80); // Ensure minimum height for curves
        updateTextElement(selectedElement.id, { height: newHeight });
      }
    }
    console.log('Curve style changed to:', newCurve);
  };

  const handleBulletListToggle = () => {
    const newBulletList = !isBulletList;
    setIsBulletList(newBulletList);
    setIsNumberedList(false); // Turn off numbered list if bullet list is enabled
    if (selectedElement) {
      updateTextElement(selectedElement.id, { 
        isBulletList: newBulletList,
        isNumberedList: false
      });
    }
    setShowListDropdown(false);
  };

  const handleNumberedListToggle = () => {
    const newNumberedList = !isNumberedList;
    setIsNumberedList(newNumberedList);
    setIsBulletList(false); // Turn off bullet list if numbered list is enabled
    if (selectedElement) {
      updateTextElement(selectedElement.id, { 
        isNumberedList: newNumberedList,
        isBulletList: false
      });
    }
    setShowListDropdown(false);
  };

  const handleNoListToggle = () => {
    setIsBulletList(false);
    setIsNumberedList(false);
    if (selectedElement) {
      updateTextElement(selectedElement.id, { 
        isBulletList: false,
        isNumberedList: false
      });
    }
    setShowListDropdown(false);
  };

  const handleFlipHorizontal = () => {
    const newFlippedHorizontal = !isFlippedHorizontal;
    setIsFlippedHorizontal(newFlippedHorizontal);
    
    if (selectedElement) {
      let currentTransform = selectedElement.transform || '';
      
      // Remove existing scaleX
      currentTransform = currentTransform.replace(/scaleX\(-?1\)/g, '').trim();
      
      // Add new scaleX if flipping
      if (newFlippedHorizontal) {
        currentTransform = `${currentTransform} scaleX(-1)`.trim();
      }
      
      updateTextElement(selectedElement.id, { transform: currentTransform });
    }
    setShowFlipDropdown(false);
  };

  const handleFlipVertical = () => {
    const newFlippedVertical = !isFlippedVertical;
    setIsFlippedVertical(newFlippedVertical);
    
    if (selectedElement) {
      let currentTransform = selectedElement.transform || '';
      
      // Remove existing scaleY
      currentTransform = currentTransform.replace(/scaleY\(-?1\)/g, '').trim();
      
      // Add new scaleY if flipping
      if (newFlippedVertical) {
        currentTransform = `${currentTransform} scaleY(-1)`.trim();
      }
      
      updateTextElement(selectedElement.id, { transform: currentTransform });
    }
    setShowFlipDropdown(false);
  };

  const handleLayerAction = (action: string) => {
    if (selectedElement) {
      // Here you would implement the actual layer reordering logic
      // For now, we'll just log the action
      console.log(`Layer action: ${action} for element ${selectedElement.id}`);
      
      // You could add z-index manipulation here
      switch (action) {
        case 'bring-to-front':
          // Set highest z-index
          break;
        case 'bring-forward':
          // Increase z-index by 1
          break;
        case 'send-backward':
          // Decrease z-index by 1
          break;
        case 'send-to-back':
          // Set lowest z-index
          break;
      }
    }
    setShowLayerDropdown(false);
  };

  const handleCenterAlign = () => {
    if (selectedElement) {
      const canvasWidth = 688;
      const elementWidth = selectedElement.width || 200;
      const centerX = (canvasWidth - elementWidth) / 2;
      updateTextElement(selectedElement.id, { x: centerX });
    }
  };

  const handleMiddleAlign = () => {
    if (selectedElement) {
      const canvasHeight = 280;
      const elementHeight = selectedElement.height || 50;
      const centerY = (canvasHeight - elementHeight) / 2;
      updateTextElement(selectedElement.id, { y: centerY });
    }
  };

  const resetLineSpacing = () => handleLineSpacingChange(1.4);
  const resetLetterSpacing = () => handleLetterSpacingChange(0);

  // Get current list type for display
  const getCurrentListType = () => {
    if (isBulletList) return 'Bullet List';
    if (isNumberedList) return 'Numbered List';
    return 'No List';
  };

  return (
    <>
      <div 
        ref={toolbarRef}
        className="text-toolbar fixed bg-white rounded-2xl shadow-2xl border border-gray-200 z-50"
        style={{
          top: '120px',
          left: 'calc(50% + 4cm)',
          transform: 'translateX(-50%)',
          pointerEvents: 'auto'
        }}
      >
        {/* Main Toolbar */}
        <div className="flex items-center">
          {/* Font Family */}
          <div className="flex items-center px-3 py-2 border-r border-gray-200 relative">
            <button
              ref={fontRef}
              onClick={() => setShowFontDropdown(!showFontDropdown)}
              className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors min-w-[120px]"
            >
              <span className="text-sm font-medium" style={{ fontFamily }}>{fontFamily}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showFontDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 min-w-[140px] max-h-48 overflow-y-auto">
                {fonts.map((font) => (
                  <button
                    key={font}
                    onClick={() => handleFontChange(font)}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Font Size Controls */}
          <div className="flex items-center px-3 py-2 border-r border-gray-200 space-x-1">
            <button
              onClick={() => adjustFontSize(-2)}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              title="Decrease font size"
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="relative">
              <button
                ref={sizeRef}
                onClick={() => setShowSizeDropdown(!showSizeDropdown)}
                className="flex items-center space-x-1 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors min-w-[60px]"
              >
                <span className="text-sm font-medium">{fontSize}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {showSizeDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 max-h-48 overflow-y-auto">
                  {fontSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeChange(size)}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => adjustFontSize(2)}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              title="Increase font size"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Color Picker */}
          <div className="flex items-center px-3 py-2 border-r border-gray-200">
            <button
              ref={colorRef}
              onClick={() => openPanel('color')}
              className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
              style={{ backgroundColor: textColor }}
              title="Text Color"
            />
            
            <FloatingPanel
              isOpen={activePanel === 'color'}
              onClose={closePanel}
              title="Text Color"
              anchorRef={colorRef}
            >
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#000000"
                  />
                </div>
              </div>
            </FloatingPanel>
          </div>

          {/* Text Formatting */}
          <div className="flex items-center px-2 py-2 border-r border-gray-200 space-x-1">
            <button
              onClick={handleBoldToggle}
              className={`p-2 rounded-lg transition-colors ${
                isBold ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-50'
              }`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>

            <button
              onClick={handleItalicToggle}
              className={`p-2 rounded-lg transition-colors ${
                isItalic ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-50'
              }`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>

            <button
              onClick={handleUnderlineToggle}
              className={`p-2 rounded-lg transition-colors ${
                isUnderline ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-50'
              }`}
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </button>
          </div>

          {/* Alignment */}
          {/* Alignment Dropdown */}
          <div className="flex items-center px-2 py-2 border-r border-gray-200 relative">
            <button
              ref={alignmentDropdownRef}
              onClick={() => setShowAlignmentDropdown(!showAlignmentDropdown)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                showAlignmentDropdown ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
              title="Text Alignment"
            >
              {alignment === 'left' ? <AlignLeft className="w-4 h-4" /> : 
               alignment === 'center' ? <AlignCenter className="w-4 h-4" /> : 
               <AlignRight className="w-4 h-4" />}
              <ChevronDown className="w-3 h-3" />
            </button>
            
            {showAlignmentDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 min-w-[140px]">
                <button 
                  onClick={() => {
                    handleAlignmentChange('left');
                    setShowAlignmentDropdown(false);
                  }}
                  className={`flex items-center space-x-3 w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors ${
                    alignment === 'left' ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  <AlignLeft className="w-4 h-4" />
                  <span>Align Left</span>
                </button>
                
                <button 
                  onClick={() => {
                    handleAlignmentChange('center');
                    setShowAlignmentDropdown(false);
                  }}
                  className={`flex items-center space-x-3 w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors ${
                    alignment === 'center' ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  <AlignCenter className="w-4 h-4" />
                  <span>Align Center</span>
                </button>
                
                <button 
                  onClick={() => {
                    handleAlignmentChange('right');
                    setShowAlignmentDropdown(false);
                  }}
                  className={`flex items-center space-x-3 w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors ${
                    alignment === 'right' ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  <AlignRight className="w-4 h-4" />
                  <span>Align Right</span>
                </button>
              </div>
            )}
          </div>

          {/* List Controls Dropdown */}
          <div className="flex items-center px-2 py-2 border-r border-gray-200 relative">
            <button
              ref={listRef}
              onClick={() => setShowListDropdown(!showListDropdown)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                showListDropdown ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              } ${(isBulletList || isNumberedList) ? 'bg-blue-100 text-blue-600' : ''}`}
              title="List Options"
            >
              {isBulletList ? <List className="w-4 h-4" /> : 
               isNumberedList ? <ListOrdered className="w-4 h-4" /> : 
               <List className="w-4 h-4" />}
              <ChevronDown className="w-3 h-3" />
            </button>
            
            {showListDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 min-w-[160px]">
                <button 
                  onClick={handleNoListToggle}
                  className={`flex items-center space-x-3 w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors ${
                    !isBulletList && !isNumberedList ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <div className="w-2 h-0.5 bg-current"></div>
                  </div>
                  <span>No List</span>
                </button>
                
                <button 
                  onClick={handleBulletListToggle}
                  className={`flex items-center space-x-3 w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors ${
                    isBulletList ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  <List className="w-4 h-4" />
                  <span>Bullet List</span>
                </button>
                
                <button 
                  onClick={handleNumberedListToggle}
                  className={`flex items-center space-x-3 w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors ${
                    isNumberedList ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  <ListOrdered className="w-4 h-4" />
                  <span>Numbered List</span>
                </button>
              </div>
            )}
          </div>

          {/* Text Effects */}
          <div className="flex items-center px-2 py-2 border-r border-gray-200 space-x-1">
            <div className="relative">
              <button
                ref={formatRef}
                onClick={() => setShowFormatDropdown(!showFormatDropdown)}
                className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                  showFormatDropdown ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                }`}
                title="Format Options"
              >
                Format
              </button>
              
              {showFormatDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-10 w-80 p-4">
                  {/* Case Section */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Case</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleTextCaseChange('normal')}
                        className={`flex items-center justify-center w-12 h-10 border-2 rounded-lg transition-all ${
                          textCase === 'normal' 
                            ? 'border-blue-500 bg-blue-50 text-blue-600' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        title="Normal Case"
                      >
                        <span className="text-sm font-medium">Aa</span>
                      </button>
                      
                      <button
                        onClick={() => handleTextCaseChange('lowercase')}
                        className={`flex items-center justify-center w-12 h-10 border-2 rounded-lg transition-all ${
                          textCase === 'lowercase' 
                            ? 'border-blue-500 bg-blue-50 text-blue-600' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        title="Lowercase"
                      >
                        <span className="text-sm">a↓</span>
                      </button>
                      
                      <button
                        onClick={() => handleTextCaseChange('uppercase')}
                        className={`flex items-center justify-center w-12 h-10 border-2 rounded-lg transition-all ${
                          textCase === 'uppercase' 
                            ? 'border-blue-500 bg-blue-50 text-blue-600' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        title="Uppercase"
                      >
                        <span className="text-sm font-bold">A↑</span>
                      </button>
                    </div>
                  </div>

                  {/* Curve Text Section */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Curve text</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleCurveStyleChange('none')}
                        className={`flex items-center justify-center w-12 h-10 border-2 rounded-lg transition-all ${
                          curveStyle === 'none' 
                            ? 'border-blue-500 bg-blue-50 text-blue-600' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        title="No Curve"
                      >
                        <div className="w-6 h-0.5 bg-current"></div>
                      </button>
                      
                      <button
                        onClick={() => handleCurveStyleChange('slight-up')}
                        className={`flex items-center justify-center w-12 h-10 border-2 rounded-lg transition-all ${
                          curveStyle === 'slight-up' 
                            ? 'border-blue-500 bg-blue-50 text-blue-600' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        title="Slight Curve Up"
                      >
                        <svg width="24" height="16" viewBox="0 0 24 16" className="text-current">
                          <path d="M2 12 Q12 4 22 12" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => handleCurveStyleChange('medium-up')}
                        className={`flex items-center justify-center w-12 h-10 border-2 rounded-lg transition-all ${
                          curveStyle === 'medium-up' 
                            ? 'border-blue-500 bg-blue-50 text-blue-600' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        title="Medium Curve Up"
                      >
                        <svg width="24" height="16" viewBox="0 0 24 16" className="text-current">
                          <path d="M2 14 Q12 2 22 14" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => handleCurveStyleChange('full-up')}
                        className={`flex items-center justify-center w-12 h-10 border-2 rounded-lg transition-all ${
                          curveStyle === 'full-up' 
                            ? 'border-blue-500 bg-blue-50 text-blue-600' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        title="Full Curve Up"
                      >
                        <svg width="24" height="16" viewBox="0 0 24 16" className="text-current">
                          <path d="M2 15 Q12 1 22 15" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => handleCurveStyleChange('slight-down')}
                        className={`flex items-center justify-center w-12 h-10 border-2 rounded-lg transition-all ${
                          curveStyle === 'slight-down' 
                            ? 'border-blue-500 bg-blue-50 text-blue-600' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        title="Slight Curve Down"
                      >
                        <svg width="24" height="16" viewBox="0 0 24 16" className="text-current">
                          <path d="M2 4 Q12 12 22 4" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => handleCurveStyleChange('full-down')}
                        className={`flex items-center justify-center w-12 h-10 border-2 rounded-lg transition-all ${
                          curveStyle === 'full-down' 
                            ? 'border-blue-500 bg-blue-50 text-blue-600' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        title="Full Curve Down"
                      >
                        <svg width="24" height="16" viewBox="0 0 24 16" className="text-current">
                          <path d="M2 1 Q12 15 22 1" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Advanced Controls */}
          <div className="flex items-center px-2 py-2 space-x-1">
            {/* Rotation Control */}
            <button
              ref={rotationRef}
              onClick={() => openPanel('rotation')}
              className={`p-2 rounded-lg transition-colors ${
                activePanel === 'rotation' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
              title="Rotation"
            >
              <RotateCw className="w-4 h-4" />
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
            <div className="relative">
              <button
                ref={flipRef}
                onClick={() => setShowFlipDropdown(!showFlipDropdown)}
                className={`p-2 rounded-lg transition-colors ${
                  showFlipDropdown ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                } ${(isFlippedHorizontal || isFlippedVertical) ? 'bg-blue-100 text-blue-600' : ''}`}
                title="Flip"
              >
                <FlipHorizontal className="w-4 h-4" />
              </button>
              
              {showFlipDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 min-w-[160px]">
                  <button 
                    onClick={handleFlipHorizontal}
                    className={`flex items-center space-x-3 w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors ${
                      isFlippedHorizontal ? 'bg-blue-50 text-blue-600' : ''
                    }`}
                  >
                    <FlipHorizontal className="w-4 h-4" />
                    <span>Flip Horizontal</span>
                  </button>
                  
                  <button 
                    onClick={handleFlipVertical}
                    className={`flex items-center space-x-3 w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors ${
                      isFlippedVertical ? 'bg-blue-50 text-blue-600' : ''
                    }`}
                  >
                    <FlipVertical className="w-4 h-4" />
                    <span>Flip Vertical</span>
                  </button>
                </div>
              )}
            </div>

            {/* Align Control */}
            <button
              ref={alignRef}
              onClick={() => openPanel('align')}
              className={`p-2 rounded-lg transition-colors ${
                activePanel === 'align' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
              title="Align"
            >
              <AlignCenter className="w-4 h-4" />
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

            <button
              ref={spacingRef}
              onClick={() => openPanel('spacing')}
              className={`p-2 rounded-lg transition-colors ${
                activePanel === 'spacing' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
              title="Spacing"
            >
              <SIcon className="w-4 h-4" />
            </button>
            
            <FloatingPanel
              isOpen={activePanel === 'spacing'}
              onClose={closePanel}
              title="Text Spacing"
              anchorRef={spacingRef}
            >
              <div className="space-y-6 w-80">
                <SliderControl
                  label="Line spacing"
                  value={lineSpacing}
                  min={0.5}
                  max={3}
                  step={0.1}
                  onChange={handleLineSpacingChange}
                  onReset={resetLineSpacing}
                  defaultValue={1.4}
                />
                
                <SliderControl
                  label="Letter spacing"
                  value={letterSpacing}
                  min={-5}
                  max={10}
                  step={0.5}
                  unit="px"
                  onChange={handleLetterSpacingChange}
                  onReset={resetLetterSpacing}
                  defaultValue={0}
                />
              </div>
            </FloatingPanel>

            <button
              ref={opacityRef}
              onClick={() => openPanel('opacity')}
              className={`p-2 rounded-lg transition-colors ${
                activePanel === 'opacity' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
              title="Opacity"
            >
              <Eye className="w-4 h-4" />
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

            {/* Layer Control with Dropdown */}
            <div className="relative">
              <button
                ref={layerDropdownRef}
                onClick={() => setShowLayerDropdown(!showLayerDropdown)}
                className={`p-2 rounded-lg transition-colors ${
                  showLayerDropdown ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                }`}
                title="Layer Order"
              >
                <Layers className="w-4 h-4" />
              </button>
              
              {showLayerDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 min-w-[160px]">
                  <button 
                    onClick={() => handleLayerAction('bring-to-front')}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col items-center">
                      <div className="text-xs">↑↑</div>
                    </div>
                    <span>Bring to front</span>
                  </button>
                  
                  <button 
                    onClick={() => handleLayerAction('bring-forward')}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col items-center">
                      <div className="text-xs">↑</div>
                    </div>
                    <span>Bring forward</span>
                  </button>
                  
                  <button 
                    onClick={() => handleLayerAction('send-backward')}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col items-center">
                      <div className="text-xs">↓</div>
                    </div>
                    <span>Send backward</span>
                  </button>
                  
                  <button 
                    onClick={() => handleLayerAction('send-to-back')}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col items-center">
                      <div className="text-xs">↓↓</div>
                    </div>
                    <span>Send to back</span>
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                ref={moreRef}
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className={`p-2 rounded-lg transition-colors ${
                  showMoreMenu ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                }`}
                title="More Options"
              >
                <MoreHorizontal className="w-4 h-4" />
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns and menus */}
      {(showFontDropdown || showSizeDropdown || showMoreMenu || showFormatDropdown || showLayerDropdown || showListDropdown || showFlipDropdown || showAlignmentDropdown) && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowFontDropdown(false);
            setShowSizeDropdown(false);
            setShowMoreMenu(false);
            setShowFormatDropdown(false);
            setShowLayerDropdown(false);
            setShowListDropdown(false);
            setShowFlipDropdown(false);
            setShowAlignmentDropdown(false);
          }}
        />
      )}
    </>
  );
};

export default TextFloatingToolbar;