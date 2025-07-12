// Transform utilities for canvas elements and 3D model mapping

export interface TransformMatrix {
  a: number; // scaleX
  b: number; // skewY
  c: number; // skewX
  d: number; // scaleY
  e: number; // translateX
  f: number; // translateY
}

export interface ElementTransform {
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  translateX?: number;
  translateY?: number;
  skewX?: number;
  skewY?: number;
  opacity?: number;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
}

// Parse CSS transform string into structured format
export function parseCSSTransform(transformString: string): ElementTransform {
  const transform: ElementTransform = {};
  
  if (!transformString) return transform;
  
  // Parse matrix transform
  const matrixMatch = transformString.match(/matrix\(([^)]+)\)/);
  if (matrixMatch) {
    const values = matrixMatch[1].split(',').map(v => parseFloat(v.trim()));
    if (values.length === 6 && values.every(v => !isNaN(v))) {
      transform.scaleX = values[0];
      transform.skewY = values[1];
      transform.skewX = values[2];
      transform.scaleY = values[3];
      transform.translateX = values[4];
      transform.translateY = values[5];
    }
  }
  
  // Parse individual transforms
  const rotateMatch = transformString.match(/rotate\(([^)]+)\)/);
  if (rotateMatch) {
    const value = parseFloat(rotateMatch[1]);
    if (!isNaN(value)) {
      transform.rotation = value;
    }
  }
  
  const scaleMatch = transformString.match(/scale\(([^)]+)\)/);
  if (scaleMatch) {
    const values = scaleMatch[1].split(',').map(v => parseFloat(v.trim()));
    if (values.length >= 1 && !isNaN(values[0])) {
      transform.scaleX = values[0];
      transform.scaleY = values[1] || values[0];
    }
  }
  
  const scaleXMatch = transformString.match(/scaleX\(([^)]+)\)/);
  if (scaleXMatch) {
    const value = parseFloat(scaleXMatch[1]);
    if (!isNaN(value)) {
      transform.scaleX = value;
      if (value === -1) transform.flipHorizontal = true;
    }
  }
  
  const scaleYMatch = transformString.match(/scaleY\(([^)]+)\)/);
  if (scaleYMatch) {
    const value = parseFloat(scaleYMatch[1]);
    if (!isNaN(value)) {
      transform.scaleY = value;
      if (value === -1) transform.flipVertical = true;
    }
  }
  
  const translateMatch = transformString.match(/translate\(([^)]+)\)/);
  if (translateMatch) {
    const values = translateMatch[1].split(',').map(v => parseFloat(v.trim()));
    if (values.length >= 1 && !isNaN(values[0])) {
      transform.translateX = values[0];
      transform.translateY = values[1] || 0;
    }
  }
  
  const skewXMatch = transformString.match(/skewX\(([^)]+)\)/);
  if (skewXMatch) {
    const value = parseFloat(skewXMatch[1]);
    if (!isNaN(value)) {
      transform.skewX = value;
    }
  }
  
  const skewYMatch = transformString.match(/skewY\(([^)]+)\)/);
  if (skewYMatch) {
    const value = parseFloat(skewYMatch[1]);
    if (!isNaN(value)) {
      transform.skewY = value;
    }
  }
  
  return transform;
}

// Convert ElementTransform to CSS transform string
export function toCSSTransform(transform: ElementTransform): string {
  const parts: string[] = [];
  
  if (transform.translateX !== undefined || transform.translateY !== undefined) {
    const x = transform.translateX || 0;
    const y = transform.translateY || 0;
    parts.push(`translate(${x}px, ${y}px)`);
  }
  
  if (transform.rotation !== undefined) {
    parts.push(`rotate(${transform.rotation}deg)`);
  }
  
  if (transform.scaleX !== undefined || transform.scaleY !== undefined) {
    const x = transform.scaleX ?? 1;
    const y = transform.scaleY ?? 1;
    if (x === y) {
      parts.push(`scale(${x})`);
    } else {
      parts.push(`scale(${x}, ${y})`);
    }
  }
  
  if (transform.skewX !== undefined || transform.skewY !== undefined) {
    const x = transform.skewX || 0;
    const y = transform.skewY || 0;
    if (x === 0 && y === 0) {
      // No skew
    } else if (x === 0) {
      parts.push(`skewY(${y}deg)`);
    } else if (y === 0) {
      parts.push(`skewX(${x}deg)`);
    } else {
      parts.push(`skew(${x}deg, ${y}deg)`);
    }
  }
  
  return parts.join(' ');
}

