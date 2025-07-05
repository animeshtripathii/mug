import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ImageElement } from '../types/ImageElement';

interface ImageContextType {
  imageElements: ImageElement[];
  selectedImageId: string | null;
  addImageElement: (src: string, originalWidth: number, originalHeight: number) => void;
  updateImageElement: (id: string, updates: Partial<ImageElement>) => void;
  selectImageElement: (id: string | null) => void;
  deleteImageElement: (id: string) => void;
  duplicateImageElement: (id: string) => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImageContext must be used within an ImageProvider');
  }
  return context;
};

interface ImageProviderProps {
  children: ReactNode;
}

export const ImageProvider: React.FC<ImageProviderProps> = ({ children }) => {
  const [imageElements, setImageElements] = useState<ImageElement[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const addImageElement = (src: string, originalWidth: number, originalHeight: number) => {
    // Canvas dimensions from Canvas.tsx
    const canvasWidth = 688;
    const canvasHeight = 280;
    
    // Calculate scaled dimensions to fit within canvas while maintaining aspect ratio
    const maxWidth = Math.min(300, canvasWidth * 0.4);
    const maxHeight = Math.min(200, canvasHeight * 0.4);
    
    const aspectRatio = originalWidth / originalHeight;
    let width = maxWidth;
    let height = maxWidth / aspectRatio;
    
    if (height > maxHeight) {
      height = maxHeight;
      width = maxHeight * aspectRatio;
    }
    
    // Calculate center position
    const centerX = (canvasWidth - width) / 2;
    const centerY = (canvasHeight - height) / 2;

    const newElement: ImageElement = {
      id: `image-${Date.now()}`,
      src,
      x: centerX,
      y: centerY,
      width,
      height,
      rotation: 0,
      opacity: 100,
      filter: 'none',
      transform: '',
      isSelected: false,
      originalWidth,
      originalHeight,
      locked: false,
      cropData: null,
      clipPath: 'none',
    };

    setImageElements(prev => [...prev, newElement]);
    setSelectedImageId(newElement.id);
  };

  const updateImageElement = (id: string, updates: Partial<ImageElement>) => {
    setImageElements(prev =>
      prev.map(element =>
        element.id === id ? { ...element, ...updates } : element
      )
    );
  };

  const selectImageElement = (id: string | null) => {
    setSelectedImageId(id);
    setImageElements(prev =>
      prev.map(element => ({
        ...element,
        isSelected: element.id === id,
      }))
    );
  };

  const deleteImageElement = (id: string) => {
    setImageElements(prev => prev.filter(element => element.id !== id));
    if (selectedImageId === id) {
      setSelectedImageId(null);
    }
  };

  const duplicateImageElement = (id: string) => {
    const elementToDuplicate = imageElements.find(el => el.id === id);
    if (elementToDuplicate) {
      const newElement: ImageElement = {
        ...elementToDuplicate,
        id: `image-${Date.now()}`,
        x: elementToDuplicate.x + 20,
        y: elementToDuplicate.y + 20,
        isSelected: false,
      };
      
      setImageElements(prev => [...prev, newElement]);
      setSelectedImageId(newElement.id);
    }
  };

  return (
    <ImageContext.Provider
      value={{
        imageElements,
        selectedImageId,
        addImageElement,
        updateImageElement,
        selectImageElement,
        deleteImageElement,
        duplicateImageElement,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};