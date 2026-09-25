// src/components/ErrorBoundary.jsx
import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('React error boundary caught:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="max-w-2xl w-full bg-error-container text-on-error-container rounded-2xl p-8">
            <h2 className="text-headline-md font-headline-md font-bold mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined">error</span>
              Something crashed
            </h2>
            <p className="font-body-md mb-4">
              An error occurred while rendering this page. Details below:
            </p>
            <pre className="bg-white/60 rounded-lg p-4 text-xs overflow-auto whitespace-pre-wrap break-words font-mono max-h-96">
              {String(this.state.error?.message || this.state.error)}
              {'\n\n'}
              {String(this.state.error?.stack || '')}
            </pre>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 rounded-full bg-error text-on-error font-label-md hover:opacity-90"
              >
                Reload page
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/login';
                }}
                className="px-6 py-2 rounded-full border-2 border-error text-error font-label-md hover:bg-white/40"
              >
                Clear session & go to login
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}