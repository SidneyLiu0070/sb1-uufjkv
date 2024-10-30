import React from 'react';
import { ReadonlyTabProps } from '../types/layout';
import { LucideIcon } from 'lucide-react';

interface TabProps extends ReadonlyTabProps {
  icon: LucideIcon;
}

const Tab: React.FC<TabProps> = React.memo(({ id, label, icon: Icon, isActive, onClick }) => (
  <button
    className={`
      flex-1 px-6 py-4 text-sm font-medium flex items-center justify-center gap-2
      transition-all duration-200 ease-in-out
      ${
        isActive
          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }
    `}
    onClick={onClick}
  >
    <Icon className="h-4 w-4" />
    {label}
  </button>
));

Tab.displayName = 'Tab';

export default Tab;