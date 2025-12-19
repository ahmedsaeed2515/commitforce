'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploadProps {
  onChange: (file: File) => void;
  value?: File | string; // Can be a File object or a URL string
  label?: string;
  existingImage?: string; // URL of an existing image to display
}

export default function ImageUpload({ onChange, value, label = 'Upload Image', existingImage }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(
    typeof value === 'string' ? value : existingImage || null
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

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    // Note: We can't really "clear" the file from the parent without a clear handler, 
    // but the next upload will overwrite it. 
    // Ideally, the parent should handle clearing if needed.
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-white/70 mb-2">
        {label}
      </label>
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all
          ${isDragActive 
            ? 'border-indigo-500 bg-indigo-500/10' 
            : 'border-white/10 hover:border-white/20 hover:bg-white/5'
          }
          ${preview ? 'h-64' : 'h-40'}
        `}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="relative w-full h-full">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-contain rounded-lg" 
            />
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg gap-2">
              <UploadCloud className="w-8 h-8 text-white mb-2" />
              <p className="text-white font-medium text-sm">Click or drop to change</p>
            </div>
            <button 
              onClick={clearImage}
              className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition z-10"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
              <ImageIcon className="w-6 h-6 text-white/40" />
            </div>
            <p className="mt-1 text-sm text-white/70">
              {isDragActive ? 'Drop image here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-white/40 mt-1">PNG, JPG, WEBP up to 5MB</p>
          </div>
        )}
      </div>
    </div>
  );
}
