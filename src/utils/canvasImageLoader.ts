import { TextElement } from '../types/TextElement';
import { ImageElement } from '../types/ImageElement';
import { GraphicElement } from '../types/GraphicElement';
import { QRElement } from '../types/QRElement';
import QRCode from 'qrcode';
import { parseCSSTransform, applyTransformToContext } from './transformUtils';

interface CanvasToImageOptions {
  textElements: TextElement[];
  imageElements: ImageElement[];
  graphicElements: GraphicElement[];
  qrElements: QRElement[];
  canvasSize: { width: number; height: number };
  canvasBackgroundColor: string;
}

export async function createCanvasFromImage(options: CanvasToImageOptions): Promise<string | null> {
  const {
    textElements,
    imageElements,
    graphicElements,
    qrElements,
    canvasSize,
    canvasBackgroundColor
  } = options;



  try {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Set canvas size to higher resolution for better quality
    const scale = 4; // 4x resolution for ultra-crisp textures on 3D models
    canvas.width = canvasSize.width * scale;
    canvas.height = canvasSize.height * scale;
    
    // Scale the context to maintain proper proportions
    ctx.scale(scale, scale);
    
    // Improve rendering quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Fill with background color
    ctx.fillStyle = canvasBackgroundColor;
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

    // Helper function to apply transformations
    const applyTransform = (element: any, callback: () => void) => {
      ctx.save();
      
      // Calculate center point for transformations
      const centerX = element.x + (element.width || 0) / 2;
      const centerY = element.y + (element.height || 0) / 2;
      
      // Parse and apply all transformations
      const transform = parseCSSTransform(element.transform || '');
      transform.rotation = element.rotation || transform.rotation;
      transform.opacity = element.opacity;
      
      applyTransformToContext(ctx, transform, centerX, centerY);
      
      callback();
      ctx.restore();
    };

    // Render graphics first (background layer)
    for (const graphic of graphicElements) {
      applyTransform(graphic, () => {
        ctx.fillStyle = graphic.fillColor || '#000000';
        
        if (graphic.strokeWidth && graphic.strokeWidth > 0) {
          ctx.strokeStyle = graphic.strokeColor || '#000000';
          ctx.lineWidth = graphic.strokeWidth;
          
          // Set stroke style
          if (graphic.strokeStyle === 'dashed') {
            ctx.setLineDash([5, 5]);
          } else if (graphic.strokeStyle === 'dotted') {
            ctx.setLineDash([2, 2]);
          } else {
            ctx.setLineDash([]);
          }
        }
        
        const x = graphic.x;
        const y = graphic.y;
        const width = graphic.width;
        const height = graphic.height;
        
        // Draw different shapes
        ctx.beginPath();
        
        if (graphic.type === 'circle') {
          ctx.arc(x + width / 2, y + height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI);
        } else if (graphic.type === 'rectangle') {
          ctx.rect(x, y, width, height);
        } else if (graphic.type === 'triangle') {
          ctx.moveTo(x + width / 2, y);
          ctx.lineTo(x + width, y + height);
          ctx.lineTo(x, y + height);
          ctx.closePath();
        } else if (graphic.type === 'star') {
          // Draw star shape
          const centerX = x + width / 2;
          const centerY = y + height / 2;
          const outerRadius = Math.min(width, height) / 2;
          const innerRadius = outerRadius * 0.4;
          const spikes = 5;
          
          for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / spikes;
            const pointX = centerX + Math.cos(angle) * radius;
            const pointY = centerY + Math.sin(angle) * radius;
            
            if (i === 0) {
              ctx.moveTo(pointX, pointY);
            } else {
              ctx.lineTo(pointX, pointY);
            }
          }
          ctx.closePath();
        } else if (graphic.type === 'heart') {
          // Draw heart shape
          const centerX = x + width / 2;
          const centerY = y + height / 2;
          const scale = Math.min(width, height) / 100;
          
          ctx.moveTo(centerX, centerY + 20 * scale);
          ctx.bezierCurveTo(centerX, centerY + 10 * scale, centerX - 20 * scale, centerY - 10 * scale, centerX - 20 * scale, centerY - 20 * scale);
          ctx.bezierCurveTo(centerX - 20 * scale, centerY - 30 * scale, centerX, centerY - 30 * scale, centerX, centerY - 20 * scale);
          ctx.bezierCurveTo(centerX, centerY - 30 * scale, centerX + 20 * scale, centerY - 30 * scale, centerX + 20 * scale, centerY - 20 * scale);
          ctx.bezierCurveTo(centerX + 20 * scale, centerY - 10 * scale, centerX, centerY + 10 * scale, centerX, centerY + 20 * scale);
        } else if (graphic.type === 'line') {
          ctx.moveTo(x, y + height / 2);
          ctx.lineTo(x + width, y + height / 2);
        }
        
        // Handle icons and clipart
        if (graphic.isIcon && graphic.iconType) {
          const iconMap: { [key: string]: string } = {
            'sun': '☀️', 'moon': '🌙', 'cloud': '☁️', 'umbrella': '☂️',
            'tree': '🌳', 'flower': '🌸', 'leaf': '🍃', 'apple': '🍎',
            'phone': '📱', 'mail': '✉️', 'camera': '📷', 'music': '🎵',
            'lightbulb': '💡', 'rocket': '🚀', 'globe': '🌍', 'compass': '🧭',
            'home': '🏠', 'coffee': '☕', 'gift': '🎁', 'crown': '👑',
            'key': '🔑', 'lock': '🔒', 'bell': '🔔', 'clock': '🕐',
            'car': '🚗', 'plane': '✈️', 'ship': '🚢', 'bike': '🚲'
          };
          const iconSymbol = iconMap[graphic.iconType] || '❓';
          ctx.font = `${Math.min(width, height) * 0.8}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(iconSymbol, x + width / 2, y + height / 2);
        } else if (graphic.isClipart && graphic.emoji) {
          ctx.font = `${Math.min(width, height) * 0.8}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(graphic.emoji, x + width / 2, y + height / 2);
        } else {
          // Fill and stroke regular shapes
          ctx.fill();
          if (graphic.strokeWidth && graphic.strokeWidth > 0) {
            ctx.stroke();
          }
        }
      });
    }

    // Render images
    for (const image of imageElements) {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = image.src;
        });
        
        applyTransform(image, () => {
          // Apply filters if present
          if (image.filter && image.filter !== 'none') {
            ctx.filter = image.filter;
          }
          
          // Apply clip path if present
          if (image.clipPath && image.clipPath !== 'none') {
            ctx.save();
            if (image.clipPath.includes('circle')) {
              ctx.beginPath();
              ctx.arc(
                image.x + image.width / 2,
                image.y + image.height / 2,
                Math.min(image.width, image.height) / 2,
                0,
                2 * Math.PI
              );
              ctx.clip();
            }
          }
          
          // Calculate adjusted position and dimensions for flipped images
          let drawX = image.x;
          let drawY = image.y;
          let drawWidth = image.width;
          let drawHeight = image.height;
          
          // Adjust position for horizontal flip
          if (image.transform && image.transform.includes('scaleX(-1)')) {
            drawX = image.x + image.width;
            drawWidth = -image.width;
          }
          
          // Adjust position for vertical flip
          if (image.transform && image.transform.includes('scaleY(-1)')) {
            drawY = image.y + image.height;
            drawHeight = -image.height;
          }
          
          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
          
          if (image.clipPath && image.clipPath !== 'none') {
            ctx.restore();
          }
          
          ctx.filter = 'none';
        });
      } catch (error) {
        console.error('Error loading image:', error);
      }
    }

    // Render QR codes
    for (const qr of qrElements) {
      try {
        // Generate QR code with all styling applied
        let qrDataUrl = await QRCode.toDataURL(qr.url, {
          color: {
            dark: qr.foregroundColor,
            light: qr.backgroundColor,
          },
          errorCorrectionLevel: qr.errorCorrectionLevel,
          margin: 1,
        });

        // Apply custom styling if needed
        if (qr.cornerStyle !== 'square' || 
            qr.dotStyle !== 'square' ||
            qr.hasIcon ||
            qr.customText ||
            qr.centerPattern !== 'none' ||
            qr.backgroundPattern !== 'none') {
          
          qrDataUrl = await applyQRCustomStyling(qrDataUrl, qr);
        }
        
        const img = new Image();
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('Failed to load QR code'));
          img.src = qrDataUrl;
        });
        
        applyTransform(qr, () => {
          ctx.drawImage(img, qr.x, qr.y, qr.width, qr.height);
        });
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    }

    // Render text elements (top layer)
    for (const text of textElements) {
      applyTransform(text, () => {
        // Set text properties
        const fontSize = text.fontSize;
        let fontWeight = text.isBold ? 'bold' : 'normal';
        let fontStyle = text.isItalic ? 'italic' : 'normal';
        
        ctx.fillStyle = text.color;
        ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${text.fontFamily}`;
        ctx.textAlign = text.alignment === 'center' ? 'center' : text.alignment === 'right' ? 'end' : 'start';
        ctx.textBaseline = 'top';
        

        
        // Handle text case
        let displayText = text.text;
        if (text.textCase === 'uppercase') {
          displayText = displayText.toUpperCase();
        } else if (text.textCase === 'lowercase') {
          displayText = displayText.toLowerCase();
        }
        
        // Handle list formatting
        if (text.isBulletList || text.isNumberedList) {
          const lines = displayText.split('\n');
          displayText = lines.map((line, index) => {
            if (line.trim()) {
              if (text.isBulletList) {
                return `• ${line}`;
              } else if (text.isNumberedList) {
                return `${index + 1}. ${line}`;
              }
            }
            return line;
          }).join('\n');
        }
        
        // Calculate text position
        const textX = text.alignment === 'center' ? text.x + (text.width || 200) / 2 : 
                     text.alignment === 'right' ? text.x + (text.width || 200) : text.x;
        
        // Handle multi-line text
        const lines = displayText.split('\n');
        const lineHeight = fontSize * (text.lineHeight || 1.2);
        
        // Handle curve text effect
        if (text.curveStyle && text.curveStyle !== 'none') {
          // For curved text, we'll draw each character individually with slight rotation
          const textWidth = ctx.measureText(displayText).width;
          
          lines.forEach((line, lineIndex) => {
            const baseY = text.y + (lineIndex * lineHeight);
            const lineWidth = ctx.measureText(line).width;
            const startX = textX - (text.alignment === 'center' ? lineWidth / 2 : 0);
            let currentX = 0;
            
            // Calculate curve parameters based on style
            let curveIntensity = 0;
            let curveRadius = 0;
            switch (text.curveStyle) {
              case 'slight-up':
                curveIntensity = 0.1;
                curveRadius = lineWidth * 2;
                break;
              case 'medium-up':
                curveIntensity = 0.2;
                curveRadius = lineWidth * 1.5;
                break;
              case 'full-up':
                curveIntensity = 0.3;
                curveRadius = lineWidth * 1.2;
                break;
              case 'slight-down':
                curveIntensity = -0.1;
                curveRadius = lineWidth * 2;
                break;
              case 'full-down':
                curveIntensity = -0.3;
                curveRadius = lineWidth * 1.2;
                break;
            }
            
            for (let i = 0; i < line.length; i++) {
              const t = currentX / lineWidth;
              const char = line[i];
              const charWidth = ctx.measureText(char).width;
              
              // Calculate position on curve (circular arc)
              const angle = (t - 0.5) * Math.PI * curveIntensity;
              const radius = curveRadius;
              const x = startX + currentX;
              const y = baseY + Math.sin(angle) * radius * curveIntensity;
              
              // Calculate rotation for curved text (tangent to the curve)
              const rotationAngle = Math.cos(angle) * curveIntensity * 0.8;
              
              ctx.save();
              ctx.translate(x + charWidth / 2, y);
              ctx.rotate(rotationAngle);
              ctx.fillText(char, -charWidth / 2, 0);
              ctx.restore();
              
              currentX += charWidth + (text.letterSpacing || 0);
            }
          });
        } else {
          lines.forEach((line, index) => {
            const y = text.y + (index * lineHeight);
            
            // Apply letter spacing if needed
            if (text.letterSpacing && text.letterSpacing !== 0) {
              // Manual letter spacing
              let currentX = textX;
              for (let i = 0; i < line.length; i++) {
                ctx.fillText(line[i], currentX, y);
                currentX += ctx.measureText(line[i]).width + text.letterSpacing;
              }
            } else {
              ctx.fillText(line, textX, y);
            }
            
            // Draw underline if needed
            if (text.isUnderline) {
              const textWidth = ctx.measureText(line).width;
              const underlineY = y + fontSize + 2;
              const underlineX = text.alignment === 'center' ? textX - textWidth / 2 : 
                               text.alignment === 'right' ? textX - textWidth : textX;
              
              ctx.beginPath();
              ctx.moveTo(underlineX, underlineY);
              ctx.lineTo(underlineX + textWidth, underlineY);
              ctx.strokeStyle = text.color;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          });
        }
      });
    }

    // Convert canvas to data URL
    const dataUrl = canvas.toDataURL('image/png', 1.0); // Maximum quality PNG
    
    console.log('Canvas texture generated successfully', {
      dimensions: `${canvas.width}x${canvas.height} (${scale}x scale)`,
      elements: {
        text: textElements.length,
        images: imageElements.length,
        graphics: graphicElements.length,
        qr: qrElements.length
      }
    });

    return dataUrl;
  } catch (error) {
    console.error('Error creating canvas image:', error);
    return null;
  }
}

// Helper function to apply QR custom styling
async function applyQRCustomStyling(baseDataUrl: string, qrElement: QRElement): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(baseDataUrl);
      return;
    }

    canvas.width = qrElement.width;
    canvas.height = qrElement.height;

    const img = new Image();
    img.onload = () => {
      // Draw base QR code
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Apply custom styling
      if (qrElement.centerPattern && qrElement.centerPattern !== 'none') {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const size = Math.min(canvas.width, canvas.height) * 0.2;

        ctx.fillStyle = qrElement.backgroundColor;
        
        switch (qrElement.centerPattern) {
          case 'circle':
            ctx.beginPath();
            ctx.arc(centerX, centerY, size / 2, 0, 2 * Math.PI);
            ctx.fill();
            break;
          case 'square':
            ctx.fillRect(centerX - size / 2, centerY - size / 2, size, size);
            break;
        }
      }

      // Add custom text
      if (qrElement.showCustomText && qrElement.customText) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const fontSize = Math.min(canvas.width, canvas.height) * 0.08;

        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Add background for text
        const textMetrics = ctx.measureText(qrElement.customText);
        const textWidth = textMetrics.width;
        const padding = 8;

        ctx.fillStyle = qrElement.backgroundColor;
        ctx.fillRect(
          centerX - textWidth / 2 - padding,
          centerY - fontSize / 2 - padding / 2,
          textWidth + padding * 2,
          fontSize + padding
        );

        ctx.fillStyle = qrElement.foregroundColor;
        ctx.fillText(qrElement.customText, centerX, centerY);
      }

      // Add icon
      if (qrElement.hasIcon && qrElement.iconType && qrElement.iconType !== 'none') {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const iconSize = Math.min(canvas.width, canvas.height) * 0.15;

        // Add background for icon
        ctx.fillStyle = qrElement.backgroundColor;
        ctx.beginPath();
        ctx.arc(centerX, centerY, iconSize / 2 + 4, 0, 2 * Math.PI);
        ctx.fill();

        if (qrElement.iconType === 'custom-logo' && qrElement.logoUrl) {
          const logoImg = new Image();
          logoImg.onload = () => {
            ctx.drawImage(
              logoImg,
              centerX - iconSize / 2,
              centerY - iconSize / 2,
              iconSize,
              iconSize
            );
            resolve(canvas.toDataURL('image/png', 0.92));
          };
          logoImg.src = qrElement.logoUrl;
          return;
        } else {
          // Draw icon symbol
          const iconMap: { [key: string]: string } = {
            'star': '⭐',
            'heart': '❤️',
            'wifi': '📶',
            'phone': '📱',
            'mail': '✉️',
            'home': '🏠',
            'check': '✓'
          };

          const iconSymbol = iconMap[qrElement.iconType] || '🎯';
          ctx.font = `${iconSize * 0.8}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(iconSymbol, centerX, centerY);
        }
      }

      resolve(canvas.toDataURL('image/png', 0.92));
    };
    img.src = baseDataUrl;
  });
}