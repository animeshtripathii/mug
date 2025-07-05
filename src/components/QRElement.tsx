import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { QRElement as QRElementType } from '../types/QRElement';
import { useQRContext } from '../context/QRContext';
import QRFloatingToolbar from './QRFloatingToolbar';

interface QRElementProps {
  element: QRElementType;
}

const QRElement: React.FC<QRElementProps> = ({ element }) => {
  const { updateQRElement, selectQRElement, selectedQRId } = useQRContext();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string>('');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, elementX: 0, elementY: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, elementX: 0, elementY: 0 });
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const elementRef = useRef<HTMLDivElement>(null);

  const isSelected = element.id === selectedQRId;

  // Generate real QR code using qrcode library with custom styling
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        // Base QR code options
        const options = {
          errorCorrectionLevel: element.errorCorrectionLevel,
          type: 'image/png' as const,
          quality: 0.92,
          margin: 1,
          color: {
            dark: element.foregroundColor,
            light: element.backgroundColor,
          },
          width: element.width,
        };

        // Generate base QR code
        const dataURL = await QRCode.toDataURL(element.url, options);
        
        // Apply custom styling if specified
        if (element.cornerStyle && element.cornerStyle !== 'square' || 
            element.dotStyle && element.dotStyle !== 'square' ||
            element.hasIcon) {
          
          // Create a canvas to apply custom styling
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();
          
          img.onload = () => {
            canvas.width = element.width;
            canvas.height = element.height;
            
            // Draw base QR code
            ctx?.drawImage(img, 0, 0, element.width, element.height);
            
            // Apply corner styling
            if (element.cornerStyle && element.cornerStyle !== 'square') {
              applyCornerStyling(ctx, canvas, element.cornerStyle);
            }
            
            // Apply dot styling
            if (element.dotStyle && element.dotStyle !== 'square') {
              applyDotStyling(ctx, canvas, element.dotStyle);
            }
            
            // Add icon if specified
            if (element.hasIcon && element.iconType) {
              addIconToQR(ctx, canvas, element.iconType);
            }
            
            setQrCodeDataURL(canvas.toDataURL());
          };
          
          img.src = dataURL;
        } else {
          setQrCodeDataURL(dataURL);
        }
      } catch (error) {
        console.error('Error generating QR code:', error);
        // Fallback to a simple placeholder
        setQrCodeDataURL('data:image/svg+xml;base64,' + btoa(`
          <svg width="${element.width}" height="${element.height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="${element.backgroundColor}"/>
            <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="12" fill="${element.foregroundColor}">QR Error</text>
          </svg>
        `));
      }
    };

    generateQRCode();
  }, [
    element.url, 
    element.width, 
    element.height, 
    element.foregroundColor, 
    element.backgroundColor, 
    element.errorCorrectionLevel,
    element.cornerStyle,
    element.dotStyle,
    element.hasIcon,
    element.iconType
  ]);

  // Apply corner styling to QR code
  const applyCornerStyling = (ctx: CanvasRenderingContext2D | null, canvas: HTMLCanvasElement, cornerStyle: string) => {
    if (!ctx) return;
    
    // This is a simplified implementation - in a real app you'd need more sophisticated QR code parsing
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Apply corner rounding effect (simplified)
    if (cornerStyle === 'rounded' || cornerStyle === 'extra-rounded' || cornerStyle === 'circle') {
      // Apply corner effects to the finder patterns (corners of QR code)
      // This would require more complex QR code structure analysis in production
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  // Apply dot styling to QR code
  const applyDotStyling = (ctx: CanvasRenderingContext2D | null, canvas: HTMLCanvasElement, dotStyle: string) => {
    if (!ctx) return;
    
    // This is a simplified implementation
    // In production, you'd need to parse the QR code structure and redraw individual modules
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Apply dot styling effects
    if (dotStyle === 'dots' || dotStyle === 'rounded' || dotStyle === 'classy') {
      // Transform square modules to desired shape
      // This would require sophisticated image processing in production
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  // Add icon to QR code center
  const addIconToQR = (ctx: CanvasRenderingContext2D | null, canvas: HTMLCanvasElement, iconType: string) => {
    if (!ctx) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const iconSize = canvas.width * 0.2; // 20% of QR code size
    
    // Clear center area for icon
    ctx.fillStyle = element.backgroundColor;
    ctx.fillRect(centerX - iconSize/2, centerY - iconSize/2, iconSize, iconSize);
    
    // Draw icon based on type
    ctx.fillStyle = element.foregroundColor;
    ctx.font = `${iconSize * 0.6}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    switch (iconType) {
      case 'scan-me':
        ctx.font = `bold ${iconSize * 0.25}px Arial`;
        ctx.fillText('SCAN', centerX, centerY - iconSize * 0.15);
        ctx.fillText('ME', centerX, centerY + iconSize * 0.15);
        break;
      case 'star':
        ctx.fillText('⭐', centerX, centerY);
        break;
      case 'play':
        // Draw play triangle
        ctx.beginPath();
        ctx.moveTo(centerX - iconSize * 0.2, centerY - iconSize * 0.25);
        ctx.lineTo(centerX + iconSize * 0.2, centerY);
        ctx.lineTo(centerX - iconSize * 0.2, centerY + iconSize * 0.25);
        ctx.closePath();
        ctx.fill();
        break;
      case 'qr':
        ctx.fillText('⊞', centerX, centerY);
        break;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    selectQRElement(element.id);
    
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

  const handleResizeMouseDown = (e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setResizeHandle(handle);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: element.width,
      height: element.height,
      elementX: element.x,
      elementY: element.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const canvasElement = document.querySelector('.canvas-area');
      if (!canvasElement) return;

      const canvasRect = canvasElement.getBoundingClientRect();
      const elementWidth = element.width;
      const elementHeight = element.height;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      let newX = dragStart.elementX + deltaX;
      let newY = dragStart.elementY + deltaY;

      newX = Math.max(0, Math.min(canvasRect.width - elementWidth, newX));
      newY = Math.max(0, Math.min(canvasRect.height - elementHeight, newY));

      updateQRElement(element.id, { x: newX, y: newY });
    } else if (isResizing) {
      const canvasElement = document.querySelector('.canvas-area');
      if (!canvasElement) return;

      const canvasRect = canvasElement.getBoundingClientRect();
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      // Maintain square aspect ratio for QR codes
      let newSize = resizeStart.width;
      let newX = resizeStart.elementX;
      let newY = resizeStart.elementY;

      switch (resizeHandle) {
        case 'nw':
          newSize = Math.max(50, Math.min(resizeStart.width - deltaX, resizeStart.height - deltaY));
          newX = Math.max(0, resizeStart.elementX + (resizeStart.width - newSize));
          newY = Math.max(0, resizeStart.elementY + (resizeStart.height - newSize));
          break;
        case 'n':
          newSize = Math.max(50, resizeStart.height - deltaY);
          newY = Math.max(0, resizeStart.elementY + (resizeStart.height - newSize));
          newX = resizeStart.elementX + (resizeStart.width - newSize) / 2;
          break;
        case 'ne':
          newSize = Math.max(50, Math.max(resizeStart.width + deltaX, resizeStart.height - deltaY));
          newY = Math.max(0, resizeStart.elementY + (resizeStart.height - newSize));
          break;
        case 'e':
          newSize = Math.max(50, resizeStart.width + deltaX);
          newY = resizeStart.elementY + (resizeStart.height - newSize) / 2;
          break;
        case 'se':
          newSize = Math.max(50, Math.max(resizeStart.width + deltaX, resizeStart.height + deltaY));
          break;
        case 's':
          newSize = Math.max(50, resizeStart.height + deltaY);
          newX = resizeStart.elementX + (resizeStart.width - newSize) / 2;
          break;
        case 'sw':
          newSize = Math.max(50, Math.max(resizeStart.width - deltaX, resizeStart.height + deltaY));
          newX = Math.max(0, resizeStart.elementX + (resizeStart.width - newSize));
          break;
        case 'w':
          newSize = Math.max(50, resizeStart.width - deltaX);
          newX = Math.max(0, resizeStart.elementX + (resizeStart.width - newSize));
          newY = resizeStart.elementY + (resizeStart.height - newSize) / 2;
          break;
      }

      // Ensure it fits within canvas
      newSize = Math.min(newSize, canvasRect.width - newX);
      newSize = Math.min(newSize, canvasRect.height - newY);

      updateQRElement(element.id, { 
        x: newX,
        y: newY,
        width: newSize, 
        height: newSize 
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

  const elementStyle: React.CSSProperties = {
    position: 'absolute',
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    cursor: isDragging ? 'grabbing' : (isSelected ? 'grab' : 'pointer'),
    userSelect: 'none',
    border: isSelected ? '2px dashed #3b82f6' : '2px dashed transparent',
    borderRadius: '4px',
    transition: isDragging || isResizing ? 'none' : 'all 0.2s ease',
    opacity: (element.opacity || 100) / 100,
    transform: `rotate(${element.rotation || 0}deg)`,
    zIndex: isSelected ? 10 : 1,
  };

  // 8 Anchor Resize Handles Component
  const ResizeHandles = () => (
    <>
      {/* Corner handles */}
      <div 
        className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-nw-resize hover:bg-blue-600 transition-colors shadow-sm"
        style={{ top: -6, left: -6 }}
        onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
      ></div>
      <div 
        className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-ne-resize hover:bg-blue-600 transition-colors shadow-sm"
        style={{ top: -6, right: -6 }}
        onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
      ></div>
      <div 
        className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-sw-resize hover:bg-blue-600 transition-colors shadow-sm"
        style={{ bottom: -6, left: -6 }}
        onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
      ></div>
      <div 
        className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-se-resize hover:bg-blue-600 transition-colors shadow-sm"
        style={{ bottom: -6, right: -6 }}
        onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
      ></div>
      
      {/* Side handles */}
      <div 
        className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-n-resize hover:bg-blue-600 transition-colors shadow-sm"
        style={{ top: -6, left: '50%', transform: 'translateX(-50%)' }}
        onMouseDown={(e) => handleResizeMouseDown(e, 'n')}
      ></div>
      <div 
        className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-s-resize hover:bg-blue-600 transition-colors shadow-sm"
        style={{ bottom: -6, left: '50%', transform: 'translateX(-50%)' }}
        onMouseDown={(e) => handleResizeMouseDown(e, 's')}
      ></div>
      <div 
        className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-w-resize hover:bg-blue-600 transition-colors shadow-sm"
        style={{ top: '50%', left: -6, transform: 'translateY(-50%)' }}
        onMouseDown={(e) => handleResizeMouseDown(e, 'w')}
      ></div>
      <div 
        className="absolute w-3 h-3 bg-blue-500 border border-white rounded-full cursor-e-resize hover:bg-blue-600 transition-colors shadow-sm"
        style={{ top: '50%', right: -6, transform: 'translateY(-50%)' }}
        onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
      ></div>
    </>
  );

  return (
    <>
      <div
        ref={elementRef}
        style={elementStyle}
        onMouseDown={handleMouseDown}
        className="qr-element"
        title={`QR Code: ${element.url}`}
      >
        {qrCodeDataURL && (
          <img
            src={qrCodeDataURL}
            alt={`QR Code for ${element.url}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              pointerEvents: 'none',
              borderRadius: '2px',
            }}
            draggable={false}
          />
        )}
        
        {isSelected && <ResizeHandles />}
      </div>

      {/* Floating Toolbar - Always render when selected */}
      {isSelected && (
        <QRFloatingToolbar 
          isVisible={true} 
          selectedQRId={element.id}
        />
      )}
    </>
  );
};

export default QRElement;