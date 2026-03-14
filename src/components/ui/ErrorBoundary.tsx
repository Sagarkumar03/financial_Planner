"use client";

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { 
      hasError: true, 
      error 
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Log error for monitoring (in production, send to error tracking service)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <this.props.fallback error={this.state.error} retry={this.retry} />;
      }

      return (
        <CalculatorErrorFallback 
          error={this.state.error} 
          retry={this.retry}
        />
      );
    }

    return this.props.children;
  }
}

const CalculatorErrorFallback: React.FC<{ error?: Error; retry: () => void }> = ({ error, retry }) => (
  <div className="min-h-[400px] flex items-center justify-center p-6" role="alert">
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 max-w-md text-center">
      <div className="text-red-600 dark:text-red-400 text-4xl mb-4">⚠️</div>
      <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
        Calculator Error
      </h3>
      <p className="text-red-700 dark:text-red-300 text-sm mb-4">
        Something went wrong with the calculation. This might be due to invalid input values or a temporary issue.
      </p>
      {process.env.NODE_ENV === 'development' && error && (
        <details className="text-left bg-red-100 dark:bg-red-900/30 p-3 rounded text-xs mb-4">
          <summary className="cursor-pointer font-medium">Error Details</summary>
          <pre className="mt-2 whitespace-pre-wrap">{error.message}</pre>
        </details>
      )}
      <div className="space-x-3">
        <button
          onClick={retry}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Reload Page
        </button>
      </div>
    </div>
  </div>
);

export default ErrorBoundary;