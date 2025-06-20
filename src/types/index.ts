export interface DesignElement {
  id: string;
  type: 'text' | 'image' | 'graphic' | 'qr' | 'table';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  surface: 'front' | 'wrap';
  styles?: {
    // Text styles
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    backgroundColor?: string;
    fontWeight?: 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
    textDecoration?: 'none' | 'underline' | 'line-through';
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    lineHeight?: number;
    letterSpacing?: number;
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    
    // Image styles
    opacity?: number;
    brightness?: number;
    contrast?: number;
    borderRadius?: number;
    border?: string;
    
    // General styles
    boxShadow?: string;
    filter?: string;
  };
  // 3D mapping coordinates (for future 3D integration)
  mapping?: {
    u: number; // UV coordinate U (0-1)
    v: number; // UV coordinate V (0-1)
    scale: number;
    rotation3D?: { x: number; y: number; z: number };
  };
  // Additional properties
  link?: {
    url: string;
    openInNewWindow: boolean;
  };
  altText?: string;
  listType?: 'none' | 'bulleted' | 'numbered';
}

export interface MugOptions {
  size: '11oz' | '15oz';
  type: 'ceramic' | 'travel' | 'latte';
  color: 'white' | 'black' | 'blue' | 'red' | 'green' | 'yellow' | 'pink' | 'purple';
  printType: 'front' | 'both' | 'wraparound';
  quantity: number;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  elements: DesignElement[];
  description: string;
}

export interface DeliveryOption {
  type: 'standard' | 'express' | 'sameday';
  price: number;
  timeline: string;
  available: boolean;
}

export interface CartItem extends MugOptions {
  id: string;
  design: DesignElement[];
  price: number;
  thumbnail: string;
}

export interface GraphicItem {
  id: string;
  name: string;
  category: string;
  svg: string;
  thumbnail: string;
}

export interface QRCodeOptions {
  data: string;
  size: number;
  color: string;
  backgroundColor: string;
  borderRadius: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
}

export interface TableData {
  headers: string[];
  rows: string[][];
  styles: {
    borderColor: string;
    backgroundColor: string;
    headerBackgroundColor: string;
    textAlign: 'left' | 'center' | 'right';
  };
}