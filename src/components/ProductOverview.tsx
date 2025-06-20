import React from 'react';
import { Star, Shield, Truck, CreditCard, Award, Users, Clock } from 'lucide-react';

const ProductOverview: React.FC = () => {
  const features = [
    'Sharp, high-quality photo printing',
    '8 color options for handle and mug interior',
    '2-side and wraparound print options',
    'Food-grade, microwave, and dishwasher-safe',
    'Same Day Delivery (select pin codes)',
    'Cash on Delivery available',
    'Price inclusive of all taxes'
  ];

  const trustIndicators = [
    { icon: Shield, title: 'Premium Quality', subtitle: 'Guaranteed', color: 'text-green-600' },
    { icon: Truck, title: 'Fast Delivery', subtitle: 'Same Day Available', color: 'text-blue-600' },
    { icon: CreditCard, title: 'Secure Payment', subtitle: 'Multiple Options', color: 'text-purple-600' },
    { icon: Award, title: 'Best Quality', subtitle: '5-Star Rated', color: 'text-yellow-600' },
    { icon: Users, title: '50K+ Happy', subtitle: 'Customers', color: 'text-indigo-600' },
    { icon: Clock, title: '24/7 Support', subtitle: 'Always Here', color: 'text-teal-600' }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
                <Award className="h-4 w-4 mr-1" />
                Premium Quality Guaranteed
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Personalized Photo Mugs
              </h1>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Create your perfect custom mug with our professional design editor. 
                From personal memories to corporate gifts, make it uniquely yours.
              </p>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">4.9/5 from 12,847 reviews</span>
                <span className="text-green-600 font-semibold">✓ Verified Reviews</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 text-green-500 mr-2" />
                Premium Features
              </h3>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 mr-4"></div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {trustIndicators.map((indicator, index) => (
                <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <indicator.icon className={`h-8 w-8 ${indicator.color} mx-auto mb-2`} />
                  <div className="text-sm font-semibold text-gray-900">{indicator.title}</div>
                  <div className="text-xs text-gray-600">{indicator.subtitle}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src="https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Custom Mug Preview"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Same Day Delivery
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-900">Starting from ₹299</div>
                    <div className="text-sm text-gray-600">Free shipping on orders above ₹999</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-600 font-medium">✓ Best Price Guarantee</div>
                    <div className="text-xs text-gray-500">Price match promise</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center text-sm">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="font-semibold text-blue-900">11oz & 15oz</div>
                    <div className="text-blue-600">Available Sizes</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="font-semibold text-purple-900">8 Colors</div>
                    <div className="text-purple-600">Handle Options</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOverview;