import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { moonshotApi } from '../services/moonshotApi';
import { processContent } from '../utils/contentProcessor';
import { ApiError } from '../types/api';
import ReactMarkdown from 'react-markdown';
import { sanitizeMarkdown } from '../utils/sanitizer';
import { validateContent } from '../utils/security';
import Sidebar from '../components/analysis/Sidebar';
import SvgViewer from '../components/analysis/SvgViewer';
import AnalysisLayout from '../layouts/AnalysisLayout';
import { MarkdownParser } from '../utils/markdownParser';
import { SvgService } from '../services/svgService';
import { toast } from 'react-hot-toast';

interface LocationState {
  content: string | File[];
}

const AnalysisPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [processedContent, setProcessedContent] = useState('');
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingSvg, setIsGeneratingSvg] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const processInputContent = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const state = location.state as LocationState;
      if (!state?.content) {
        throw new ApiError('No content provided', 400);
      }

      let content = state.content;
      let processedResult;

      if (Array.isArray(content)) {
        try {
          const fileContent = await Promise.all(
            content.map(async (file) => {
              const response = await moonshotApi.uploadFile(file);
              const fileData = await moonshotApi.getFileContent(response.id);
              return fileData.content;
            })
          );
          const combinedContent = fileContent.join('\n');
          validateContent(combinedContent);
          processedResult = await processContent(combinedContent);
        } catch (err) {
          throw new ApiError(
            err instanceof ApiError ? err.message : '文件处理失败',
            err instanceof ApiError ? err.status : 500
          );
        }
      } else {
        try {
          validateContent(content);
          processedResult = await processContent(content);
        } catch (err) {
          throw new ApiError(
            err instanceof ApiError ? err.message : '内容处理失败',
            err instanceof ApiError ? err.status : 500
          );
        }
      }

      setProcessedContent(sanitizeMarkdown(processedResult));
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : '处理内容时发生错误';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [location.state]);

  useEffect(() => {
    processInputContent();
  }, [processInputContent]);

  const handleContentChange = useCallback((newContent: string) => {
    try {
      validateContent(newContent);
      setProcessedContent(sanitizeMarkdown(newContent));
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : '无效的内容格式';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, []);

  const handleGenerateSvg = useCallback(async () => {
    try {
      setIsGeneratingSvg(true);
      setError(null);

      const markdownParser = new MarkdownParser();
      const processNodes = markdownParser.parseProcessFlow(processedContent);
      
      if (!processNodes.length) {
        throw new ApiError('无法解析工艺流程，请检查内容格式', 400);
      }

      const svgService = new SvgService();
      const svgElement = svgService.generateSvg(processNodes);

      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);
      setSvgContent(svgString);
      toast.success('SVG生成成功');
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'SVG 生成失败';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGeneratingSvg(false);
    }
  }, [processedContent]);

  const handleDownloadSvg = useCallback(() => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'process-flow.svg';
    link.click();
    URL.revokeObjectURL(url);
  }, [svgContent]);

  const handleDownloadPng = useCallback(() => {
    if (!svgContent) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      
      if (ctx) {
        ctx.scale(2, 2);
        ctx.drawImage(img, 0, 0);
        
        const link = document.createElement('a');
        link.download = 'process-flow.png';
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      }
    };
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    img.src = URL.createObjectURL(blob);
  }, [svgContent]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            返回
          </button>
        </div>

        <AnalysisLayout
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
          sidebarContent={
            <Sidebar
              content={processedContent}
              isJsonFormat={false}
              onContentChange={handleContentChange}
              onSubmit={handleGenerateSvg}
              isCollapsed={isSidebarCollapsed}
              isLoading={isLoading || isGeneratingSvg}
            />
          }
        >
          {svgContent ? (
            <SvgViewer
              content={svgContent}
              onDownloadSvg={handleDownloadSvg}
              onDownloadPng={handleDownloadPng}
            />
          ) : (
            <div className="h-full bg-white rounded-lg shadow-sm p-6 prose max-w-none">
              {error ? (
                <div className="text-red-500">{error}</div>
              ) : isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <ReactMarkdown>{processedContent}</ReactMarkdown>
              )}
            </div>
          )}
        </AnalysisLayout>
      </div>
    </div>
  );
};

export default AnalysisPage;