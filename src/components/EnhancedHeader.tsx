import React, { useState } from 'react';
import { Save, Undo, Redo, FileText, Maximize2, Eye, ChevronRight } from 'lucide-react';
import ViewOptionsPanel from './ViewOptionsPanel';
import Preview3DModal from './Preview3DModal';

interface ViewOption {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const EnhancedHeader: React.FC = () => {
  const [showViewPanel, setShowViewPanel] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [viewOptions, setViewOptions] = useState<ViewOption[]>([
    {
      id: 'grids',
      label: 'Grids',
      description: 'Used to align your design.',
      enabled: false,
    },
    {
      id: 'rulers',
      label: 'Rulers',
      description: 'This is the size of your design.',
      enabled: true,
    },
    {
      id: 'safety-bleed',
      label: 'Safety area & Bleed',
      description: 'Text and images should fit inside, anything outside the line will get cut.',
      enabled: true,
    },
    {
      id: 'highlight-empty',
      label: 'Highlight empty text',
      description: 'Empty text is indicated by dashed line around text box.',
      enabled: true,
    },
  ]);

  const handleToggleOption = (id: string) => {
    setViewOptions(prev =>
      prev.map(option =>
        option.id === id ? { ...option, enabled: !option.enabled } : option
      )
    );
  };

  const handlePreviewClick = () => {
    setShowPreviewModal(true);
    setShowViewPanel(false);
  };

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-6 py-3 relative">
        <div className="flex items-center justify-between">
          {/* Left side - Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="font-medium text-blue-600">My Projects</span>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium">Personalised Mugs</span>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors">
              <Save className="w-4 h-4" />
              <span className="font-medium">Save</span>
            </button>
            
            <div className="flex items-center space-x-1">
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors" title="Undo">
                <Undo className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors" title="Redo">
                <Redo className="w-4 h-4" />
              </button>
            </div>

            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
              <FileText className="w-4 h-4" />
              <span>Specs & Templates</span>
            </button>

            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
              <Maximize2 className="w-4 h-4" />
              <span>Change size</span>
            </button>

            <button 
              onClick={() => setShowViewPanel(!showViewPanel)}
              className={`flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md transition-colors ${
                showViewPanel ? 'bg-blue-50 border-blue-300 text-blue-700' : 'hover:bg-gray-50'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>View</span>
            </button>

            <button 
              onClick={handlePreviewClick}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>

            <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
              Next
            </button>
          </div>
        </div>

        {/* View Options Panel */}
        <ViewOptionsPanel
          isOpen={showViewPanel}
          onClose={() => setShowViewPanel(false)}
          viewOptions={viewOptions}
          onToggleOption={handleToggleOption}
        />
      </div>

      {/* 3D Preview Modal */}
      <Preview3DModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
      />
    </>
  );
};

export default EnhancedHeader;