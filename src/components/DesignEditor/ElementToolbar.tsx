import React from 'react';
import { Copy, Trash2, RotateCw, Lock, Layers } from 'lucide-react';

interface ElementToolbarProps {
  elementId: string;
}

const ElementToolbar: React.FC<ElementToolbarProps> = ({ elementId }) => {
  return (
    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg px-2 py-1 flex items-center space-x-1 z-10">
      <button
        className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors"
        title="Duplicate"
      >
        <Copy className="h-4 w-4" />
      </button>
      <button
        className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      <button
        className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors"
        title="Lock"
      >
        <Lock className="h-4 w-4" />
      </button>
      <button
        className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors"
        title="Copy style"
      >
        <Layers className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ElementToolbar;