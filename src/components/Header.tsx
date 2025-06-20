import React from 'react';
import { ShoppingCart, User, Search, Heart, Phone, MessageCircle } from 'lucide-react';

interface HeaderProps {
  cartCount?: number;
}

const Header: React.FC<HeaderProps> = ({ cartCount = 0 }) => {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MugCraft Pro
              </h1>
            </div>
            <nav className="hidden md:ml-10 md:flex space-x-8">
              <a href="#products" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                Products
              </a>
              <a href="#templates" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                Templates
              </a>
              <a href="#bulk" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                Bulk Orders
              </a>
              <a href="#help" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                Help
              </a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search designs & templates..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">1800-123-4567</span>
            </div>
            
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <MessageCircle className="h-5 w-5" />
            </button>
            
            <Heart className="h-6 w-6 text-gray-600 hover:text-red-500 cursor-pointer transition-colors" />
            
            <div className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            
            <User className="h-6 w-6 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;