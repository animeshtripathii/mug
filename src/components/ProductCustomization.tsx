import React, { useState } from 'react';
import { Palette, Truck, Package, CreditCard, Phone, MessageCircle } from 'lucide-react';
import { MugOptions } from '../types';

interface ProductCustomizationProps {
  options: MugOptions;
  onOptionsChange: (options: Partial<MugOptions>) => void;
  basePrice: number;
}

const ProductCustomization: React.FC<ProductCustomizationProps> = ({
  options,
  onOptionsChange,
  basePrice
}) => {
  const [deliveryPincode, setDeliveryPincode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState<any>(null);

  const mugColors = [
    { id: 'white', name: 'Classic White', color: '#FFFFFF', border: '#E5E7EB' },
    { id: 'black', name: 'Deep Black', color: '#000000', border: '#374151' },
    { id: 'blue', name: 'Ocean Blue', color: '#3B82F6', border: '#1E40AF' },
    { id: 'red', name: 'Cherry Red', color: '#EF4444', border: '#DC2626' },
    { id: 'green', name: 'Forest Green', color: '#10B981', border: '#059669' },
    { id: 'yellow', name: 'Sunshine Yellow', color: '#F59E0B', border: '#D97706' },
    { id: 'pink', name: 'Rose Pink', color: '#EC4899', border: '#BE185D' },
    { id: 'purple', name: 'Royal Purple', color: '#8B5CF6', border: '#7C3AED' }
  ];

  const printTypes = [
    { id: 'front', name: 'Front Only', description: 'Design on front side', price: 0 },
    { id: 'both', name: 'Both Sides', description: 'Design on front & back', price: 50 },
    { id: 'wraparound', name: 'Wraparound', description: '360° design coverage', price: 100 }
  ];

  const sizes = [
    { id: '11oz', name: '11 oz', description: 'Standard size', price: 0 },
    { id: '15oz', name: '15 oz', description: 'Large size', price: 50 }
  ];

  const types = [
    { id: 'ceramic', name: 'Ceramic', description: 'Classic ceramic mug', price: 0 },
    { id: 'travel', name: 'Travel Mug', description: 'Insulated travel mug', price: 150 },
    { id: 'latte', name: 'Latte Mug', description: 'Wide mouth latte style', price: 75 }
  ];

  const calculatePrice = () => {
    const sizePrice = sizes.find(s => s.id === options.size)?.price || 0;
    const typePrice = types.find(t => t.id === options.type)?.price || 0;
    const printPrice = printTypes.find(p => p.id === options.printType)?.price || 0;
    
    const unitPrice = basePrice + sizePrice + typePrice + printPrice;
    const totalPrice = unitPrice * options.quantity;
    const bulkDiscount = options.quantity >= 10 ? totalPrice * 0.1 : 0;
    
    return {
      unitPrice,
      totalPrice,
      bulkDiscount,
      finalPrice: totalPrice - bulkDiscount
    };
  };

  const checkDelivery = () => {
    // Mock delivery check
    const sameDayAreas = ['110001', '400001', '560001', '600001'];
    const isSameDay = sameDayAreas.includes(deliveryPincode);
    
    setDeliveryInfo({
      available: true,
      sameDay: isSameDay,
      standardDays: isSameDay ? 0 : 2,
      expressDays: 1,
      charges: options.quantity * calculatePrice().unitPrice > 999 ? 0 : 50
    });
  };

  const pricing = calculatePrice();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Customize Your Mug</h2>
        <p className="text-gray-600">Choose your perfect combination</p>
      </div>

      {/* Mug Color Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <Palette className="h-5 w-5 mr-2" />
          Mug Color
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {mugColors.map((color) => (
            <button
              key={color.id}
              onClick={() => onOptionsChange({ color: color.id as any })}
              className={`p-3 rounded-lg border-2 transition-all ${
                options.color === color.id
                  ? 'border-blue-500 shadow-md scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div
                className="w-8 h-8 rounded-full mx-auto mb-2 border"
                style={{ backgroundColor: color.color, borderColor: color.border }}
              />
              <div className="text-xs font-medium text-gray-700">{color.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Size & Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
          <div className="space-y-2">
            {sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => onOptionsChange({ size: size.id as any })}
                className={`w-full p-3 rounded-lg border text-left transition-all ${
                  options.size === size.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{size.name}</div>
                    <div className="text-sm text-gray-600">{size.description}</div>
                  </div>
                  {size.price > 0 && (
                    <span className="text-sm font-medium text-blue-600">+₹{size.price}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Type</h3>
          <div className="space-y-2">
            {types.map((type) => (
              <button
                key={type.id}
                onClick={() => onOptionsChange({ type: type.id as any })}
                className={`w-full p-3 rounded-lg border text-left transition-all ${
                  options.type === type.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{type.name}</div>
                    <div className="text-sm text-gray-600">{type.description}</div>
                  </div>
                  {type.price > 0 && (
                    <span className="text-sm font-medium text-blue-600">+₹{type.price}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Print Type */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Print Style</h3>
        <div className="space-y-2">
          {printTypes.map((print) => (
            <button
              key={print.id}
              onClick={() => onOptionsChange({ printType: print.id as any })}
              className={`w-full p-3 rounded-lg border text-left transition-all ${
                options.printType === print.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{print.name}</div>
                  <div className="text-sm text-gray-600">{print.description}</div>
                </div>
                {print.price > 0 && (
                  <span className="text-sm font-medium text-blue-600">+₹{print.price}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onOptionsChange({ quantity: Math.max(1, options.quantity - 1) })}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
          >
            -
          </button>
          <span className="text-xl font-semibold w-16 text-center">{options.quantity}</span>
          <button
            onClick={() => onOptionsChange({ quantity: options.quantity + 1 })}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
          >
            +
          </button>
          {options.quantity >= 10 && (
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              10% Bulk Discount Applied!
            </div>
          )}
        </div>
      </div>

      {/* Delivery Calculator */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <Truck className="h-5 w-5 mr-2" />
          Check Delivery
        </h3>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter PIN code"
            value={deliveryPincode}
            onChange={(e) => setDeliveryPincode(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={checkDelivery}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Check
          </button>
        </div>
        
        {deliveryInfo && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="space-y-2 text-sm">
              {deliveryInfo.sameDay && (
                <div className="flex items-center text-green-600">
                  <Truck className="h-4 w-4 mr-2" />
                  Same Day Delivery Available!
                </div>
              )}
              <div className="text-gray-700">Standard Delivery: {deliveryInfo.standardDays} day(s)</div>
              <div className="text-gray-700">Express Delivery: {deliveryInfo.expressDays} day(s)</div>
              <div className="text-gray-700">
                Shipping: {deliveryInfo.charges === 0 ? 'FREE' : `₹${deliveryInfo.charges}`}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Price Summary */}
      <div className="border-t pt-4 bg-gray-50 -mx-6 -mb-6 px-6 pb-6 rounded-b-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Price Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Unit Price:</span>
            <span>₹{pricing.unitPrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Quantity:</span>
            <span>{options.quantity}</span>
          </div>
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{pricing.totalPrice}</span>
          </div>
          {pricing.bulkDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Bulk Discount (10%):</span>
              <span>-₹{pricing.bulkDiscount}</span>
            </div>
          )}
          <div className="border-t pt-2">
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span>₹{pricing.finalPrice}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              (Inclusive of all taxes)
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Add to Cart
          </button>
          <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Buy Now
          </button>
        </div>

        {/* Support Options */}
        <div className="mt-4 pt-4 border-t">
          <div className="text-sm text-gray-600 mb-2">Need help?</div>
          <div className="flex space-x-4">
            <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700">
              <Phone className="h-4 w-4" />
              <span>Call Us</span>
            </button>
            <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700">
              <MessageCircle className="h-4 w-4" />
              <span>Live Chat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCustomization;