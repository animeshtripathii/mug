import React, { useState, useRef, useEffect } from 'react';
import { Move, RotateCw, Type } from 'lucide-react';
import { TextElement as TextElementType } from '../types/TextElement';
import { useTextContext } from '../context/TextContext';
import TextFloatingToolbar from './TextFloatingToolbar';

interface TextElementProps {
  element: TextElementType;
  highlightEmpty?: boolean;
  onSelect?: (id: string) => void;
}

const TextElement: React.FC<TextElementProps> = ({ element, highlightEmpty = false, onSelect }) => {
  const { updateTextElement, selectTextElement, selectedTextId } = useTextContext();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string>('');
  const [svgPath, setSvgPath] = useState<string>('');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, elementX: 0, elementY: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, elementX: 0, elementY: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(element.text);
  const elementRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isSelected = element.id === selectedTextId;
  const isEmpty = !element.text || element.text.trim() === '';

  // Debug logging
  // Generate SVG path for curved text
  useEffect(() => {
    if (element.curveStyle && element.curveStyle !== 'none') {
      const width = element.width || 200;
      const height = element.height || 50;
      
      let path = '';
      const startX = 0;
      const endX = width;
      const centerY = height / 2;
      
      switch (element.curveStyle) {
        case 'slight-up':
          path = `M ${startX} ${centerY + 8} Q ${width / 2} ${centerY - 15} ${endX} ${centerY + 8}`;
          break;
        case 'medium-up':
          path = `M ${startX} ${centerY + 12} Q ${width / 2} ${centerY - 25} ${endX} ${centerY + 12}`;
          break;
        case 'full-up':
          path = `M ${startX} ${centerY + 18} Q ${width / 2} ${centerY - 35} ${endX} ${centerY + 18}`;
          break;
        case 'slight-down':
          path = `M ${startX} ${centerY - 8} Q ${width / 2} ${centerY + 15} ${endX} ${centerY - 8}`;
          break;
        case 'full-down':
          path = `M ${startX} ${centerY - 18} Q ${width / 2} ${centerY + 35} ${endX} ${centerY - 18}`;
          break;
        default:
          path = `M ${startX} ${centerY} L ${endX} ${centerY}`;
      }
      
      setSvgPath(path);
    } else {
      setSvgPath('');
    }
  }, [element.curveStyle, element.width, element.height]);

  // Render curved text using SVG
  const renderCurvedText = () => {
    if (!element.curveStyle || element.curveStyle === 'none' || !svgPath) {
      return null;
    }

    let displayText = element.text;
    if (element.textCase === 'uppercase') {
      displayText = displayText.toUpperCase();
    } else if (element.textCase === 'lowercase') {
      displayText = displayText.toLowerCase();
    }

    return (
      <svg 
        width="100%" 
        height="100%" 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0,
          overflow: 'visible',
          pointerEvents: 'none'
        }}
        viewBox={`0 0 ${element.width || 200} ${element.height || 50}`}
      >
        <defs>
          <path id={`textPath-${element.id}`} d={svgPath} />
        </defs>
        <text
          fontSize={element.fontSize}
          fontFamily={element.fontFamily}
          fill={element.color}
          fontWeight={element.isBold ? 'bold' : 'normal'}
          fontStyle={element.isItalic ? 'italic' : 'normal'}
          textDecoration={element.isUnderline ? 'underline' : 'none'}
          textAnchor={element.alignment === 'center' ? 'middle' : element.alignment === 'right' ? 'end' : 'start'}
          letterSpacing={element.letterSpacing ? `${element.letterSpacing}px` : 'normal'}
          dominantBaseline="central"
        >
          <textPath 
            href={`#textPath-${element.id}`} 
            startOffset={element.alignment === 'center' ? '50%' : element.alignment === 'right' ? '100%' : '0%'}
          >
            {displayText}
          </textPath>
        </text>
      </svg>
    );
  };

  useEffect(() => {
    console.log('TextElement render:', { 
      elementId: element.id, 
      text: element.text, 
      isSelected, 
      position: `${element.x}, ${element.y}`,
      size: `${element.width}x${element.height}`
    });
  }, [element, isSelected]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Text element clicked, selecting:', element.id);
    
    // Use the onSelect callback if provided, otherwise use context method
    if (onSelect) {
      onSelect(element.id);
    } else {
      selectTextElement(element.id);
    }
    
    const canvasElement = document.querySelector('.canvas-area');
    if (!canvasElement) return;

    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      elementX: element.x,
      elementY: element.y,
    });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
    setEditText(element.text);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const handleResizeMouseDown = (e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setResizeHandle(handle);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: element.width || 200,
      height: element.height || 50,
      elementX: element.x,
      elementY: element.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const canvasElement = document.querySelector('.canvas-area');
      if (!canvasElement) return;

      const canvasRect = canvasElement.getBoundingClientRect();
      const elementWidth = element.width || 200;
      const elementHeight = element.height || 50;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      let newX = dragStart.elementX + deltaX;
      let newY = dragStart.elementY + deltaY;

      newX = Math.max(0, Math.min(canvasRect.width - elementWidth, newX));
      newY = Math.max(0, Math.min(canvasRect.height - elementHeight, newY));

      updateTextElement(element.id, { x: newX, y: newY });
    } else if (isResizing) {
      const canvasElement = document.querySelector('.canvas-area');
      if (!canvasElement) return;

      const canvasRect = canvasElement.getBoundingClientRect();
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newX = resizeStart.elementX;
      let newY = resizeStart.elementY;

      const minWidth = 50;
      const minHeight = 20;

      switch (resizeHandle) {
        case 'nw':
          newWidth = Math.max(minWidth, resizeStart.width - deltaX);
          newHeight = Math.max(minHeight, resizeStart.height - deltaY);
          newX = resizeStart.elementX + (resizeStart.width - newWidth);
          newY = resizeStart.elementY + (resizeStart.height - newHeight);
          break;
        case 'n':
          newHeight = Math.max(minHeight, resizeStart.height - deltaY);
          newY = resizeStart.elementY + (resizeStart.height - newHeight);
          break;
        case 'ne':
          newWidth = Math.max(minWidth, resizeStart.width + deltaX);
          newHeight = Math.max(minHeight, resizeStart.height - deltaY);
          newY = resizeStart.elementY + (resizeStart.height - newHeight);
          break;
        case 'e':
          newWidth = Math.max(minWidth, resizeStart.width + deltaX);
          break;
        case 'se':
          newWidth = Math.max(minWidth, resizeStart.width + deltaX);
          newHeight = Math.max(minHeight, resizeStart.height + deltaY);
          break;
        case 's':
          newHeight = Math.max(minHeight, resizeStart.height + deltaY);
          break;
        case 'sw':
          newWidth = Math.max(minWidth, resizeStart.width - deltaX);
          newHeight = Math.max(minHeight, resizeStart.height + deltaY);
          newX = resizeStart.elementX + (resizeStart.width - newWidth);
          break;
        case 'w':
          newWidth = Math.max(minWidth, resizeStart.width - deltaX);
          newX = resizeStart.elementX + (resizeStart.width - newWidth);
          break;
      }

      newX = Math.max(0, Math.min(canvasRect.width - newWidth, newX));
      newY = Math.max(0, Math.min(canvasRect.height - newHeight, newY));

      if (newX + newWidth > canvasRect.width) {
        newWidth = canvasRect.width - newX;
      }
      if (newY + newHeight > canvasRect.height) {
        newHeight = canvasRect.height - newY;
      }

      updateTextElement(element.id, { 
        x: newX, 
        y: newY, 
        width: newWidth, 
        height: newHeight 
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle('');
  };

  const handleEditSubmit = () => {
    updateTextElement(element.id, { text: editText });
    setIsEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSubmit();
    } else if (e.key === 'Escape') {
      setEditText(element.text);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart, element.x, element.y, element.width, element.height]);

  // Apply text transformations
  let displayText = element.text;
  if (element.textCase === 'uppercase') {
    displayText = displayText.toUpperCase();
  } else if (element.textCase === 'lowercase') {
    displayText = displayText.toLowerCase();
  }

  // Handle list formatting
  if (element.isBulletList || element.isNumberedList) {
    const lines = displayText.split('\n');
    displayText = lines.map((line, index) => {
      if (line.trim()) {
        if (element.isBulletList) {
          return `• ${line}`;
        } else if (element.isNumberedList) {
          return `${index + 1}. ${line}`;
        }
      }
      return line;
    }).join('\n');
  }

  const textStyle: React.CSSProperties = {
    position: 'absolute',
    left: element.x,
    top: element.y,
    width: element.width || 200,
    height: element.height || 50,
    fontSize: element.fontSize,
    fontFamily: element.fontFamily,
    color: element.color,
    fontWeight: element.isBold ? 'bold' : 'normal',
    fontStyle: element.isItalic ? 'italic' : 'normal',
    textDecoration: element.isUnderline ? 'underline' : 'none',
    textAlign: element.alignment,
    lineHeight: element.lineHeight || 1.4,
    letterSpacing: element.letterSpacing ? `${element.letterSpacing}px` : 'normal',
    cursor: isDragging ? 'grabbing' : (isSelected ? 'grab' : 'pointer'),
    userSelect: 'none',
    border: isSelected ? '2px dashed #3b82f6' : (isEmpty && highlightEmpty ? '2px dashed #ef4444' : '2px dashed transparent'),
    borderRadius: '4px',
    padding: '4px',
    transition: isDragging || isResizing ? 'none' : 'all 0.2s ease',
    opacity: (element.opacity || 100) / 100,
    transform: `rotate(${element.rotation || 0}deg) ${element.transform || ''}`,
    zIndex: isSelected ? 10 : 1,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  };

  // 8 Anchor Resize Handles Component
  const ResizeHandles = () => {
    return (
    <>
      {/* Corner handles */}
      <div 
        className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nw-resize hover:bg-blue-600 transition-all duration-200 shadow-lg hover:scale-110"
        style={{ top: -8, left: -8 }}
        onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
      ></div>
      <div 
        className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-ne-resize hover:bg-blue-600 transition-all duration-200 shadow-lg hover:scale-110"
        style={{ top: -8, right: -8 }}
        onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
      ></div>
      <div 
        className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-sw-resize hover:bg-blue-600 transition-all duration-200 shadow-lg hover:scale-110"
        style={{ bottom: -8, left: -8 }}
        onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
      ></div>
      <div 
        className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-se-resize hover:bg-blue-600 transition-all duration-200 shadow-lg hover:scale-110"
        style={{ bottom: -8, right: -8 }}
        onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
      ></div>
      
      {/* Side handles */}
      <div 
        className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-n-resize hover:bg-blue-600 transition-all duration-200 shadow-lg hover:scale-110"
        style={{ top: -8, left: '50%', transform: 'translateX(-50%)' }}
        onMouseDown={(e) => handleResizeMouseDown(e, 'n')}
      ></div>
      <div 
        className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-s-resize hover:bg-blue-600 transition-all duration-200 shadow-lg hover:scale-110"
        style={{ bottom: -8, left: '50%', transform: 'translateX(-50%)' }}
        onMouseDown={(e) => handleResizeMouseDown(e, 's')}
      ></div>
      <div 
        className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-w-resize hover:bg-blue-600 transition-all duration-200 shadow-lg hover:scale-110"
        style={{ top: '50%', left: -8, transform: 'translateY(-50%)' }}
        onMouseDown={(e) => handleResizeMouseDown(e, 'w')}
      ></div>
      <div 
        className="absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-e-resize hover:bg-blue-600 transition-all duration-200 shadow-lg hover:scale-110"
        style={{ top: '50%', right: -8, transform: 'translateY(-50%)' }}
        onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
      ></div>
    </>
    );
  };

  return (
    <>
      <div
        ref={elementRef}
        style={textStyle}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        className="text-element"
        title={`Text: ${element.text}`}
      >
        {/* Render curved text using SVG if curve style is applied */}
        {element.curveStyle && element.curveStyle !== 'none' && !isEditing ? (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {renderCurvedText()}
          </div>
        ) : isEditing ? (
          /* Edit mode input */
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleEditSubmit}
            onKeyDown={handleEditKeyDown}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              color: 'inherit',
              fontWeight: 'inherit',
              fontStyle: 'inherit',
              textAlign: 'inherit',
              padding: '0',
              margin: '0',
            }}
          />
        ) : (
          /* Regular straight text */
          <div style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex',
            alignItems: element.alignment === 'center' ? 'center' : 'flex-start',
            justifyContent: element.alignment === 'center' ? 'center' : element.alignment === 'right' ? 'flex-end' : 'flex-start'
          }}>
            {displayText || (isEmpty ? 'Your Text Here' : '')}
          </div>
        )}
        
        
        {isSelected && <ResizeHandles />}
      </div>

      {/* Element Controls - positioned below the text */}
      {isSelected && (
        <div 
          className="absolute bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 z-20"
          style={{
            left: element.x + (element.width || 200) / 2 - 40,
            top: element.y + (element.height || 50) + 10
          }}
        >
          <div className="flex items-center space-x-2">
            {/* Move tool */}
            <button
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Move"
            >
              <Move className="w-4 h-4 text-gray-600" />
            </button>
            
            {/* Rotate tool */}
            <button
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Rotate"
            >
              <RotateCw className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toolbar - Always render when selected */}
      {isSelected && (
        <TextFloatingToolbar 
          isVisible={true} 
          selectedTextId={element.id}
        />
      )}
    </>
  );
};

export default TextElement;