// src/components/LoadingSpinner.jsx
import React from 'react';

export default function LoadingSpinner({ label = 'Loading…', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 rounded-full border-4 border-surface-container-high border-t-primary animate-spin" />
      {label && (
        <p className="text-body-sm font-body-sm text-on-surface-variant">{label}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        {content}
      </div>
    );
  }
  return <div className="flex items-center justify-center py-12">{content}</div>;
}