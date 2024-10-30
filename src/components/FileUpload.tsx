import React, { useState, useCallback } from 'react';
import { Upload, FileType, AlertCircle } from 'lucide-react';
import { ReadonlyFileUploadProps } from '../types/components';
import SubmitButton from './SubmitButton';

const FileUpload: React.FC<ReadonlyFileUploadProps> = ({ 
  onFilesChange,
  onSubmit 
}) => {
  const [files, setFiles] = useState<readonly File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(Object.freeze(selectedFiles));
    onFilesChange?.(selectedFiles);
  }, [onFilesChange]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles(Object.freeze(droppedFiles));
    onFilesChange?.(droppedFiles);
  }, [onFilesChange]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleSubmit = async () => {
    if (files.length === 0) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit?.(files);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-4 w-4 text-gray-500" />
          <span className="font-medium">支持的文件格式</span>
        </div>
        <p>PDF、Word文档 (.docx)、文本文件 (.txt)、Markdown文件 (.md)</p>
      </div>

      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 transition-colors duration-200 hover:border-blue-400"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="text-center">
          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt,.md"
            multiple
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer inline-flex flex-col items-center"
          >
            <div className="mb-4 p-4 bg-blue-50 rounded-full">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
            <span className="text-lg font-medium text-gray-900">点击或拖拽文件到此处</span>
            <span className="mt-2 text-sm text-gray-500">支持单个或多个文件</span>
          </label>
        </div>
      </div>

      {files.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg divide-y">
          {files.map((file, index) => (
            <div key={index} className="flex items-center gap-3 p-3">
              <FileType className="h-5 w-5 text-gray-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <SubmitButton
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        disabled={files.length === 0}
      />
    </div>
  );
};

export default FileUpload;