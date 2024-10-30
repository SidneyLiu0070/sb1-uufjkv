import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle className="h-6 w-6" />
              <h2 className="text-lg font-semibold">出错了</h2>
            </div>
            <p className="text-gray-600">
              {this.state.error?.message || '发生了意外错误，请刷新页面重试'}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}