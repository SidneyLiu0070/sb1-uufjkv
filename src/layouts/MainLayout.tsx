import React from 'react';
import { Settings, FileUp, Bug } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ReadonlyLayoutProps } from '../types/layout';

const MainLayout = React.memo(({ children, title = '工艺流程分析' }: ReadonlyLayoutProps) => {
  const handleSettingsClick = React.useCallback(() => {
    window.dispatchEvent(new CustomEvent('openSettings'));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FileUp className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                {title}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/debug"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                title="调试页面"
              >
                <Bug className="h-6 w-6 text-gray-600" />
              </Link>
              <button
                onClick={handleSettingsClick}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                title="设置"
              >
                <Settings className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="mt-auto py-6 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} 工艺流程分析系统
          </p>
        </div>
      </footer>
    </div>
  );
});

MainLayout.displayName = 'MainLayout';

export default MainLayout;