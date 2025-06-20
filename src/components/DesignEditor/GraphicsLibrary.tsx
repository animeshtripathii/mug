import React, { useState } from 'react';
import { Search, Heart, Star, Shapes, Smile, Gift, Calendar, Briefcase } from 'lucide-react';
import { GraphicItem } from '../../types';

interface GraphicsLibraryProps {
  onGraphicSelect: (graphic: GraphicItem) => void;
}

const GraphicsLibrary: React.FC<GraphicsLibraryProps> = ({ onGraphicSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All', icon: Shapes },
    { id: 'shapes', name: 'Shapes', icon: Shapes },
    { id: 'icons', name: 'Icons', icon: Star },
    { id: 'emojis', name: 'Emojis', icon: Smile },
    { id: 'celebrations', name: 'Celebrations', icon: Gift },
    { id: 'business', name: 'Business', icon: Briefcase },
    { id: 'seasonal', name: 'Seasonal', icon: Calendar }
  ];

  const graphics: GraphicItem[] = [
    // Shapes
    { id: 'circle', name: 'Circle', category: 'shapes', svg: '⭕', thumbnail: '⭕' },
    { id: 'square', name: 'Square', category: 'shapes', svg: '⬜', thumbnail: '⬜' },
    { id: 'triangle', name: 'Triangle', category: 'shapes', svg: '🔺', thumbnail: '🔺' },
    { id: 'diamond', name: 'Diamond', category: 'shapes', svg: '💎', thumbnail: '💎' },
    { id: 'heart-shape', name: 'Heart', category: 'shapes', svg: '❤️', thumbnail: '❤️' },
    { id: 'star-shape', name: 'Star', category: 'shapes', svg: '⭐', thumbnail: '⭐' },
    
    // Icons
    { id: 'home', name: 'Home', category: 'icons', svg: '🏠', thumbnail: '🏠' },
    { id: 'phone', name: 'Phone', category: 'icons', svg: '📱', thumbnail: '📱' },
    { id: 'email', name: 'Email', category: 'icons', svg: '📧', thumbnail: '📧' },
    { id: 'location', name: 'Location', category: 'icons', svg: '📍', thumbnail: '📍' },
    { id: 'camera', name: 'Camera', category: 'icons', svg: '📷', thumbnail: '📷' },
    { id: 'music', name: 'Music', category: 'icons', svg: '🎵', thumbnail: '🎵' },
    
    // Emojis
    { id: 'smile', name: 'Smile', category: 'emojis', svg: '😊', thumbnail: '😊' },
    { id: 'laugh', name: 'Laugh', category: 'emojis', svg: '😂', thumbnail: '😂' },
    { id: 'love', name: 'Love', category: 'emojis', svg: '😍', thumbnail: '😍' },
    { id: 'wink', name: 'Wink', category: 'emojis', svg: '😉', thumbnail: '😉' },
    { id: 'cool', name: 'Cool', category: 'emojis', svg: '😎', thumbnail: '😎' },
    { id: 'thinking', name: 'Thinking', category: 'emojis', svg: '🤔', thumbnail: '🤔' },
    
    // Celebrations
    { id: 'birthday-cake', name: 'Birthday Cake', category: 'celebrations', svg: '🎂', thumbnail: '🎂' },
    { id: 'party', name: 'Party', category: 'celebrations', svg: '🎉', thumbnail: '🎉' },
    { id: 'balloon', name: 'Balloon', category: 'celebrations', svg: '🎈', thumbnail: '🎈' },
    { id: 'gift-box', name: 'Gift', category: 'celebrations', svg: '🎁', thumbnail: '🎁' },
    { id: 'confetti', name: 'Confetti', category: 'celebrations', svg: '🎊', thumbnail: '🎊' },
    { id: 'fireworks', name: 'Fireworks', category: 'celebrations', svg: '🎆', thumbnail: '🎆' },
    
    // Business
    { id: 'briefcase', name: 'Briefcase', category: 'business', svg: '💼', thumbnail: '💼' },
    { id: 'chart', name: 'Chart', category: 'business', svg: '📊', thumbnail: '📊' },
    { id: 'handshake', name: 'Handshake', category: 'business', svg: '🤝', thumbnail: '🤝' },
    { id: 'target', name: 'Target', category: 'business', svg: '🎯', thumbnail: '🎯' },
    { id: 'trophy', name: 'Trophy', category: 'business', svg: '🏆', thumbnail: '🏆' },
    { id: 'medal', name: 'Medal', category: 'business', svg: '🏅', thumbnail: '🏅' },
    
    // Seasonal
    { id: 'christmas-tree', name: 'Christmas Tree', category: 'seasonal', svg: '🎄', thumbnail: '🎄' },
    { id: 'snowman', name: 'Snowman', category: 'seasonal', svg: '⛄', thumbnail: '⛄' },
    { id: 'pumpkin', name: 'Pumpkin', category: 'seasonal', svg: '🎃', thumbnail: '🎃' },
    { id: 'sun', name: 'Sun', category: 'seasonal', svg: '☀️', thumbnail: '☀️' },
    { id: 'flower', name: 'Flower', category: 'seasonal', svg: '🌸', thumbnail: '🌸' },
    { id: 'leaf', name: 'Leaf', category: 'seasonal', svg: '🍃', thumbnail: '🍃' }
  ];

  const filteredGraphics = graphics.filter(graphic => {
    const matchesCategory = selectedCategory === 'all' || graphic.category === selectedCategory;
    const matchesSearch = graphic.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="border-b pb-4">
        <h4 className="font-semibold text-gray-900 mb-3">Graphics Library</h4>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search graphics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <category.icon className="h-3 w-3" />
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Graphics Grid */}
      <div className="grid grid-cols-4 gap-2 max-h-96 overflow-y-auto">
        {filteredGraphics.map((graphic) => (
          <button
            key={graphic.id}
            onClick={() => onGraphicSelect(graphic)}
            className="aspect-square p-2 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center justify-center text-2xl"
            title={graphic.name}
          >
            {graphic.thumbnail}
          </button>
        ))}
      </div>

      {filteredGraphics.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Shapes className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No graphics found</p>
        </div>
      )}
    </div>
  );
};

export default GraphicsLibrary;