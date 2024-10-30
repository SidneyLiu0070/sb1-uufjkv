import React from 'react';
import { Send, Loader } from 'lucide-react';
import { ReadonlySubmitButtonProps } from '../types/components';

const SubmitButton = React.memo(function SubmitButton({ 
  onSubmit, 
  isSubmitting, 
  disabled 
}: ReadonlySubmitButtonProps) {
  return (
    <button
      onClick={onSubmit}
      disabled={disabled || isSubmitting}
      className={`
        w-full px-4 py-3 rounded-lg flex items-center justify-center gap-2
        font-medium transition-all duration-200
        ${
          disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : isSubmitting
            ? 'bg-blue-100 text-blue-400 cursor-wait'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }
      `}
    >
      {isSubmitting ? (
        <>
          <Loader className="h-5 w-5 animate-spin" />
          处理中...
        </>
      ) : (
        <>
          <Send className="h-5 w-5" />
          开始分析
        </>
      )}
    </button>
  );
});

export default SubmitButton;