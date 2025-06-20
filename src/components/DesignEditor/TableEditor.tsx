import React, { useState } from 'react';
import { Plus, Minus, Table, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { TableData } from '../../types';

interface TableEditorProps {
  onTableCreate: (tableData: TableData) => void;
  selectedElement?: any;
  onElementUpdate?: (id: string, updates: any) => void;
}

const TableEditor: React.FC<TableEditorProps> = ({ 
  onTableCreate, 
  selectedElement, 
  onElementUpdate 
}) => {
  const [tableData, setTableData] = useState<TableData>({
    headers: ['Header 1', 'Header 2'],
    rows: [['Cell 1', 'Cell 2'], ['Cell 3', 'Cell 4']],
    styles: {
      borderColor: '#000000',
      backgroundColor: '#FFFFFF',
      headerBackgroundColor: '#F3F4F6',
      textAlign: 'left'
    }
  });

  const colors = [
    '#000000', '#FFFFFF', '#F3F4F6', '#EF4444', '#10B981', '#3B82F6',
    '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280'
  ];

  const addColumn = () => {
    setTableData(prev => ({
      ...prev,
      headers: [...prev.headers, `Header ${prev.headers.length + 1}`],
      rows: prev.rows.map(row => [...row, `Cell ${row.length + 1}`])
    }));
  };

  const removeColumn = () => {
    if (tableData.headers.length > 1) {
      setTableData(prev => ({
        ...prev,
        headers: prev.headers.slice(0, -1),
        rows: prev.rows.map(row => row.slice(0, -1))
      }));
    }
  };

  const addRow = () => {
    const newRow = tableData.headers.map((_, index) => `Cell ${tableData.rows.length + 1}-${index + 1}`);
    setTableData(prev => ({
      ...prev,
      rows: [...prev.rows, newRow]
    }));
  };

  const removeRow = () => {
    if (tableData.rows.length > 1) {
      setTableData(prev => ({
        ...prev,
        rows: prev.rows.slice(0, -1)
      }));
    }
  };

  const updateHeader = (index: number, value: string) => {
    setTableData(prev => ({
      ...prev,
      headers: prev.headers.map((header, i) => i === index ? value : header)
    }));
  };

  const updateCell = (rowIndex: number, cellIndex: number, value: string) => {
    setTableData(prev => ({
      ...prev,
      rows: prev.rows.map((row, i) => 
        i === rowIndex 
          ? row.map((cell, j) => j === cellIndex ? value : cell)
          : row
      )
    }));
  };

  const updateStyle = (property: keyof TableData['styles'], value: any) => {
    setTableData(prev => ({
      ...prev,
      styles: { ...prev.styles, [property]: value }
    }));
  };

  const handleCreateTable = () => {
    onTableCreate(tableData);
  };

  return (
    <div className="space-y-4">
      <div className="border-b pb-4">
        <h4 className="font-semibold text-gray-900 mb-3">Table Editor</h4>
        
        {/* Table Structure Controls */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Columns</label>
            <div className="flex items-center space-x-2">
              <button
                onClick={removeColumn}
                disabled={tableData.headers.length <= 1}
                className="p-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium w-8 text-center">{tableData.headers.length}</span>
              <button
                onClick={addColumn}
                className="p-1 border border-gray-300 rounded hover:bg-gray-100"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rows</label>
            <div className="flex items-center space-x-2">
              <button
                onClick={removeRow}
                disabled={tableData.rows.length <= 1}
                className="p-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium w-8 text-center">{tableData.rows.length}</span>
              <button
                onClick={addRow}
                className="p-1 border border-gray-300 rounded hover:bg-gray-100"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Content Editor */}
      <div className="space-y-3">
        <h5 className="font-medium text-gray-900">Table Content</h5>
        
        {/* Headers */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Headers</label>
          <div className="space-y-2">
            {tableData.headers.map((header, index) => (
              <input
                key={index}
                type="text"
                value={header}
                onChange={(e) => updateHeader(index, e.target.value)}
                placeholder={`Header ${index + 1}`}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            ))}
          </div>
        </div>

        {/* Rows */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rows</label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {tableData.rows.map((row, rowIndex) => (
              <div key={rowIndex} className="space-y-1">
                <div className="text-xs font-medium text-gray-500">Row {rowIndex + 1}</div>
                {row.map((cell, cellIndex) => (
                  <input
                    key={cellIndex}
                    type="text"
                    value={cell}
                    onChange={(e) => updateCell(rowIndex, cellIndex, e.target.value)}
                    placeholder={`Cell ${rowIndex + 1}-${cellIndex + 1}`}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Styling */}
      <div className="border-t pt-4 space-y-4">
        <h5 className="font-medium text-gray-900">Styling</h5>
        
        {/* Text Alignment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Text Alignment</label>
          <div className="flex space-x-2">
            {[
              { value: 'left', icon: AlignLeft },
              { value: 'center', icon: AlignCenter },
              { value: 'right', icon: AlignRight }
            ].map(({ value, icon: Icon }) => (
              <button
                key={value}
                onClick={() => updateStyle('textAlign', value)}
                className={`p-2 border rounded hover:bg-gray-100 ${
                  tableData.styles.textAlign === value ? 'bg-blue-100 border-blue-300' : 'border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Border</label>
            <div className="grid grid-cols-5 gap-1">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => updateStyle('borderColor', color)}
                  className={`w-6 h-6 rounded border-2 ${
                    tableData.styles.borderColor === color ? 'border-blue-500' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
            <div className="grid grid-cols-5 gap-1">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => updateStyle('backgroundColor', color)}
                  className={`w-6 h-6 rounded border-2 ${
                    tableData.styles.backgroundColor === color ? 'border-blue-500' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Header</label>
            <div className="grid grid-cols-5 gap-1">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => updateStyle('headerBackgroundColor', color)}
                  className={`w-6 h-6 rounded border-2 ${
                    tableData.styles.headerBackgroundColor === color ? 'border-blue-500' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="border-t pt-4">
        <h5 className="font-medium text-gray-900 mb-2">Preview</h5>
        <div className="border border-gray-300 rounded-lg p-4 bg-white overflow-x-auto">
          <table className="w-full text-sm" style={{ borderColor: tableData.styles.borderColor }}>
            <thead>
              <tr style={{ backgroundColor: tableData.styles.headerBackgroundColor }}>
                {tableData.headers.map((header, index) => (
                  <th
                    key={index}
                    className="border p-2 font-medium"
                    style={{ 
                      borderColor: tableData.styles.borderColor,
                      textAlign: tableData.styles.textAlign 
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ backgroundColor: tableData.styles.backgroundColor }}>
              {tableData.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="border p-2"
                      style={{ 
                        borderColor: tableData.styles.borderColor,
                        textAlign: tableData.styles.textAlign 
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <button
          onClick={handleCreateTable}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Table to Design
        </button>
      </div>
    </div>
  );
};

export default TableEditor;