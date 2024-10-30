import { useState, useCallback } from 'react';

interface DebugLog {
  id: string;
  timestamp: number;
  message: string;
  type: 'info' | 'error' | 'success';
}

export function useDebugLogs() {
  const [logs, setLogs] = useState<DebugLog[]>([]);
  const [isDebugPanelOpen, setIsDebugPanelOpen] = useState(false);

  const addLog = useCallback((message: string, type: DebugLog['type'] = 'info') => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).slice(2),
      timestamp: Date.now(),
      message,
      type
    }]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const toggleDebugPanel = useCallback(() => {
    setIsDebugPanelOpen(prev => !prev);
  }, []);

  return {
    logs,
    addLog,
    clearLogs,
    isDebugPanelOpen,
    toggleDebugPanel,
    setIsDebugPanelOpen
  };
}