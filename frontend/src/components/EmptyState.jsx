// src/components/EmptyState.jsx
import React from 'react';

export default function EmptyState({
  icon = 'inbox',
  title,
  message,
  primaryAction,
  secondaryAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-primary-fixed flex items-center justify-center mb-5">
        <span
          className="material-symbols-outlined text-primary text-4xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
      </div>
      <h3 className="text-headline-md font-headline-md text-on-surface mb-2">
        {title}
      </h3>
      {message && (
        <p className="text-body-md font-body-md text-on-surface-variant max-w-md mb-6">
          {message}
        </p>
      )}
      <div className="flex flex-wrap gap-3 justify-center">
        {secondaryAction}
        {primaryAction}
      </div>
    </div>
  );
}