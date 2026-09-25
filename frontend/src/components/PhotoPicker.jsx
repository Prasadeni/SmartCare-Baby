// src/components/PhotoPicker.jsx
import React, { useRef, useState } from 'react';
import {
  readImageAsDataUrl,
  formatFileSize,
  IMAGE_ACCEPT,
} from '../utils/imageUpload';

export default function PhotoPicker({
  value,
  onChange,
  size = 'w-24 h-24',
  fallback,
  hint = 'JPG or PNG · Max 2 MB',
  maxSizeMB = 2,
}) {
  const inputRef = useRef(null);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);

  const handlePick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    try {
      const dataUrl = await readImageAsDataUrl(file, { maxSizeMB });
      setFileName(file.name);
      setFileSize(file.size);
      onChange(dataUrl);
    } catch (err) {
      setError(err.message);
      e.target.value = ''; // allow re-picking the same file
    }
  };

  const handleRemove = () => {
    onChange('');
    setFileName('');
    setFileSize(0);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <div className="flex flex-col items-center gap-3">
        {/* Preview */}
        {value ? (
          <img
            src={value}
            alt="Preview"
            className={`${size} rounded-full object-cover border-4 border-white shadow-lg`}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <div
            className={`${size} rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-3xl font-bold font-headline border-4 border-white shadow-lg`}
          >
            {fallback || (
              <span className="material-symbols-outlined text-4xl">
                add_a_photo
              </span>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-primary text-primary text-label-md font-label-md hover:bg-primary-fixed transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">upload</span>
            {value ? 'Change Photo' : 'Choose Photo'}
          </button>

          {value && (
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-outline-variant text-on-surface-variant text-label-md font-label-md hover:bg-error-container hover:text-error hover:border-error transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
              Remove
            </button>
          )}
        </div>

        {/* Meta / hint */}
        <p className="text-label-md font-label-md text-on-surface-variant text-center">
          {fileName
            ? `${fileName} · ${formatFileSize(fileSize)}`
            : hint}
        </p>
      </div>

      {/* Inline error */}
      {error && (
        <div className="mt-3 bg-error-container text-on-error-container px-3 py-2 rounded-xl text-body-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">error</span>
          {error}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        onChange={handlePick}
        className="hidden"
      />
    </div>
  );
}