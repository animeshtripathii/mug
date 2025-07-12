import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TextElement } from '../types/TextElement';

interface TextContextType {
  textElements: TextElement[];
  selectedTextId: string | null;
  addTextElement: (text: string) => void;
  updateTextElement: (id: string, updates: Partial<TextElement>) => void;
  selectTextElement: (id: string | null) => void;
  deleteTextElement: (id: string) => void;
  duplicateTextElement: (id: string) => void;
}

const TextContext = createContext<TextContextType | undefined>(undefined);

interface TextProviderProps {
  children: ReactNode;
}

export const TextProvider: React.FC<TextProviderProps> = ({ children }) => {
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);

  const addTextElement = (text: string) => {
    // Canvas dimensions for proper positioning
    const canvasWidth = 688;
    const canvasHeight = 280;
    
    // Calculate center position
    const elementWidth = Math.min(400, canvasWidth * 0.8); // Wider default text width
    const elementHeight = 60; // Slightly taller default text height
    const centerX = (canvasWidth - elementWidth) / 2;
    const centerY = (canvasHeight - elementHeight) / 2;
    
    const newElement: TextElement = {
      id: `text-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: text || 'Your Text Here',
      x: centerX,
      y: centerY,
      width: elementWidth,
      height: elementHeight,
      fontSize: 46,
      fontFamily: 'Arimo',
      color: '#000000',
      isBold: false,
      isItalic: false,
      isUnderline: false,
      alignment: 'left',
      isSelected: true,
      lineHeight: 1.4,
      letterSpacing: 0,
      opacity: 100,
      rotation: 0,
      textCase: 'normal',
      curveStyle: 'none',
    };
    setTextElements(prev => [...prev, newElement]);
    setSelectedTextId(newElement.id);
    console.log('Text element added:', newElement);
  };

  const updateTextElement = (id: string, updates: Partial<TextElement>) => {
    setTextElements(prev =>
      prev.map(element =>
        element.id === id ? { ...element, ...updates } : element
      )
    );
  };

  const selectTextElement = (id: string | null) => {
    setSelectedTextId(id);
  };

  const deleteTextElement = (id: string) => {
    setTextElements(prev => prev.filter(element => element.id !== id));
    if (selectedTextId === id) {
      setSelectedTextId(null);
    }
  };

  const duplicateTextElement = (id: string) => {
    const elementToDuplicate = textElements.find(element => element.id === id);
    if (elementToDuplicate) {
      const duplicatedElement: TextElement = {
        ...elementToDuplicate,
        id: `text-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        x: elementToDuplicate.x + 20,
        y: elementToDuplicate.y + 20,
      };
      setTextElements(prev => [...prev, duplicatedElement]);
      setSelectedTextId(duplicatedElement.id);
    }
  };

  const value: TextContextType = {
    textElements,
    selectedTextId,
    addTextElement,
    updateTextElement,
    selectTextElement,
    deleteTextElement,
    duplicateTextElement,
  };

  return (
    <TextContext.Provider value={value}>
      {children}
    </TextContext.Provider>
  );
};

export const useTextContext = (): TextContextType => {
  const context = useContext(TextContext);
  if (context === undefined) {
    throw new Error('useTextContext must be used within a TextProvider');
  }
  return context;
};