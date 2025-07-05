import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, PresentationControls } from '@react-three/drei';
import { X, Download, RotateCcw, ZoomIn, ZoomOut, Settings } from 'lucide-react';
import * as THREE from 'three';

interface Preview3DModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mug 3D Model Component
function MugModel({ rotation }: { rotation: [number, number, number] }) {
  const { scene } = useGLTF('/mug/scenev1.gltf');
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = rotation[0];
      meshRef.current.rotation.y = rotation[1] + state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.z = rotation[2];
    }
  });

  return (
    <primitive 
      ref={meshRef}
      object={scene} 
      scale={[2, 2, 2]}
      position={[0, -1, 0]}
    />
  );
}

// Loading component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium">Loading 3D model...</p>
      </div>
    </div>
  );
}

const Preview3DModal: React.FC<Preview3DModalProps> = ({ isOpen, onClose }) => {
  const [currentSide, setCurrentSide] = useState<'front' | 'back'>('front');
  const [zoom, setZoom] = useState(100);
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSideChange = (side: 'front' | 'back') => {
    setCurrentSide(side);
    if (side === 'front') {
      setRotation([0, 0, 0]);
    } else {
      setRotation([0, Math.PI, 0]);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(200, prev + 10));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(50, prev - 10));
  };

  const handleReset = () => {
    setZoom(100);
    setRotation([0, 0, 0]);
    setCurrentSide('front');
    setAutoRotate(true);
  };

  const handleDownload = () => {
    // Create a temporary canvas to capture the 3D scene
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'mug-preview.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Download className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Download PDF proof</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Drag to rotate</span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* 3D Viewer */}
          <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 relative">
            <Suspense fallback={<LoadingSpinner />}>
              <Canvas
                camera={{ position: [0, 0, 5], fov: 50 }}
                style={{ width: '100%', height: '100%' }}
              >
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />
                
                <PresentationControls
                  enabled={true}
                  global={false}
                  cursor={true}
                  snap={false}
                  speed={1}
                  zoom={zoom / 100}
                  rotation={[0, 0, 0]}
                  polar={[-Math.PI / 3, Math.PI / 3]}
                  azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
                >
                  <MugModel rotation={rotation} />
                </PresentationControls>
                
                <Environment preset="studio" />
              </Canvas>
            </Suspense>

            {/* Overlay Controls */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`p-2 rounded-lg shadow-lg transition-colors ${
                  autoRotate ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                title={autoRotate ? 'Stop auto rotation' : 'Start auto rotation'}
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleReset}
                className="p-2 bg-white text-gray-600 hover:bg-gray-50 rounded-lg shadow-lg transition-colors"
                title="Reset view"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Panel - Design Preview */}
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Design Preview</h3>
              
              {/* Canvas Preview */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="w-full h-32 bg-gray-200 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Your design will appear here</span>
                </div>
              </div>

              {/* Side Toggle */}
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => handleSideChange('front')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    currentSide === 'front'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Front
                </button>
                <button
                  onClick={() => handleSideChange('back')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    currentSide === 'back'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Back
                </button>
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>

            {/* Product Info */}
            <div className="p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Product Details</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Material:</span>
                  <span>Ceramic</span>
                </div>
                <div className="flex justify-between">
                  <span>Capacity:</span>
                  <span>11oz</span>
                </div>
                <div className="flex justify-between">
                  <span>Dimensions:</span>
                  <span>9.5cm × 8cm</span>
                </div>
                <div className="flex justify-between">
                  <span>Print Area:</span>
                  <span>17.2cm × 7cm</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            {/* Zoom Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleZoomOut}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Zoom out"
              >
                <ZoomOut className="w-4 h-4 text-gray-600" />
              </button>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 min-w-[3rem]">{zoom}%</span>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              
              <button
                onClick={handleZoomIn}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Zoom in"
              >
                <ZoomIn className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Settings */}
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <Settings className="w-4 h-4 text-gray-600" />
              </button>
              <span className="text-sm text-gray-500">Need design help?</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview3DModal;