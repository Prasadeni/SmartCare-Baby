// src/components/ErrorState.jsx
import React from 'react';

export default function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-error-container flex items-center justify-center mb-4">
        <span
          className="material-symbols-outlined text-error text-3xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          error
        </span>
      </div>
      <h3 className="text-headline-sm font-headline-sm text-on-surface mb-1">
        {title}
      </h3>
      {message && (
        <p className="text-body-sm font-body-sm text-on-surface-variant max-w-md mb-4">
          {message}
        </p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      )}
    </div>
  );
}