import React, { useState } from 'react';
import { Search, Circle, Square, Triangle, Star, Hexagon, Heart, ArrowRight, ArrowLeftRight, Minus, Image, Mountain, Grid3X3, ChevronRight } from 'lucide-react';
import { useGraphicsContext } from '../context/GraphicsContext';

interface GraphicsPanelProps {
  isActive?: boolean;
}

const GraphicsPanel: React.FC<GraphicsPanelProps> = ({ isActive = false }) => {
  const { addGraphicElement } = useGraphicsContext();
  const [searchQuery, setSearchQuery] = useState('');

  const shapes = [
    { id: 'rectangle', name: 'Rectangle', icon: Square, type: 'rectangle' as const, bgColor: '#000000' },
    { id: 'circle', name: 'Circle', icon: Circle, type: 'circle' as const, bgColor: '#000000', selected: true },
    { id: 'triangle', name: 'Triangle', icon: Triangle, type: 'triangle' as const, bgColor: '#000000' },
    { id: 'pentagon', name: 'Pentagon', icon: Hexagon, type: 'polygon' as const, bgColor: '#000000' },
    { id: 'line', name: 'Line', icon: Minus, type: 'line' as const, bgColor: '#000000' },
    { id: 'arrow-right', name: 'Arrow Right', icon: ArrowRight, type: 'arrow' as const, bgColor: '#000000' },
    { id: 'arrow-both', name: 'Arrow Both', icon: ArrowLeftRight, type: 'arrow' as const, bgColor: '#000000' },
    { id: 'star', name: 'Star', icon: Star, type: 'star' as const, bgColor: '#000000' },
  ];

  const icons = [
    { id: 'leaf', name: 'Leaf', icon: '🍃', bgColor: '#f3f4f6' },
    { id: 'image', name: 'Image', icon: '🖼️', bgColor: '#f3f4f6' },
    { id: 'mountain', name: 'Mountain', icon: '🏔️', bgColor: '#f3f4f6' },
    { id: 'grid', name: 'Grid', icon: '⊞', bgColor: '#f3f4f6' },
  ];

  const clipart = [
    { id: 'wave', name: 'Wave', icon: '〰️', bgColor: '#8B4513' },
    { id: 'balloons', name: 'Balloons', icon: '🎈', bgColor: '#FF6B6B' },
    { id: 'star-burst', name: 'Star Burst', icon: '✨', bgColor: '#FFD93D' },
    { id: 'sun', name: 'Sun', icon: '☀️', bgColor: '#FFA500' },
  ];

  const handleAddShape = (type: any) => {
    addGraphicElement(type);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const renderShapeIcon = (shape: any) => {
    if (shape.id === 'rectangle') {
      return <div className="w-6 h-6 bg-black rounded-sm"></div>;
    } else if (shape.id === 'circle') {
      return <div className="w-6 h-6 bg-black rounded-full"></div>;
    } else if (shape.id === 'triangle') {
      return (
        <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-black"></div>
      );
    } else if (shape.id === 'pentagon') {
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="black">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      );
    } else if (shape.id === 'line') {
      return <div className="w-8 h-0.5 bg-black"></div>;
    } else if (shape.id === 'arrow-right') {
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      );
    } else if (shape.id === 'arrow-both') {
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
          <path d="M21 12H3M6 6l-3 6 3 6M18 6l3 6-3 6"/>
        </svg>
      );
    } else if (shape.id === 'star') {
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="black">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Graphics</h2>
      
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search all graphics"
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-4 pr-12 py-3 border-2 border-blue-400 rounded-lg focus:outline-none focus:border-blue-500 text-gray-700 placeholder-gray-500"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors">
            <Search className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Shapes Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shapes</h3>
        
        <div className="grid grid-cols-4 gap-3">
          {shapes.map((shape) => (
            <button
              key={shape.id}
              onClick={() => handleAddShape(shape.type)}
              className={`aspect-square border-2 rounded-lg p-3 flex items-center justify-center hover:bg-gray-50 transition-all duration-200 hover:scale-105 group ${
                shape.selected 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              title={shape.name}
            >
              {renderShapeIcon(shape)}
            </button>
          ))}
        </div>
      </div>

      {/* Icons Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Icons</h3>
          <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors">
            <span className="text-sm font-medium">Show more</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-3">
          {icons.map((icon) => (
            <button
              key={icon.id}
              onClick={() => handleAddShape('circle')}
              className="aspect-square border-2 border-gray-200 rounded-lg p-3 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:scale-105 group"
              style={{ backgroundColor: icon.bgColor }}
              title={icon.name}
            >
              <span className="text-2xl">{icon.icon}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Clipart Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Clipart</h3>
          <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors">
            <span className="text-sm font-medium">Show more</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-3">
          {clipart.map((clip) => (
            <button
              key={clip.id}
              onClick={() => handleAddShape('circle')}
              className="aspect-square border-2 border-gray-200 rounded-lg p-3 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:scale-105 group"
              title={clip.name}
            >
              <span className="text-2xl">{clip.icon}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GraphicsPanel;