// Apply transform to canvas context
export function applyTransformToContext(
  ctx: CanvasRenderingContext2D, 
  transform: ElementTransform, 
  centerX: number, 
  centerY: number
): void {
  ctx.save();
  
  // Apply opacity
  if (transform.opacity !== undefined) {
    ctx.globalAlpha = transform.opacity / 100;
  }
  
  // Move to center for transformations
  ctx.translate(centerX, centerY);
  
  // Apply rotation
  if (transform.rotation !== undefined) {
    ctx.rotate((transform.rotation * Math.PI) / 180);
  }
  
  // Apply scaling (including flips)
  if (transform.scaleX !== undefined || transform.scaleY !== undefined) {
    const scaleX = transform.scaleX ?? 1;
    const scaleY = transform.scaleY ?? 1;
    ctx.scale(scaleX, scaleY);
  }
  
  // Apply skew
  if (transform.skewX !== undefined || transform.skewY !== undefined) {
    const skewX = transform.skewX || 0;
    const skewY = transform.skewY || 0;
    if (skewX !== 0 || skewY !== 0) {
      ctx.transform(
        1, Math.tan(skewY * Math.PI / 180),
        Math.tan(skewX * Math.PI / 180), 1,
        0, 0
      );
    }
  }
  
  // Move back from center
  ctx.translate(-centerX, -centerY);
  
  // Apply translation
  if (transform.translateX !== undefined || transform.translateY !== undefined) {
    ctx.translate(transform.translateX || 0, transform.translateY || 0);
  }
}

// Calculate bounding box after transformation
export function getTransformedBoundingBox(
  x: number, 
  y: number, 
  width: number, 
  height: number, 
  transform: ElementTransform
): { x: number; y: number; width: number; height: number } {
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  
  // Create transformation matrix
  const matrix = new DOMMatrix();
  
  // Apply transformations in order
  if (transform.translateX !== undefined || transform.translateY !== undefined) {
    matrix.translateSelf(transform.translateX || 0, transform.translateY || 0);
  }
  
  if (transform.rotation !== undefined) {
    matrix.rotateSelf(transform.rotation);
  }
  
  if (transform.scaleX !== undefined || transform.scaleY !== undefined) {
    matrix.scaleSelf(transform.scaleX ?? 1, transform.scaleY ?? 1);
  }
  
  if (transform.skewX !== undefined || transform.skewY !== undefined) {
    matrix.skewXSelf(transform.skewX || 0);
    matrix.skewYSelf(transform.skewY || 0);
  }
  
  // Transform the four corners
  const corners = [
    { x: x, y: y },
    { x: x + width, y: y },
    { x: x + width, y: y + height },
    { x: x, y: y + height }
  ];
  
  const transformedCorners = corners.map(corner => {
    const point = new DOMPoint(corner.x, corner.y);
    const transformed = point.matrixTransform(matrix);
    return { x: transformed.x, y: transformed.y };
  });
  
  // Calculate bounding box
  const minX = Math.min(...transformedCorners.map(p => p.x));
  const maxX = Math.max(...transformedCorners.map(p => p.x));
  const minY = Math.min(...transformedCorners.map(p => p.y));
  const maxY = Math.max(...transformedCorners.map(p => p.y));
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}

// Check if element is flipped
export function isElementFlipped(transform: ElementTransform): { horizontal: boolean; vertical: boolean } {
  return {
    horizontal: transform.flipHorizontal || transform.scaleX === -1,
    vertical: transform.flipVertical || transform.scaleY === -1
  };
}

// Create a combined transform from multiple transforms
export function combineTransforms(...transforms: ElementTransform[]): ElementTransform {
  const combined: ElementTransform = {};
  
  for (const transform of transforms) {
    if (transform.rotation !== undefined) {
      combined.rotation = (combined.rotation || 0) + transform.rotation;
    }
    if (transform.scaleX !== undefined) {
      combined.scaleX = (combined.scaleX || 1) * transform.scaleX;
    }
    if (transform.scaleY !== undefined) {
      combined.scaleY = (combined.scaleY || 1) * transform.scaleY;
    }
    if (transform.translateX !== undefined) {
      combined.translateX = (combined.translateX || 0) + transform.translateX;
    }
    if (transform.translateY !== undefined) {
      combined.translateY = (combined.translateY || 0) + transform.translateY;
    }
    if (transform.skewX !== undefined) {
      combined.skewX = (combined.skewX || 0) + transform.skewX;
    }
    if (transform.skewY !== undefined) {
      combined.skewY = (combined.skewY || 0) + transform.skewY;
    }
    if (transform.opacity !== undefined) {
      combined.opacity = Math.min(100, Math.max(0, (combined.opacity || 100) * transform.opacity / 100));
    }
  }
  
  return combined;
} 