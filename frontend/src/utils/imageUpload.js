// src/utils/imageUpload.js

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

/**
 * Read a File as a base64 data URL, after validating type and size.
 * @returns {Promise<string>} data URL (e.g. "data:image/jpeg;base64,...")
 */
export function readImageAsDataUrl(file, { maxSizeMB = 2 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file selected'));
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      reject(new Error('Please choose a JPG or PNG image'));
      return;
    }
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      reject(new Error(`Image is too large — max ${maxSizeMB} MB`));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read the image'));
    reader.readAsDataURL(file);
  });
}

export function formatFileSize(bytes) {
  if (!bytes) return '0 KB';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export const IMAGE_ACCEPT = 'image/jpeg,image/png';