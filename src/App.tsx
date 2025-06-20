import React, { useState } from 'react';
import Header from './components/Header';
import ProductOverview from './components/ProductOverview';
import DesignEditor from './components/DesignEditor';
import ProductCustomization from './components/ProductCustomization';
import Templates from './components/Templates';
import { DesignElement, MugOptions, Template } from './types';

type AppView = 'product' | 'editor' | 'templates';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('product');
  const [savedDesign, setSavedDesign] = useState<DesignElement[]>([]);
  const [cartCount, setCartCount] = useState(0);
  
  const [mugOptions, setMugOptions] = useState<MugOptions>({
    size: '11oz',
    type: 'ceramic',
    color: 'white',
    printType: 'front',
    quantity: 1
  });

  const handleStartDesign = () => {
    setCurrentView('editor');
  };

  const handleViewTemplates = () => {
    setCurrentView('templates');
  };

  const handleBackToProduct = () => {
    setCurrentView('product');
  };

  const handleSaveDesign = (elements: DesignElement[]) => {
    setSavedDesign(elements);
    setCurrentView('product');
    // Show success message
    alert('Design saved successfully!');
  };

  const handleTemplateSelect = (template: Template) => {
    // Load template into editor
    setSavedDesign(template.elements);
    setCurrentView('editor');
  };

  const handleOptionsChange = (options: Partial<MugOptions>) => {
    setMugOptions(prev => ({ ...prev, ...options }));
  };

  if (currentView === 'editor') {
    return (
      <DesignEditor
        onBack={handleBackToProduct}
        onSave={handleSaveDesign}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cartCount} />
      
      {currentView === 'product' && (
        <>
          <ProductOverview />
          
          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Product Customization */}
              <div className="lg:col-span-2">
                <ProductCustomization
                  options={mugOptions}
                  onOptionsChange={handleOptionsChange}
                  basePrice={299}
                />
              </div>
              
              {/* Right Column - Design Actions */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Design Your Mug</h3>
                  <div className="space-y-3">
                    <button
                      onClick={handleStartDesign}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>🎨</span>
                      <span>Start Designing</span>
                    </button>
                    
                    <button
                      onClick={handleViewTemplates}
                      className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>📋</span>
                      <span>Browse Templates</span>
                    </button>
                    
                    <div className="text-center text-sm text-gray-500">
                      or
                    </div>
                    
                    <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                      <span>📤</span>
                      <span>Upload Full Design</span>
                    </button>
                  </div>
                </div>

                {/* Design Preview */}
                {savedDesign.length > 0 && (
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Design</h3>
                    <div className="bg-gray-100 rounded-lg p-4 mb-4">
                      <div className="text-center text-gray-600">
                        Design preview with {savedDesign.length} element(s)
                      </div>
                    </div>
                    <button
                      onClick={handleStartDesign}
                      className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      Edit Design
                    </button>
                  </div>
                )}

                {/* Professional Design Service */}
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-6 rounded-lg text-white">
                  <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Get a professionally designed mug created by our expert designers
                  </p>
                  <button className="w-full bg-white text-purple-600 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Get Custom Design - ₹199
                  </button>
                </div>

                {/* FAQ Section */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked</h3>
                  <div className="space-y-3 text-sm">
                    <details className="cursor-pointer">
                      <summary className="font-medium text-gray-700">What's the best image resolution?</summary>
                      <p className="mt-2 text-gray-600">For best quality, use images with at least 300 DPI resolution.</p>
                    </details>
                    <details className="cursor-pointer">
                      <summary className="font-medium text-gray-700">How long does delivery take?</summary>
                      <p className="mt-2 text-gray-600">Standard delivery is 3-5 days, same-day available in select cities.</p>
                    </details>
                    <details className="cursor-pointer">
                      <summary className="font-medium text-gray-700">Can I preview before ordering?</summary>
                      <p className="mt-2 text-gray-600">Yes! Use our 3D preview feature to see exactly how your mug will look.</p>
                    </details>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {currentView === 'templates' && (
        <Templates onTemplateSelect={handleTemplateSelect} />
      )}
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">MugCraft Pro</h3>
              <p className="text-gray-400">Create personalized mugs with professional quality and fast delivery.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Products</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Photo Mugs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Travel Mugs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Latte Mugs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bulk Orders</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Design Help</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Order Tracking</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📞 1800-123-4567</li>
                <li>✉️ hello@mugcraft.com</li>
                <li>💬 Live Chat Available</li>
                <li>🕒 24/7 Support</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; 2024 MugCraft Pro. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;