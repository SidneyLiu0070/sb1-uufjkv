import React from 'react';
import { ReadonlyAnalysisLayoutProps } from '../types/analysis';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AnalysisLayout = Object.freeze(React.memo(function AnalysisLayout({
  children,
  sidebarContent,
  isCollapsed,
  onToggleCollapse,
}: ReadonlyAnalysisLayoutProps) {
  return (
    <div className="flex h-[calc(100vh-8rem)] bg-gray-50">
      <div
        className={`
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-0' : 'w-2/5'}
          bg-white border-r border-gray-200
        `}
      >
        {sidebarContent}
      </div>
      
      <button
        onClick={onToggleCollapse}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10
          bg-white border border-gray-200 rounded-r-lg p-2 shadow-md
          hover:bg-gray-50 transition-all duration-200"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      <div className={`
        flex-1 transition-all duration-300 ease-in-out
        ${isCollapsed ? 'ml-0' : 'ml-4'}
      `}>
        {children}
      </div>
    </div>
  );
}));

export default AnalysisLayout;