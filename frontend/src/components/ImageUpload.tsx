'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploadProps {
  onChange: (file: File) => void;
  value?: File | string; // Can be a File object or a URL string
  label?: string;
}

export default function ImageUpload({ onChange, value, label = 'Upload Image' }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(
    typeof value === 'string' ? value : null
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      onChange(file);
      setPreview(URL.createObjectURL(file));
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'}
          ${preview ? 'h-64' : 'h-32'}
        `}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="relative w-full h-full">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-contain rounded-md" 
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-md">
                <p className="text-white font-medium">Click or drop to change</p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-1 text-sm text-gray-600">
              {isDragActive ? 'Drop image here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
          </div>
        )}
      </div>
    </div>
  );
}
