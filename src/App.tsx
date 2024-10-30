import React, { useState, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { FileText, Upload } from 'lucide-react';
import MainLayout from './layouts/MainLayout';
import FileUpload from './components/FileUpload';
import TextInput from './components/TextInput';
import SettingsModal from './components/SettingsModal';
import Tab from './components/Tab';
import AnalysisPage from './pages/AnalysisPage';
import DebugPage from './pages/DebugPage';
import { useMoonshotStore } from './store/moonshotStore';

const TABS = [
  { id: 'upload', label: '文档导入', icon: Upload },
  { id: 'text', label: '文本粘贴', icon: FileText }
] as const;

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<typeof TABS[number]['id']>('upload');
  const navigate = useNavigate();
  const { setConfig } = useMoonshotStore();

  const handleTabChange = useCallback((tabId: typeof TABS[number]['id']) => {
    setActiveTab(tabId);
  }, []);

  const handleSettingsSave = useCallback((settings: any) => {
    setConfig(settings);
  }, [setConfig]);

  const handleFileSubmit = useCallback(async (files: File[]) => {
    navigate('/analysis', { 
      state: { 
        content: files,
        type: 'file'
      } 
    });
  }, [navigate]);

  const handleTextSubmit = useCallback(async (text: string) => {
    navigate('/analysis', { 
      state: { 
        content: text,
        type: 'text'
      } 
    });
  }, [navigate]);

  React.useEffect(() => {
    const handleOpenSettings = () => setIsSettingsOpen(true);
    window.addEventListener('openSettings', handleOpenSettings);
    return () => window.removeEventListener('openSettings', handleOpenSettings);
  }, []);

  return (
    <Routes>
      <Route path="/" element={
        <MainLayout>
          <div className="max-w-4xl mx-auto w-full">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="flex border-b">
                {TABS.map((tab) => (
                  <Tab
                    key={tab.id}
                    id={tab.id}
                    label={tab.label}
                    icon={tab.icon}
                    isActive={activeTab === tab.id}
                    onClick={() => handleTabChange(tab.id)}
                  />
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'upload' ? (
                  <FileUpload onSubmit={handleFileSubmit} />
                ) : (
                  <TextInput onSubmit={handleTextSubmit} />
                )}
              </div>
            </div>
          </div>

          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            onSave={handleSettingsSave}
          />
        </MainLayout>
      } />
      <Route path="/analysis" element={<AnalysisPage />} />
      <Route path="/debug" element={<DebugPage />} />
    </Routes>
  );
}

export default App;