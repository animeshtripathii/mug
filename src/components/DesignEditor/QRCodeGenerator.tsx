import React, { useState, useEffect } from 'react';
import { QrCode, Download, Palette, Link, Phone, Mail, Wifi } from 'lucide-react';
import { QRCodeOptions } from '../../types';

interface QRCodeGeneratorProps {
  onQRCodeGenerate: (options: QRCodeOptions) => void;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ onQRCodeGenerate }) => {
  const [qrType, setQrType] = useState<'text' | 'url' | 'email' | 'phone' | 'wifi'>('text');
  const [qrData, setQrData] = useState('');
  const [qrOptions, setQrOptions] = useState<QRCodeOptions>({
    data: '',
    size: 200,
    color: '#000000',
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    errorCorrectionLevel: 'M'
  });

  // WiFi specific fields
  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiSecurity, setWifiSecurity] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');

  const qrTypes = [
    { id: 'text', name: 'Text', icon: QrCode, placeholder: 'Enter your text...' },
    { id: 'url', name: 'Website', icon: Link, placeholder: 'https://example.com' },
    { id: 'email', name: 'Email', icon: Mail, placeholder: 'email@example.com' },
    { id: 'phone', name: 'Phone', icon: Phone, placeholder: '+1234567890' },
    { id: 'wifi', name: 'WiFi', icon: Wifi, placeholder: 'WiFi Network' }
  ];

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A'
  ];

  useEffect(() => {
    let data = '';
    
    switch (qrType) {
      case 'text':
        data = qrData;
        break;
      case 'url':
        data = qrData.startsWith('http') ? qrData : `https://${qrData}`;
        break;
      case 'email':
        data = `mailto:${qrData}`;
        break;
      case 'phone':
        data = `tel:${qrData}`;
        break;
      case 'wifi':
        data = `WIFI:T:${wifiSecurity};S:${wifiSSID};P:${wifiPassword};;`;
        break;
    }

    setQrOptions(prev => ({ ...prev, data }));
  }, [qrType, qrData, wifiSSID, wifiPassword, wifiSecurity]);

  const handleGenerate = () => {
    if (qrOptions.data) {
      onQRCodeGenerate(qrOptions);
    }
  };

  const generateQRCodeSVG = (options: QRCodeOptions) => {
    // This is a simplified QR code representation
    // In a real implementation, you'd use a proper QR code library
    const size = options.size;
    const cellSize = size / 25; // 25x25 grid for simplicity
    
    let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<rect width="${size}" height="${size}" fill="${options.backgroundColor}" rx="${options.borderRadius}"/>`;
    
    // Generate a pattern (this is just for demo - real QR codes need proper encoding)
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        if (Math.random() > 0.5) {
          const x = i * cellSize;
          const y = j * cellSize;
          svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${options.color}"/>`;
        }
      }
    }
    
    svg += '</svg>';
    return svg;
  };

  return (
    <div className="space-y-4">
      <div className="border-b pb-4">
        <h4 className="font-semibold text-gray-900 mb-3">QR Code Generator</h4>
        
        {/* QR Type Selection */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {qrTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setQrType(type.id as any)}
              className={`flex items-center space-x-2 p-2 rounded-lg border transition-colors ${
                qrType === type.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <type.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{type.name}</span>
            </button>
          ))}
        </div>

        {/* Data Input */}
        {qrType !== 'wifi' ? (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {qrTypes.find(t => t.id === qrType)?.name} Content
            </label>
            <input
              type={qrType === 'email' ? 'email' : qrType === 'url' ? 'url' : qrType === 'phone' ? 'tel' : 'text'}
              value={qrData}
              onChange={(e) => setQrData(e.target.value)}
              placeholder={qrTypes.find(t => t.id === qrType)?.placeholder}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        ) : (
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Network Name (SSID)</label>
              <input
                type="text"
                value={wifiSSID}
                onChange={(e) => setWifiSSID(e.target.value)}
                placeholder="My WiFi Network"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                placeholder="WiFi Password"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Security</label>
              <select
                value={wifiSecurity}
                onChange={(e) => setWifiSecurity(e.target.value as any)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No Password</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* QR Code Customization */}
      <div className="space-y-4">
        <h5 className="font-medium text-gray-900">Customization</h5>
        
        {/* Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Size: {qrOptions.size}px
          </label>
          <input
            type="range"
            min="100"
            max="400"
            value={qrOptions.size}
            onChange={(e) => setQrOptions(prev => ({ ...prev, size: parseInt(e.target.value) }))}
            className="w-full"
          />
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Foreground</label>
            <div className="grid grid-cols-6 gap-1">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setQrOptions(prev => ({ ...prev, color }))}
                  className={`w-6 h-6 rounded border-2 ${
                    qrOptions.color === color ? 'border-blue-500' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
            <div className="grid grid-cols-6 gap-1">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setQrOptions(prev => ({ ...prev, backgroundColor: color }))}
                  className={`w-6 h-6 rounded border-2 ${
                    qrOptions.backgroundColor === color ? 'border-blue-500' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Border Radius */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Corner Radius: {qrOptions.borderRadius}px
          </label>
          <input
            type="range"
            min="0"
            max="20"
            value={qrOptions.borderRadius}
            onChange={(e) => setQrOptions(prev => ({ ...prev, borderRadius: parseInt(e.target.value) }))}
            className="w-full"
          />
        </div>

        {/* Error Correction */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Error Correction</label>
          <select
            value={qrOptions.errorCorrectionLevel}
            onChange={(e) => setQrOptions(prev => ({ ...prev, errorCorrectionLevel: e.target.value as any }))}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="L">Low (7%)</option>
            <option value="M">Medium (15%)</option>
            <option value="Q">Quartile (25%)</option>
            <option value="H">High (30%)</option>
          </select>
        </div>
      </div>

      {/* Preview */}
      {qrOptions.data && (
        <div className="border-t pt-4">
          <h5 className="font-medium text-gray-900 mb-2">Preview</h5>
          <div className="flex justify-center mb-4">
            <div 
              className="border border-gray-300 rounded-lg p-4 bg-white"
              dangerouslySetInnerHTML={{ __html: generateQRCodeSVG(qrOptions) }}
            />
          </div>
          <button
            onClick={handleGenerate}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add to Design
          </button>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;