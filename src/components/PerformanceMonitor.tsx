'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              setMetrics(prev => ({ ...prev, firstContentfulPaint: entry.startTime }));
            }
            break;
          case 'largest-contentful-paint':
            setMetrics(prev => ({ ...prev, largestContentfulPaint: entry.startTime }));
            break;
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              setMetrics(prev => ({ 
                ...prev, 
                cumulativeLayoutShift: (prev.cumulativeLayoutShift || 0) + (entry as any).value 
              }));
            }
            break;
          case 'first-input':
            setMetrics(prev => ({ ...prev, firstInputDelay: (entry as any).processingStart - entry.startTime }));
            break;
        }
      }
    });

    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift', 'first-input'] });

    // Page load time
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      setMetrics(prev => ({ ...prev, loadTime }));
    });

    return () => observer.disconnect();
  }, []);

  const formatTime = (time: number) => `${Math.round(time)}ms`;
  const getScoreColor = (metric: keyof PerformanceMetrics, value: number) => {
    const thresholds = {
      loadTime: { good: 2000, poor: 4000 },
      firstContentfulPaint: { good: 1800, poor: 3000 },
      largestContentfulPaint: { good: 2500, poor: 4000 },
      cumulativeLayoutShift: { good: 0.1, poor: 0.25 },
      firstInputDelay: { good: 100, poor: 300 }
    };

    const threshold = thresholds[metric];
    if (value <= threshold.good) return 'text-green-600';
    if (value <= threshold.poor) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-mono mb-2 block ml-auto"
      >
        Perf {isVisible ? '−' : '+'}
      </button>
      
      {isVisible && (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80 text-sm font-mono">
          <h3 className="font-bold mb-3 text-gray-900">Performance Metrics</h3>
          
          <div className="space-y-2">
            {metrics.loadTime && (
              <div className="flex justify-between">
                <span>Load Time:</span>
                <span className={getScoreColor('loadTime', metrics.loadTime)}>
                  {formatTime(metrics.loadTime)}
                </span>
              </div>
            )}
            
            {metrics.firstContentfulPaint && (
              <div className="flex justify-between">
                <span>FCP:</span>
                <span className={getScoreColor('firstContentfulPaint', metrics.firstContentfulPaint)}>
                  {formatTime(metrics.firstContentfulPaint)}
                </span>
              </div>
            )}
            
            {metrics.largestContentfulPaint && (
              <div className="flex justify-between">
                <span>LCP:</span>
                <span className={getScoreColor('largestContentfulPaint', metrics.largestContentfulPaint)}>
                  {formatTime(metrics.largestContentfulPaint)}
                </span>
              </div>
            )}
            
            {metrics.cumulativeLayoutShift !== undefined && (
              <div className="flex justify-between">
                <span>CLS:</span>
                <span className={getScoreColor('cumulativeLayoutShift', metrics.cumulativeLayoutShift)}>
                  {metrics.cumulativeLayoutShift.toFixed(3)}
                </span>
              </div>
            )}
            
            {metrics.firstInputDelay && (
              <div className="flex justify-between">
                <span>FID:</span>
                <span className={getScoreColor('firstInputDelay', metrics.firstInputDelay)}>
                  {formatTime(metrics.firstInputDelay)}
                </span>
              </div>
            )}
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Bundle size:</span>
              <span>{(document.documentElement.innerHTML.length / 1024).toFixed(1)}KB</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 