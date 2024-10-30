import React from 'react';
import { Bug } from 'lucide-react';

interface DebugLog {
  id: string;
  timestamp: number;
  message: string;
  type: 'info' | 'error' | 'success';
}

interface DebugPanelProps {
  logs: DebugLog[];
  isOpen: boolean;
  onClose: () => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ logs, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-gray-900 text-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-gray-800">
        <div className="flex items-center gap-2">
          <Bug className="w-4 h-4" />
          <span className="font-medium">调试日志</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
      <div className="h-64 overflow-y-auto p-3 space-y-2 text-sm font-mono">
        {logs.map(log => (
          <div
            key={log.id}
            className={`p-2 rounded ${
              log.type === 'error'
                ? 'bg-red-900/50 text-red-200'
                : log.type === 'success'
                ? 'bg-green-900/50 text-green-200'
                : 'bg-gray-800'
            }`}
          >
            <div className="text-xs text-gray-400">
              {new Date(log.timestamp).toLocaleTimeString()}
            </div>
            <div className="whitespace-pre-wrap">{log.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebugPanel;