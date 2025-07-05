export interface GraphicElement {
  id: string;
  type: 'circle' | 'rectangle' | 'triangle' | 'star' | 'polygon';
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  rotation?: number;
  opacity?: number;
  isSelected: boolean;
  locked?: boolean;
  groupId?: string;
}