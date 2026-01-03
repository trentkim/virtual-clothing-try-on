'use client';

import { useCallback, useRef, useState } from 'react';
import { Upload, Camera, X, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  preview: string | null;
  onUpload: (file: File, preview: string) => void;
  onClear: () => void;
}

export function ImageUploader({ preview, onUpload, onClear }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onUpload(file, reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  if (preview) {
    return (
      <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-white">
        <img
          src={preview}
          alt="Uploaded"
          className="w-full h-auto max-h-[400px] object-contain"
        />
        <button
          onClick={onClear}
          className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors"
        >
          <X className="w-4 h-4 text-gray-700" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white text-sm">✅ 사진이 업로드되었습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
        isDragging 
          ? "border-primary bg-primary/5" 
          : "border-gray-300 hover:border-gray-400 bg-white"
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
        
        <div>
          <p className="text-gray-700 font-medium mb-1">
            사진을 업로드하세요
          </p>
          <p className="text-sm text-gray-500">
            전신 사진을 권장합니다
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Upload className="w-4 h-4" />
            파일 선택
          </button>
          <button
            onClick={() => {/* TODO: Implement webcam */}}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Camera className="w-4 h-4" />
            웹캠
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-2">
          PNG, JPG, WEBP (최대 10MB)
        </p>
      </div>
    </div>
  );
}
