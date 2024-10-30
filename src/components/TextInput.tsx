import React, { useState, useCallback } from 'react';
import { FileText } from 'lucide-react';
import SubmitButton from './SubmitButton';
import { ReadonlyTextInputProps } from '../types/components';

const TextInput: React.FC<ReadonlyTextInputProps> = ({ onSubmit }) => {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTextChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  }, []);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit?.(text);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-4 w-4 text-gray-500" />
          <span className="font-medium">提示</span>
        </div>
        <p>请输入工艺流程描述，系统将分析并识别其中的污染物，生成规范的分析报告。</p>
      </div>
      
      <textarea
        className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        placeholder="在此输入工艺流程描述..."
        value={text}
        onChange={handleTextChange}
      />
      
      <SubmitButton
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        disabled={!text.trim()}
      />
    </div>
  );
};

export default TextInput;