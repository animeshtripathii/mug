import React, { useState } from 'react';
import { Template } from '../types';
import { Search, Heart, Star, Download, Eye } from 'lucide-react';

interface TemplatesProps {
  onTemplateSelect: (template: Template) => void;
}

const Templates: React.FC<TemplatesProps> = ({ onTemplateSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Templates', count: 150 },
    { id: 'birthday', name: 'Birthday', count: 25 },
    { id: 'wedding', name: 'Wedding', count: 30 },
    { id: 'corporate', name: 'Corporate', count: 20 },
    { id: 'anniversary', name: 'Anniversary', count: 15 },
    { id: 'graduation', name: 'Graduation', count: 18 },
    { id: 'holiday', name: 'Holiday', count: 22 },
    { id: 'baby', name: 'Baby & Kids', count: 20 }
  ];

  const templates: Template[] = [
    {
      id: 'template-1',
      name: 'Happy Birthday Celebration',
      category: 'birthday',
      thumbnail: 'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Colorful birthday design with balloons and confetti',
      elements: []
    },
    {
      id: 'template-2',
      name: 'Wedding Bliss',
      category: 'wedding',
      thumbnail: 'https://images.pexels.com/photos/265963/pexels-photo-265963.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Elegant wedding design with romantic elements',
      elements: []
    },
    {
      id: 'template-3',
      name: 'Professional Logo',
      category: 'corporate',
      thumbnail: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpg?auto=compress&cs=tinysrgb&w=300',
      description: 'Clean corporate design for business gifts',
      elements: []
    },
    {
      id: 'template-4',
      name: 'Anniversary Love',
      category: 'anniversary',
      thumbnail: 'https://images.pexels.com/photos/1024967/pexels-photo-1024967.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Romantic anniversary design with hearts',
      elements: []
    },
    {
      id: 'template-5',
      name: 'Graduation Success',
      category: 'graduation',
      thumbnail: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Celebratory graduation design with cap and diploma',
      elements: []
    },
    {
      id: 'template-6',
      name: 'Holiday Cheer',
      category: 'holiday',
      thumbnail: 'https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Festive holiday design with seasonal elements',
      elements: []
    },
    {
      id: 'template-7',
      name: 'Baby Shower Joy',
      category: 'baby',
      thumbnail: 'https://images.pexels.com/photos/1574647/pexels-photo-1574647.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Adorable baby-themed design with cute illustrations',
      elements: []
    },
    {
      id: 'template-8',
      name: 'Minimalist Modern',
      category: 'corporate',
      thumbnail: 'https://images.pexels.com/photos/158971/ibis-bird-red-animals-158971.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Clean and modern minimalist design',
      elements: []
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Design Templates</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from our professionally designed templates or start from scratch
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className="relative">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 flex space-x-2 transition-opacity">
                    <button
                      onClick={() => onTemplateSelect(template)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Use Template</span>
                    </button>
                    <button className="bg-white text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                  <div className="flex items-center text-yellow-400">
                    <Star className="h-3 w-3 fill-current" />
                    <span className="text-xs font-medium text-gray-700 ml-1">4.8</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full capitalize">
                    {template.category}
                  </span>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Preview
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Professional Design Service */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Need a Custom Design?</h3>
          <p className="text-lg mb-6 opacity-90">
            Work with our professional designers to create something unique for your special occasion
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Get Custom Design - ₹199
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
              View Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Templates;