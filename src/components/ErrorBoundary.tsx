'use client';

import React, { Component, ReactNode } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import {
  ExclamationTriangleIcon,
  HomeIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // In production, you would send this to an error reporting service
    // like Sentry, LogRocket, or Bugsnag
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReportError = () => {
    const { error, errorInfo } = this.state;
    const errorReport = {
      error: error?.toString(),
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // In a real app, send this to your error reporting service
    console.log('Error Report:', errorReport);
    
    // For demo, just copy to clipboard
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2))
      .then(() => alert('Error report copied to clipboard'))
      .catch(() => alert('Failed to copy error report'));
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center"
            >
              <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
            </motion.div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Oops! Something went wrong
            </h1>

            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Don't worry, our team has been notified.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left"
              >
                <h3 className="text-sm font-medium text-red-800 mb-2">
                  Development Error Details:
                </h3>
                <pre className="text-xs text-red-700 overflow-auto max-h-32">
                  {this.state.error.toString()}
                </pre>
              </motion.div>
            )}

            <div className="space-y-3">
              <Button
                onClick={this.handleRetry}
                className="w-full"
                size="lg"
              >
                <ArrowPathIcon className="w-5 h-5 mr-2" />
                Try Again
              </Button>

              <Button
                onClick={this.handleGoHome}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <HomeIcon className="w-5 h-5 mr-2" />
                Go to Homepage
              </Button>

              {process.env.NODE_ENV === 'development' && (
                <Button
                  onClick={this.handleReportError}
                  variant="outline"
                  className="w-full text-gray-600"
                  size="sm"
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                  Copy Error Report
                </Button>
              )}
            </div>

            <p className="text-xs text-gray-500 mt-6">
              Error ID: {Date.now().toString(36)}
            </p>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export default function ErrorBoundaryWrapper({ 
  children, 
  fallback, 
  onError 
}: Props) {
  return (
    <ErrorBoundary fallback={fallback} onError={onError}>
      {children}
    </ErrorBoundary>
  );
}

// Specialized error boundaries for different contexts
export function PropertyErrorBoundary({ children }: { children: ReactNode }) {
  const customFallback = (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-red-800 mb-2">
        Failed to load property data
      </h3>
      <p className="text-red-700 mb-4">
        There was an issue loading this property. Please try refreshing the page.
      </p>
      <Button
        onClick={() => window.location.reload()}
        variant="outline"
        size="sm"
      >
        Refresh Page
      </Button>
    </div>
  );

  return (
    <ErrorBoundary fallback={customFallback}>
      {children}
    </ErrorBoundary>
  );
}

export function SearchErrorBoundary({ children }: { children: ReactNode }) {
  const customFallback = (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
      <ExclamationTriangleIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-yellow-800 mb-2">
        Search temporarily unavailable
      </h3>
      <p className="text-yellow-700 mb-4">
        We're having trouble with the search function. Please try again in a moment.
      </p>
      <Button
        onClick={() => window.location.href = '/listings'}
        variant="outline"
        size="sm"
      >
        Browse All Properties
      </Button>
    </div>
  );

  return (
    <ErrorBoundary fallback={customFallback}>
      {children}
    </ErrorBoundary>
  );
} 