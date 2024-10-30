import React, { useState, useCallback } from 'react';
import { ReadonlySettingsModalProps } from '../types/components';
import { useMoonshotStore } from '../store/moonshotStore';

const SettingsModal = Object.freeze(React.memo(function SettingsModal({ 
  isOpen, 
  onClose,
  onSave 
}: ReadonlySettingsModalProps) {
  const { config, setConfig } = useMoonshotStore();
  const [formData, setFormData] = useState({
    systemPrompt: config.systemPrompt,
    model: config.model,
    apiKey: config.apiKey
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    setConfig(formData);
    onSave?.(formData);
    onClose();
  }, [formData, setConfig, onSave, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">设置</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              系统提示词
            </label>
            <textarea
              name="systemPrompt"
              className="w-full h-32 p-2 border border-gray-300 rounded-lg resize-none"
              placeholder="输入系统提示词..."
              value={formData.systemPrompt}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              选择模型
            </label>
            <select
              name="model"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={formData.model}
              onChange={handleChange}
            >
              <option value="moonshot-v1-32k">Moonshot 32k</option>
              <option value="moonshot-v1-8k">Moonshot 8k</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            <input
              name="apiKey"
              type="password"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="输入 API Key..."
              value={formData.apiKey}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}));

export default SettingsModal;