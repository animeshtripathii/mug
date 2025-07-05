import React, { useState, useEffect, useRef } from 'react';
import { Bold, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Type, Palette, Minus, Plus, ChevronDown, MoreHorizontal, Copy, Trash2, Move3D, Layers, Eye, AlignVerticalJustifyCenter, AlignHorizontalJustifyCenter, AlignVerticalSpaceAround, AlignHorizontalSpaceAround, LineChart, Text as LetterText, MoveUp, MoveDown, Italic, Underline } from 'lucide-react';
import { useTextContext } from '../context/TextContext';
import FloatingPanel, { SliderControl, DropdownControl, ButtonGroupControl } from './FloatingPanel';

interface EnhancedTextPanelProps {
  isActive?: boolean;
}

const EnhancedTextPanel: React.FC<EnhancedTextPanelProps> = ({ isActive = false }) => {
  const { 
    textElements, 
    selectedTextId, 
    addTextElement, 
    updateTextElement, 
    selectTextElement,
    deleteTextElement 
  } = useTextContext();
  
  const [textValue, setTextValue] = useState('');
  const [showToolbar, setShowToolbar] = useState(false);
  const [fontSize, setFontSize] = useState(46);
  const [selectedFont, setSelectedFont] = useState('Arimo');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isBulletList, setIsBulletList] = useState(false);
  const [isNumberedList, setIsNumberedList] = useState(false);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');
  const [textColor, setTextColor] = useState('#000000');
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);

  // Floating panel states
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [lineSpacing, setLineSpacing] = useState(1.2);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [opacity, setOpacity] = useState(100);
  const [layerOrder, setLayerOrder] = useState('front');
  const [textCase, setTextCase] = useState('normal');
  const [curveStyle, setCurveStyle] = useState('none');

  // Refs for panel positioning
  const lineSpacingRef = useRef<HTMLButtonElement>(null);
  const letterSpacingRef = useRef<HTMLButtonElement>(null);
  const opacityRef = useRef<HTMLButtonElement>(null);
  const layerRef = useRef<HTMLButtonElement>(null);
  const alignRef = useRef<HTMLButtonElement>(null);
  const distributeRef = useRef<HTMLButtonElement>(null);
  const moreOptionsRef = useRef<HTMLButtonElement>(null);

  const fonts = ['Arimo', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia'];
  const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 46, 52, 60, 72];

  const selectedElement = textElements.find(el => el.id === selectedTextId);

  // Update local state when a text element is selected
  useEffect(() => {
    if (selectedElement) {
      setTextValue(selectedElement.text);
      setFontSize(selectedElement.fontSize);
      setSelectedFont(selectedElement.fontFamily);
      setIsBold(selectedElement.isBold);
      setIsItalic(selectedElement.isItalic || false);
      setIsUnderline(selectedElement.isUnderline || false);
      setIsBulletList(selectedElement.isBulletList || false);
      setIsNumberedList(selectedElement.isNumberedList || false);
      setAlignment(selectedElement.alignment);
      setTextColor(selectedElement.color);
      setLineSpacing(selectedElement.lineHeight || 1.2);
      setLetterSpacing(selectedElement.letterSpacing || 0);
      setOpacity(selectedElement.opacity || 100);
      setTextCase(selectedElement.textCase || 'normal');
      setCurveStyle(selectedElement.curveStyle || 'none');
      setShowToolbar(true);
    } else {
      setShowToolbar(false);
    }
  }, [selectedElement]);

  const handleTextFocus = () => {
    if (selectedElement) {
      setShowToolbar(true);
    }
  };

  const handleTextBlur = () => {
    setTimeout(() => {
      if (!document.activeElement?.closest('.text-toolbar')) {
        if (!selectedElement) {
          setShowToolbar(false);
        }
      }
    }, 100);
  };

  const handleTextChange = (value: string) => {
    setTextValue(value);
    if (selectedElement) {
      updateTextElement(selectedElement.id, { text: value });
    }
  };

  const handleNewTextField = () => {
    addTextElement(textValue || 'Your Text Here');
    setTextValue('');
  };

  const adjustFontSize = (increment: number) => {
    const newSize = Math.max(8, Math.min(72, fontSize + increment));
    setFontSize(newSize);
    if (selectedElement) {
      updateTextElement(selectedElement.id, { fontSize: newSize });
    }
  };

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
    if (selectedElement) {
      updateTextElement(selectedElement.id, { fontFamily: font });
    }
  };

  const handleSizeChange = (size: number) => {
    setFontSize(size);
    if (selectedElement) {
      updateTextElement(selectedElement.id, { fontSize: size });
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

  const handleBulletListToggle = () => {
    const newBulletList = !isBulletList;
    setIsBulletList(newBulletList);
    if (newBulletList) {
      setIsNumberedList(false);
    }
    if (selectedElement) {
      updateTextElement(selectedElement.id, { 
        isBulletList: newBulletList,
        isNumberedList: newBulletList ? false : selectedElement.isNumberedList
      });
    }
  };

  const handleNumberedListToggle = () => {
    const newNumberedList = !isNumberedList;
    setIsNumberedList(newNumberedList);
    if (newNumberedList) {
      setIsBulletList(false);
    }
    if (selectedElement) {
      updateTextElement(selectedElement.id, { 
        isNumberedList: newNumberedList,
        isBulletList: newNumberedList ? false : selectedElement.isBulletList
      });
    }
  };

  const handleAlignmentChange = (newAlignment: 'left' | 'center' | 'right') => {
    setAlignment(newAlignment);
    if (selectedElement) {
      updateTextElement(selectedElement.id, { alignment: newAlignment });
    }
  };

  const handleColorChange = (color: string) => {
    setTextColor(color);
    if (selectedElement) {
      updateTextElement(selectedElement.id, { color });
    }
  };

  const handleDeleteText = () => {
    if (selectedElement) {
      deleteTextElement(selectedElement.id);
      setTextValue('');
    }
  };

  const openPanel = (panelName: string) => {
    setActivePanel(activePanel === panelName ? null : panelName);
  };

  const closePanel = () => {
    setActivePanel(null);
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

  const handleCenterAlign = () => {
    if (selectedElement) {
      const canvasWidth = 688;
      const canvasHeight = 280;
      const elementWidth = selectedElement.width || 200;
      const elementHeight = selectedElement.height || 50;
      
      const centerX = (canvasWidth - elementWidth) / 2;
      const centerY = (canvasHeight - elementHeight) / 2;
      
      updateTextElement(selectedElement.id, { x: centerX, y: centerY });
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

  const handleTextCaseChange = (caseType: string) => {
    setTextCase(caseType);
    if (selectedElement) {
      updateTextElement(selectedElement.id, { textCase: caseType });
    }
  };

  const handleCurveStyleChange = (curve: string) => {
    setCurveStyle(curve);
    if (selectedElement) {
      updateTextElement(selectedElement.id, { curveStyle: curve });
    }
  };

  return (
    <div className="relative">
      {/* Main Text Panel Card */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Text</h2>
        
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          {selectedElement 
            ? "Edit the selected text below, or double-click on text in your design to edit directly."
            : "Edit your text below, or click on the field you'd like to edit directly on your design."
          }
        </p>

        <div className="mb-6">
          <input
            type="text"
            placeholder={selectedElement ? "Edit selected text" : "Type text here"}
            value={textValue}
            onChange={(e) => handleTextChange(e.target.value)}
            onFocus={handleTextFocus}
            onBlur={handleTextBlur}
            className="w-full text-gray-700 text-lg bg-transparent border-0 border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none pb-2 transition-colors placeholder-gray-400"
            style={{ 
              fontFamily: selectedFont,
              fontSize: `${Math.min(fontSize, 24)}px`,
              fontWeight: isBold ? 'bold' : 'normal',
              fontStyle: isItalic ? 'italic' : 'normal',
              textDecoration: isUnderline ? 'underline' : 'none'
            }}
          />
        </div>

        <button 
          onClick={handleNewTextField}
          className="w-full bg-cyan-400 hover:bg-cyan-500 text-black font-bold py-4 px-6 rounded-full transition-colors text-lg"
        >
          {selectedElement ? 'Add Another Text Field' : 'New Text Field'}
        </button>

        {selectedElement && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Selected: "{selectedElement.text}"</p>
            <button
              onClick={handleDeleteText}
              className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
            >
              Delete Selected Text
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Floating Toolbar */}
      {showToolbar && (selectedElement || textValue) && (
        <div className="text-toolbar absolute top-0 left-full ml-4 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50 min-w-max">
          <div className="flex items-center space-x-2">
            {/* Font Selector */}
            <div className="relative">
              <button
                onClick={() => setShowFontDropdown(!showFontDropdown)}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors min-w-[100px]"
              >
                <span className="text-sm font-medium">{selectedFont}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showFontDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[120px] max-h-48 overflow-y-auto">
                  {fonts.map((font) => (
                    <button
                      key={font}
                      onClick={() => {
                        handleFontChange(font);
                        setShowFontDropdown(false);
                      }}
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Font Size Controls */}
            <button
              onClick={() => adjustFontSize(-2)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowSizeDropdown(!showSizeDropdown)}
                className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors min-w-[60px]"
              >
                <span className="text-sm font-medium">{fontSize}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {showSizeDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                  {fontSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        handleSizeChange(size);
                        setShowSizeDropdown(false);
                      }}
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => adjustFontSize(2)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-300"></div>

            {/* Color Picker */}
            <div className="relative">
              <input
                type="color"
                value={textColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer"
                style={{ backgroundColor: textColor }}
              />
            </div>

            {/* Bold */}
            <button
              onClick={handleBoldToggle}
              className={`p-2 rounded-md transition-colors ${
                isBold ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              <Bold className="w-4 h-4" />
            </button>

            {/* Italic */}
            <button
              onClick={handleItalicToggle}
              className={`p-2 rounded-md transition-colors ${
                isItalic ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              <Italic className="w-4 h-4" />
            </button>

            {/* Underline */}
            <button
              onClick={handleUnderlineToggle}
              className={`p-2 rounded-md transition-colors ${
                isUnderline ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              <Underline className="w-4 h-4" />
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-300"></div>

            {/* Alignment */}
            <button
              onClick={() => handleAlignmentChange('left')}
              className={`p-2 rounded-md transition-colors ${
                alignment === 'left' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleAlignmentChange('center')}
              className={`p-2 rounded-md transition-colors ${
                alignment === 'center' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleAlignmentChange('right')}
              className={`p-2 rounded-md transition-colors ${
                alignment === 'right' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              <AlignRight className="w-4 h-4" />
            </button>

            {/* Lists */}
            <button 
              onClick={handleBulletListToggle}
              className={`p-2 rounded-md transition-colors ${
                isBulletList ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              onClick={handleNumberedListToggle}
              className={`p-2 rounded-md transition-colors ${
                isNumberedList ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-300"></div>

            {/* Enhanced Controls with Floating Panels */}
            <div className="relative">
              <button
                ref={lineSpacingRef}
                onClick={() => openPanel('lineSpacing')}
                className={`p-2 rounded-md transition-colors ${
                  activePanel === 'lineSpacing' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                }`}
                title="Line Spacing"
              >
                <LineChart className="w-4 h-4" />
              </button>
              
              <FloatingPanel
                isOpen={activePanel === 'lineSpacing'}
                onClose={closePanel}
                title="Line Spacing"
                anchorRef={lineSpacingRef}
              >
                <SliderControl
                  label="Spacing"
                  value={lineSpacing}
                  min={0.5}
                  max={3}
                  step={0.1}
                  onChange={handleLineSpacingChange}
                  onReset={() => handleLineSpacingChange(1.2)}
                  defaultValue={1.2}
                />
              </FloatingPanel>
            </div>

            <div className="relative">
              <button
                ref={letterSpacingRef}
                onClick={() => openPanel('letterSpacing')}
                className={`p-2 rounded-md transition-colors ${
                  activePanel === 'letterSpacing' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                }`}
                title="Letter Spacing"
              >
                <LetterText className="w-4 h-4" />
              </button>
              
              <FloatingPanel
                isOpen={activePanel === 'letterSpacing'}
                onClose={closePanel}
                title="Letter Spacing"
                anchorRef={letterSpacingRef}
              >
                <SliderControl
                  label="Spacing"
                  value={letterSpacing}
                  min={-5}
                  max={10}
                  step={0.1}
                  unit="px"
                  onChange={handleLetterSpacingChange}
                  onReset={() => handleLetterSpacingChange(0)}
                  defaultValue={0}
                />
              </FloatingPanel>
            </div>

            <div className="relative">
              <button
                ref={opacityRef}
                onClick={() => openPanel('opacity')}
                className={`p-2 rounded-md transition-colors ${
                  activePanel === 'opacity' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
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
            </div>

            <div className="relative">
              <button
                ref={layerRef}
                onClick={() => openPanel('layer')}
                className={`p-2 rounded-md transition-colors ${
                  activePanel === 'layer' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                }`}
                title="Layer Order"
              >
                <Layers className="w-4 h-4" />
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
                    { value: 'front', label: 'Front', icon: MoveUp },
                    { value: 'back', label: 'Back', icon: MoveDown }
                  ]}
                  value={layerOrder}
                  onChange={setLayerOrder}
                />
              </FloatingPanel>
            </div>

            <div className="relative">
              <button
                ref={alignRef}
                onClick={() => openPanel('align')}
                className={`p-2 rounded-md transition-colors ${
                  activePanel === 'align' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                }`}
                title="Align Center/Middle"
              >
                <AlignVerticalJustifyCenter className="w-4 h-4" />
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
            </div>

            <div className="relative">
              <button
                ref={distributeRef}
                onClick={() => openPanel('distribute')}
                className={`p-2 rounded-md transition-colors ${
                  activePanel === 'distribute' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                }`}
                title="Distribute"
              >
                <AlignHorizontalSpaceAround className="w-4 h-4" />
              </button>
              
              <FloatingPanel
                isOpen={activePanel === 'distribute'}
                onClose={closePanel}
                title="Distribution"
                anchorRef={distributeRef}
              >
                <ButtonGroupControl
                  label="Distribute Elements"
                  options={[
                    { value: 'horizontal', label: 'Horizontal', icon: AlignHorizontalSpaceAround },
                    { value: 'vertical', label: 'Vertical', icon: AlignVerticalSpaceAround }
                  ]}
                  value="horizontal"
                  onChange={() => {}}
                />
              </FloatingPanel>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-300"></div>

            {/* Standard Controls */}
            <button className="p-2 hover:bg-gray-100 rounded-md transition-colors" title="Duplicate">
              <Copy className="w-4 h-4" />
            </button>
            <button 
              onClick={handleDeleteText}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors text-red-500" 
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            
            {/* More Options with Case and Curve */}
            <div className="relative">
              <button 
                ref={moreOptionsRef}
                onClick={() => openPanel('moreOptions')}
                className={`p-2 rounded-md transition-colors ${
                  activePanel === 'moreOptions' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                }`}
                title="More Options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              
              <FloatingPanel
                isOpen={activePanel === 'moreOptions'}
                onClose={closePanel}
                title="More Options"
                anchorRef={moreOptionsRef}
                position="bottom"
              >
                <div className="space-y-4">
                  {/* Case Section */}
                  <div>
                    <span className="text-sm font-medium text-gray-700 mb-2 block">Case</span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleTextCaseChange('normal')}
                        className={`px-3 py-2 text-sm rounded-md transition-colors border ${
                          textCase === 'normal'
                            ? 'bg-blue-100 text-blue-700 border-blue-300 font-semibold'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        Aa
                      </button>
                      <button
                        onClick={() => handleTextCaseChange('lowercase')}
                        className={`px-3 py-2 text-sm rounded-md transition-colors border ${
                          textCase === 'lowercase'
                            ? 'bg-blue-100 text-blue-700 border-blue-300'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                        title="Lowercase"
                      >
                        a↓
                      </button>
                      <button
                        onClick={() => handleTextCaseChange('uppercase')}
                        className={`px-3 py-2 text-sm rounded-md transition-colors border ${
                          textCase === 'uppercase'
                            ? 'bg-blue-100 text-blue-700 border-blue-300'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                        title="Uppercase"
                      >
                        A↑
                      </button>
                    </div>
                  </div>

                  {/* Curve Text Section */}
                  <div>
                    <span className="text-sm font-medium text-gray-700 mb-2 block">Curve text</span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleCurveStyleChange('full-up')}
                        className={`p-2 rounded-md transition-colors border ${
                          curveStyle === 'full-up'
                            ? 'bg-blue-100 text-blue-700 border-blue-300'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                        title="Full curve up"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M2 14 Q8 2 14 14" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleCurveStyleChange('slight-up')}
                        className={`p-2 rounded-md transition-colors border ${
                          curveStyle === 'slight-up'
                            ? 'bg-blue-100 text-blue-700 border-blue-300'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                        title="Slight curve up"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M2 12 Q8 8 14 12" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleCurveStyleChange('none')}
                        className={`p-2 rounded-md transition-colors border ${
                          curveStyle === 'none'
                            ? 'bg-blue-100 text-blue-700 border-blue-300'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                        title="No curve"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M2 8 L14 8" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleCurveStyleChange('slight-down')}
                        className={`p-2 rounded-md transition-colors border ${
                          curveStyle === 'slight-down'
                            ? 'bg-blue-100 text-blue-700 border-blue-300'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                        title="Slight curve down"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M2 4 Q8 8 14 4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleCurveStyleChange('full-down')}
                        className={`p-2 rounded-md transition-colors border ${
                          curveStyle === 'full-down'
                            ? 'bg-blue-100 text-blue-700 border-blue-300'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                        title="Full curve down"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M2 2 Q8 14 14 2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </FloatingPanel>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedTextPanel;