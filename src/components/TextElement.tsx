import React, { useState, useRef, useEffect } from 'react';
import { TextElement as TextElementType } from '../types/TextElement';
import { useTextContext } from '../context/TextContext';


interface TextElementProps {
  element: TextElementType;
}

const TextElement: React.FC<TextElementProps> = ({ element }) => {
  const { updateTextElement, selectTextElement, selectedTextId } = useTextContext();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(element.text);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, elementX: 0, elementY: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const elementRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isSelected = element.id === selectedTextId;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    selectTextElement(element.id);
    
    if (e.detail === 2) { // Double click
      setIsEditing(true);
      return;
    }

    // Get canvas bounds for proper constraint calculation
    const canvasElement = document.querySelector('.canvas-area');
    if (!canvasElement) return;

    const canvasRect = canvasElement.getBoundingClientRect();
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      elementX: element.x,
      elementY: element.y,
    });
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
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const canvasElement = document.querySelector('.canvas-area');
      if (!canvasElement) return;

      const canvasRect = canvasElement.getBoundingClientRect();
      const elementWidth = element.width || 200;
      const elementHeight = element.height || 50;

      // Calculate the movement delta
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      // Calculate new position based on original position + delta
      let newX = dragStart.elementX + deltaX;
      let newY = dragStart.elementY + deltaY;

      // Constrain to canvas boundaries
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
      let newX = element.x;
      let newY = element.y;

      switch (resizeHandle) {
        case 'nw':
          newWidth = Math.max(50, resizeStart.width - deltaX);
          newHeight = Math.max(20, resizeStart.height - deltaY);
          newX = Math.max(0, element.x + (resizeStart.width - newWidth));
          newY = Math.max(0, element.y + (resizeStart.height - newHeight));
          break;
        case 'ne':
          newWidth = Math.max(50, Math.min(canvasRect.width - element.x, resizeStart.width + deltaX));
          newHeight = Math.max(20, resizeStart.height - deltaY);
          newY = Math.max(0, element.y + (resizeStart.height - newHeight));
          break;
        case 'sw':
          newWidth = Math.max(50, resizeStart.width - deltaX);
          newHeight = Math.max(20, Math.min(canvasRect.height - element.y, resizeStart.height + deltaY));
          newX = Math.max(0, element.x + (resizeStart.width - newWidth));
          break;
        case 'se':
          newWidth = Math.max(50, Math.min(canvasRect.width - element.x, resizeStart.width + deltaX));
          newHeight = Math.max(20, Math.min(canvasRect.height - element.y, resizeStart.height + deltaY));
          break;
      }

      // Ensure the element doesn't go outside canvas bounds
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

  const handleTextSubmit = () => {
    updateTextElement(element.id, { text: editText || 'Your Text Here' });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTextSubmit();
    } else if (e.key === 'Escape') {
      setEditText(element.text);
      setIsEditing(false);
    }
  };

  const formatText = (text: string) => {
    let formattedText = text;
    
    // Apply text case transformation
    if (element.textCase === 'lowercase') {
      formattedText = formattedText.toLowerCase();
    } else if (element.textCase === 'uppercase') {
      formattedText = formattedText.toUpperCase();
    }
    
    // Apply list formatting
    if (element.isBulletList) {
      return formattedText.split('\n').map(line => line.trim() ? `• ${line}` : line).join('\n');
    } else if (element.isNumberedList) {
      return formattedText.split('\n').map((line, index) => line.trim() ? `${index + 1}. ${line}` : line).join('\n');
    }
    
    return formattedText;
  };

  // Generate SVG path for curved text
  const getCurvePath = (curveType: string, width: number) => {
    const height = 40;
    const midX = width / 2;
    
    switch (curveType) {
      case 'full-up':
        return `M 0 ${height} Q ${midX} 0 ${width} ${height}`;
      case 'slight-up':
        return `M 0 ${height * 0.8} Q ${midX} ${height * 0.4} ${width} ${height * 0.8}`;
      case 'none':
        return `M 0 ${height / 2} L ${width} ${height / 2}`;
      case 'slight-down':
        return `M 0 ${height * 0.2} Q ${midX} ${height * 0.6} ${width} ${height * 0.2}`;
      case 'full-down':
        return `M 0 0 Q ${midX} ${height} ${width} 0`;
      default:
        return `M 0 ${height / 2} L ${width} ${height / 2}`;
    }
  };

  const textStyle: React.CSSProperties = {
    position: 'absolute',
    left: element.x,
    top: element.y,
    width: element.width || 200,
    height: element.height || 'auto',
    minHeight: element.height || 50,
    cursor: isDragging ? 'grabbing' : (isSelected ? 'grab' : 'pointer'),
    userSelect: 'none',
    padding: '8px 12px',
    border: isSelected ? '2px dashed #3b82f6' : '2px dashed transparent',
    borderRadius: '4px',
    backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
    transition: isDragging || isResizing ? 'none' : 'all 0.2s ease',
    opacity: (element.opacity || 100) / 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: element.alignment === 'center' ? 'center' : element.alignment === 'right' ? 'flex-end' : 'flex-start',
    overflow: 'visible',
    zIndex: isSelected ? 10 : 1,
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        onBlur={handleTextSubmit}
        onKeyDown={handleKeyDown}
        style={{
          ...textStyle,
          cursor: 'text',
          background: 'white',
          border: '2px solid #3b82f6',
          outline: 'none',
          fontSize: `${element.fontSize}px`,
          fontFamily: element.fontFamily,
          color: element.color,
          fontWeight: element.isBold ? 'bold' : 'normal',
          fontStyle: element.isItalic ? 'italic' : 'normal',
          textDecoration: element.isUnderline ? 'underline' : 'none',
          textAlign: element.alignment,
          lineHeight: element.lineHeight || 1.2,
          letterSpacing: `${element.letterSpacing || 0}px`,
        }}
      />
    );
  }

  // Render curved text using SVG
  if (element.curveStyle && element.curveStyle !== 'none') {
    const width = element.width || 200;
    const height = Math.max(element.height || 50, 60); // Ensure enough height for curves
    
    return (
      <>
        <div
          ref={elementRef}
          style={textStyle}
          onMouseDown={handleMouseDown}
          className="text-element"
        >
          <svg 
            width={width} 
            height={height} 
            viewBox={`0 0 ${width} ${height}`}
            style={{ overflow: 'visible' }}
          >
            <defs>
              <path
                id={`curve-${element.id}`}
                d={getCurvePath(element.curveStyle, width)}
                fill="none"
                stroke="none"
              />
            </defs>
            <text
              fontSize={element.fontSize}
              fontFamily={element.fontFamily}
              fontWeight={element.isBold ? 'bold' : 'normal'}
              fontStyle={element.isItalic ? 'italic' : 'normal'}
              textDecoration={element.isUnderline ? 'underline' : 'none'}
              fill={element.color}
              letterSpacing={`${element.letterSpacing || 0}px`}
              textAnchor="middle"
            >
              <textPath href={`#curve-${element.id}`} startOffset="50%">
                {formatText(element.text)}
              </textPath>
            </text>
          </svg>
          
          {isSelected && (
            <>
              {/* Resize handles */}
              <div 
                className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full cursor-nw-resize hover:bg-blue-600 transition-colors"
                onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
              ></div>
              <div 
                className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full cursor-ne-resize hover:bg-blue-600 transition-colors"
                onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
              ></div>
              <div 
                className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 rounded-full cursor-sw-resize hover:bg-blue-600 transition-colors"
                onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
              ></div>
              <div 
                className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize hover:bg-blue-600 transition-colors"
                onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
              ></div>
              
              {/* Move cursor indicator */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-6 h-6 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Floating Toolbar - Always render when selected */}
    
      </>
    );
  }

  // Render normal text
  return (
    <>
      <div
        ref={elementRef}
        style={{
          ...textStyle,
          fontSize: `${element.fontSize}px`,
          fontFamily: element.fontFamily,
          color: element.color,
          fontWeight: element.isBold ? 'bold' : 'normal',
          fontStyle: element.isItalic ? 'italic' : 'normal',
          textDecoration: element.isUnderline ? 'underline' : 'none',
          textAlign: element.alignment,
          lineHeight: element.lineHeight || 1.2,
          letterSpacing: `${element.letterSpacing || 0}px`,
          whiteSpace: 'pre-wrap',
        }}
        onMouseDown={handleMouseDown}
        className="text-element"
      >
        {formatText(element.text)}
        {isSelected && (
          <>
            {/* Resize handles */}
            <div 
              className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full cursor-nw-resize hover:bg-blue-600 transition-colors"
              onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
            ></div>
            <div 
              className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full cursor-ne-resize hover:bg-blue-600 transition-colors"
              onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
            ></div>
            <div 
              className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 rounded-full cursor-sw-resize hover:bg-blue-600 transition-colors"
              onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
            ></div>
            <div 
              className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize hover:bg-blue-600 transition-colors"
              onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
            ></div>
            
            {/* Move cursor indicator */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-6 h-6 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Floating Toolbar - Always render when selected */}
   
    </>
  );
};

export default TextElement;