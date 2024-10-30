import React, { useState, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MarkdownParser } from '../utils/markdownParser';
import { SvgService } from '../services/svgService';
import { useDebugLogs } from '../hooks/useDebugLogs';
import DebugPanel from '../components/DebugPanel';

const DebugPage = () => {
  const navigate = useNavigate();
  const [markdown, setMarkdown] = useState('');
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const { logs, addLog, isDebugPanelOpen, toggleDebugPanel } = useDebugLogs();

  const handleGenerateSvg = useCallback(async () => {
    if (!markdown.trim()) {
      addLog('请先输入Markdown内容', 'error');
      return;
    }

    try {
      addLog('开始解析Markdown');
      const parser = new MarkdownParser();
      const nodes = parser.parseProcessFlow(markdown);
      addLog(`解析完成，得到 ${nodes.length} 个工序节点`);
      
      nodes.forEach((node, index) => {
        addLog(`节点 ${index + 1}: ${node.title}`);
        addLog(`污染物数量: ${node.pollutants.length}`);
        node.pollutants.forEach(p => {
          addLog(`  - ${p.label}: ${p.description}`);
        });
      });

      addLog('开始生成SVG');
      const svgService = new SvgService();
      const svgElement = svgService.generateSvg(nodes);
      addLog('SVG元素生成完成');

      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);
      setSvgContent(svgString);
      addLog('SVG生成成功', 'success');
    } catch (error) {
      addLog(`生成失败: ${error instanceof Error ? error.message : '未知错误'}`, 'error');
    }
  }, [markdown, addLog]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            返回
          </button>
          
          <button
            onClick={toggleDebugPanel}
            className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            调试面板
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-medium mb-4">Markdown 输入</h2>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="w-full h-[600px] p-4 border rounded-lg font-mono text-sm"
                placeholder="在此粘贴Markdown内容..."
              />
              <button
                onClick={handleGenerateSvg}
                disabled={!markdown.trim()}
                className={`
                  mt-4 px-4 py-2 rounded-lg font-medium
                  ${markdown.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                `}
              >
                生成SVG
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-medium mb-4">SVG 预览</h2>
              <div className="border rounded-lg h-[600px] overflow-auto p-4">
                {svgContent ? (
                  <div dangerouslySetInnerHTML={{ __html: svgContent }} />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    等待生成SVG...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DebugPanel
          logs={logs}
          isOpen={isDebugPanelOpen}
          onClose={() => toggleDebugPanel()}
        />
      </div>
    </div>
  );
};

export default DebugPage;