import React, { useState, useRef, useEffect } from 'react';
import { X, Check, QrCode, ArrowLeft, Upload, Eye, Palette, Type, Image as ImageIcon } from 'lucide-react';
import { useQRContext } from '../context/QRContext';
import QRCode from 'qrcode';

interface QRStylePanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedQRId: string | null;
}

const QRStylePanel: React.FC<QRStylePanelProps> = ({ 
  isOpen, 
  onClose,
  selectedQRId
}) => {
  const { qrElements, updateQRElement } = useQRContext();
  const [selectedCornerStyle, setSelectedCornerStyle] = useState('square');
  const [selectedDotStyle, setSelectedDotStyle] = useState('square');
  const [selectedCenterPattern, setSelectedCenterPattern] = useState('none');
  const [addIcon, setAddIcon] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('none');
  const [customText, setCustomText] = useState('');
  const [showCustomText, setShowCustomText] = useState(false);
  const [qrPreview, setQrPreview] = useState<string>('');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [backgroundPattern, setBackgroundPattern] = useState('none');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>('');

  const selectedElement = qrElements.find(el => el.id === selectedQRId);

  // Initialize values from selected element
  useEffect(() => {
    if (selectedElement) {
      setSelectedCornerStyle(selectedElement.cornerStyle || 'square');
      setSelectedDotStyle(selectedElement.dotStyle || 'square');
      setAddIcon(selectedElement.hasIcon || false);
      setSelectedIcon(selectedElement.iconType || 'none');
      setForegroundColor(selectedElement.foregroundColor || '#000000');
      setBackgroundColor(selectedElement.backgroundColor || '#FFFFFF');
    }
  }, [selectedElement]);

  // Generate live preview whenever settings change
  useEffect(() => {
    if (selectedElement) {
      generateQRPreview();
    }
  }, [selectedElement, selectedCornerStyle, selectedDotStyle, selectedCenterPattern, addIcon, selectedIcon, customText, foregroundColor, backgroundColor, backgroundPattern, logoUrl]);

  if (!isOpen) return null;

  // Corner styles data with enhanced options
  const cornerStyles = [
    { id: 'square', name: 'Square', preview: 'square' },
    { id: 'rounded', name: 'Rounded', preview: 'rounded-md' },
    { id: 'extra-rounded', name: 'Extra Rounded', preview: 'rounded-lg' },
    { id: 'circle', name: 'Circle', preview: 'rounded-full' },
    { id: 'dots', name: 'Dots', preview: 'dots' },
    { id: 'custom', name: 'Custom', preview: 'custom' }
  ];

  // Enhanced dot styles with more patterns
  const dotStyles = [
    { id: 'square', name: 'Square', pattern: 'square' },
    { id: 'rounded', name: 'Rounded', pattern: 'rounded' },
    { id: 'dots', name: 'Dots', pattern: 'dots' },
    { id: 'classy', name: 'Classy', pattern: 'classy' },
    { id: 'classy-rounded', name: 'Classy Rounded', pattern: 'classy-rounded' },
    { id: 'diamond', name: 'Diamond', pattern: 'diamond' },
    { id: 'hexagon', name: 'Hexagon', pattern: 'hexagon' },
    { id: 'star', name: 'Star', pattern: 'star' }
  ];

  // Center pattern options
  const centerPatterns = [
    { id: 'none', name: 'None', icon: '🚫' },
    { id: 'logo-space', name: 'Logo Space', icon: '⬜' },
    { id: 'circle', name: 'Circle', icon: '⭕' },
    { id: 'square', name: 'Square', icon: '⬛' },
    { id: 'diamond', name: 'Diamond', icon: '💎' },
    { id: 'star', name: 'Star', icon: '⭐' }
  ];

  // Icon options with more variety
  const iconOptions = [
    { id: 'none', name: 'No Icon', icon: '🚫' },
    { id: 'scan-me', name: 'Scan Me', icon: 'SCAN\nME' },
    { id: 'star', name: 'Star', icon: '⭐' },
    { id: 'play', name: 'Play', icon: '▶️' },
    { id: 'heart', name: 'Heart', icon: '❤️' },
    { id: 'check', name: 'Check', icon: '✓' },
    { id: 'wifi', name: 'WiFi', icon: '📶' },
    { id: 'phone', name: 'Phone', icon: '📱' },
    { id: 'mail', name: 'Email', icon: '✉️' },
    { id: 'link', name: 'Link', icon: '🔗' },
    { id: 'home', name: 'Home', icon: '🏠' },
    { id: 'shop', name: 'Shop', icon: '🛍️' }
  ];

  // Background pattern options
  const backgroundPatterns = [
    { id: 'none', name: 'None' },
    { id: 'dots', name: 'Dots' },
    { id: 'grid', name: 'Grid' },
    { id: 'diagonal', name: 'Diagonal' },
    { id: 'waves', name: 'Waves' },
    { id: 'gradient', name: 'Gradient' }
  ];

  const generateQRPreview = async () => {
    if (!selectedElement) return;

    try {
      const qrOptions: any = {
        width: 200,
        height: 200,
        color: {
          dark: foregroundColor,
          light: backgroundColor,
        },
        errorCorrectionLevel: selectedElement.errorCorrectionLevel || 'M',
        margin: 1,
      };

      // Apply advanced styling options
      if (selectedCornerStyle !== 'square') {
        qrOptions.type = 'svg';
      }

      const qrDataUrl = await QRCode.toDataURL(selectedElement.url, qrOptions);
      setQrPreview(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR preview:', error);
    }
  };

  const handleCornerStyleChange = (styleId: string) => {
    setSelectedCornerStyle(styleId);
    if (selectedElement) {
      updateQRElement(selectedElement.id, { cornerStyle: styleId });
      console.log('Corner style updated:', styleId);
    }
  };

  const handleDotStyleChange = (styleId: string) => {
    setSelectedDotStyle(styleId);
    if (selectedElement) {
      updateQRElement(selectedElement.id, { dotStyle: styleId });
      console.log('Dot style updated:', styleId);
    }
  };

  const handleCenterPatternChange = (patternId: string) => {
    setSelectedCenterPattern(patternId);
    if (selectedElement) {
      updateQRElement(selectedElement.id, { centerPattern: patternId });
      console.log('Center pattern updated:', patternId);
    }
  };

  const handleIconToggle = () => {
    const newAddIcon = !addIcon;
    setAddIcon(newAddIcon);
    if (selectedElement) {
      updateQRElement(selectedElement.id, { 
        hasIcon: newAddIcon,
        iconType: newAddIcon ? selectedIcon : 'none',
        needsRegeneration: true
      });
      console.log('Icon toggle updated:', newAddIcon);
    }
  };

  const handleIconChange = (iconId: string) => {
    setSelectedIcon(iconId);
    if (selectedElement) {
      updateQRElement(selectedElement.id, { 
        iconType: iconId,
        hasIcon: iconId !== 'none',
        needsRegeneration: true
      });
      console.log('Icon changed:', iconId);
    }
    if (iconId !== 'none') {
      setAddIcon(true);
    }
  };

  const handleCustomTextToggle = () => {
    const newShowCustomText = !showCustomText;
    setShowCustomText(newShowCustomText);
    if (selectedElement) {
      updateQRElement(selectedElement.id, { 
        customText: newShowCustomText ? customText : '',
        showCustomText: newShowCustomText,
        needsRegeneration: true
      });
      console.log('Custom text toggle:', newShowCustomText);
    }
  };

  const handleCustomTextChange = (text: string) => {
    setCustomText(text);
    if (selectedElement && showCustomText) {
      updateQRElement(selectedElement.id, { 
        customText: text,
        needsRegeneration: true
      });
      console.log('Custom text changed:', text);
    }
  };

  const handleColorChange = (type: 'foreground' | 'background', color: string) => {
    if (type === 'foreground') {
      setForegroundColor(color);
      if (selectedElement) {
        updateQRElement(selectedElement.id, { 
          foregroundColor: color,
          needsRegeneration: true
        });
        console.log('Foreground color changed:', color);
      }
    } else {
      setBackgroundColor(color);
      if (selectedElement) {
        updateQRElement(selectedElement.id, { 
          backgroundColor: color,
          needsRegeneration: true
        });
        console.log('Background color changed:', color);
      }
    }
  };

  const handleBackgroundPatternChange = (patternId: string) => {
    setBackgroundPattern(patternId);
    if (selectedElement) {
      updateQRElement(selectedElement.id, { 
        backgroundPattern: patternId,
        needsRegeneration: true
      });
      console.log('Background pattern changed:', patternId);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
      setSelectedIcon('custom-logo');
      setAddIcon(true);
      
      if (selectedElement) {
        updateQRElement(selectedElement.id, { 
          iconType: 'custom-logo',
          hasIcon: true,
          logoUrl: url,
          needsRegeneration: true
        });
        console.log('Logo uploaded:', url);
      }
    }
    event.target.value = '';
  };

  // Render corner preview
  const renderCornerPreview = (style: typeof cornerStyles[0]) => {
    const baseClass = "w-8 h-8 bg-black flex items-center justify-center";
    
    switch (style.id) {
      case 'square':
        return (
          <div className={baseClass}>
            <div className="w-3 h-3 bg-white"></div>
          </div>
        );
      case 'rounded':
        return (
          <div className={`${baseClass} rounded-md`}>
            <div className="w-3 h-3 bg-white rounded-sm"></div>
          </div>
        );
      case 'extra-rounded':
        return (
          <div className={`${baseClass} rounded-lg`}>
            <div className="w-3 h-3 bg-white rounded-md"></div>
          </div>
        );
      case 'circle':
        return (
          <div className={`${baseClass} rounded-full`}>
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        );
      case 'dots':
        return (
          <div className={baseClass}>
            <div className="grid grid-cols-3 gap-0.5">
              {Array.from({ length: 9 }, (_, i) => (
                <div key={i} className="w-0.5 h-0.5 bg-white rounded-full"></div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className={baseClass}>
            <div className="w-3 h-3 bg-white"></div>
          </div>
        );
    }
  };

  // Render dot pattern preview
  const renderDotPattern = (style: typeof dotStyles[0]) => {
    const containerClass = "w-8 h-8 flex items-center justify-center";
    
    const getDotClass = (index: number) => {
      const baseClass = "w-1 h-1 bg-black";
      
      switch (style.pattern) {
        case 'square':
          return baseClass;
        case 'rounded':
          return `${baseClass} rounded-sm`;
        case 'dots':
          return `${baseClass} rounded-full`;
        case 'diamond':
          return `${baseClass} transform rotate-45`;
        case 'hexagon':
          return `${baseClass} rounded-sm transform rotate-12`;
        case 'star':
          return index % 2 === 0 ? `${baseClass} rounded-full` : `${baseClass} transform rotate-45`;
        case 'classy':
          return index % 2 === 0 ? `${baseClass} rounded-full` : baseClass;
        case 'classy-rounded':
          return index % 3 === 1 ? `${baseClass} rounded-full` : `${baseClass} rounded-sm`;
        default:
          return baseClass;
      }
    };

    return (
      <div className={containerClass}>
        <div className="grid grid-cols-3 gap-0.5">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className={getDotClass(i)}></div>
          ))}
        </div>
      </div>
    );
  };

  // Render icon preview
  const renderIconPreview = (icon: typeof iconOptions[0]) => {
    const containerClass = "w-8 h-8 flex items-center justify-center text-xs";
    
    if (icon.id === 'none') {
      return (
        <div className={containerClass}>
          <span className="text-lg">🚫</span>
        </div>
      );
    } else if (icon.id === 'scan-me') {
      return (
        <div className={containerClass}>
          <div className="text-[8px] font-bold text-center leading-tight text-black">
            <div>SCAN</div>
            <div>ME</div>
          </div>
        </div>
      );
    } else if (icon.id === 'custom-logo' && logoUrl) {
      return (
        <div className={containerClass}>
          <img src={logoUrl} alt="Logo" className="w-6 h-6 object-contain" />
        </div>
      );
    } else {
      return (
        <div className={containerClass}>
          <span className="text-sm">{icon.icon}</span>
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-3"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">QR Code Style</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Live Preview Section */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900 flex items-center">
            <Eye className="w-4 h-4 mr-2" />
            Live Preview
          </h3>
          <div className="text-xs text-gray-500">Updates in real-time</div>
        </div>
        
        <div className="flex justify-center">
          {qrPreview ? (
            <div className="relative">
              <img 
                src={qrPreview} 
                alt="QR Code Preview" 
                className="w-32 h-32 border border-gray-200 rounded-lg shadow-sm"
              />
              {(addIcon || showCustomText) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white bg-opacity-90 rounded px-2 py-1 text-xs font-medium">
                    {showCustomText ? customText : selectedIcon !== 'none' ? '🎯' : ''}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              <QrCode className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Color Scheme Section */}
      <div className="mb-8">
        <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center">
          <Palette className="w-4 h-4 mr-2" />
          Color Scheme
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Foreground</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={foregroundColor}
                onChange={(e) => handleColorChange('foreground', e.target.value)}
                className="w-10 h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={foregroundColor}
                onChange={(e) => handleColorChange('foreground', e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => handleColorChange('background', e.target.value)}
                className="w-10 h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => handleColorChange('background', e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Corners Section */}
      <div className="mb-8">
        <h3 className="text-base font-medium text-gray-900 mb-4">Corners</h3>
        <div className="grid grid-cols-3 gap-3">
          {cornerStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => handleCornerStyleChange(style.id)}
              className={`relative aspect-square border-2 rounded-lg p-2 flex items-center justify-center hover:bg-gray-50 transition-all duration-200 ${
                selectedCornerStyle === style.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              title={style.name}
            >
              {renderCornerPreview(style)}
              
              {selectedCornerStyle === style.id && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Dots Section */}
      <div className="mb-8">
        <h3 className="text-base font-medium text-gray-900 mb-4">Dots</h3>
        <div className="grid grid-cols-4 gap-3">
          {dotStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => handleDotStyleChange(style.id)}
              className={`relative aspect-square border-2 rounded-lg p-2 flex items-center justify-center hover:bg-gray-50 transition-all duration-200 ${
                selectedDotStyle === style.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              title={style.name}
            >
              {renderDotPattern(style)}
              
              {selectedDotStyle === style.id && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Center Pattern Section */}
      <div className="mb-8">
        <h3 className="text-base font-medium text-gray-900 mb-4">Center Pattern</h3>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {centerPatterns.map((pattern) => (
            <button
              key={pattern.id}
              onClick={() => handleCenterPatternChange(pattern.id)}
              className={`relative aspect-square border-2 rounded-lg p-3 flex items-center justify-center hover:bg-gray-50 transition-all duration-200 ${
                selectedCenterPattern === pattern.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              title={pattern.name}
            >
              <span className="text-xl">{pattern.icon}</span>
              
              {selectedCenterPattern === pattern.id && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Text Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-medium text-gray-900 flex items-center">
            <Type className="w-4 h-4 mr-2" />
            Custom Text
          </h3>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showCustomText}
              onChange={handleCustomTextToggle}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Add text to center</span>
          </label>
        </div>

        {showCustomText && (
          <div className="space-y-3">
            <input
              type="text"
              value={customText}
              onChange={(e) => handleCustomTextChange(e.target.value)}
              placeholder="Enter custom text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={20}
            />
            <div className="text-xs text-gray-500">
              Keep text short for better scannability (max 20 characters)
            </div>
          </div>
        )}
      </div>

      {/* Icon Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-medium text-gray-900">Icon</h3>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={addIcon}
              onChange={handleIconToggle}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Add icon to QR Code</span>
          </label>
        </div>

        {addIcon && (
          <>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {iconOptions.slice(0, 8).map((icon) => (
                <button
                  key={icon.id}
                  onClick={() => handleIconChange(icon.id)}
                  className={`relative aspect-square border-2 rounded-lg p-2 flex items-center justify-center hover:bg-gray-50 transition-all duration-200 ${
                    selectedIcon === icon.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  title={icon.name}
                >
                  {renderIconPreview(icon)}
                  
                  {selectedIcon === icon.id && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* More icons row */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {iconOptions.slice(8).map((icon) => (
                <button
                  key={icon.id}
                  onClick={() => handleIconChange(icon.id)}
                  className={`relative aspect-square border-2 rounded-lg p-2 flex items-center justify-center hover:bg-gray-50 transition-all duration-200 ${
                    selectedIcon === icon.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  title={icon.name}
                >
                  {renderIconPreview(icon)}
                  
                  {selectedIcon === icon.id && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Upload Custom Logo */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {logoFile ? 'Change logo' : 'Upload logo or image'}
                  </div>
                  <div className="text-xs text-gray-500">
                    PNG, JPEG, or SVG. Files must be under 7MB
                  </div>
                </div>
              </label>
            </div>
          </>
        )}
      </div>

      {/* Background Pattern Section */}
      <div className="mb-8">
        <h3 className="text-base font-medium text-gray-900 mb-4">Background Effects</h3>
        <div className="grid grid-cols-3 gap-3">
          {backgroundPatterns.map((pattern) => (
            <button
              key={pattern.id}
              onClick={() => handleBackgroundPatternChange(pattern.id)}
              className={`relative px-4 py-3 border-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all duration-200 ${
                backgroundPattern === pattern.id 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              {pattern.name}
              
              {backgroundPattern === pattern.id && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Apply Button */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Apply Style
        </button>
        <div className="text-xs text-gray-500 text-center mt-2">
          QR code remains fully scannable with all customizations
        </div>
      </div>
    </div>
  );
};

export default QRStylePanel;