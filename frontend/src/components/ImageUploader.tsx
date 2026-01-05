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
      <div className="relative rounded-xl overflow-hidden border-2 border-purple-200 bg-white shadow-card">
        <img
          src={preview}
          alt="Uploaded"
          className="w-full h-auto max-h-[350px] sm:max-h-[400px] object-contain bg-gray-50"
        />
        <button
          onClick={onClear}
          className="absolute top-3 right-3 p-2 bg-white/95 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
        >
          <X className="w-4 h-4 text-gray-700" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-white text-sm font-medium">사진이 업로드되었습니다</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all",
        isDragging 
          ? "border-purple-500 bg-purple-50 scale-[0.98]" 
          : "border-gray-300 hover:border-purple-400 bg-white hover:bg-purple-50/30"
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

      <div className="flex flex-col items-center gap-3 sm:gap-4">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
          <ImageIcon className="w-7 h-7 sm:w-8 sm:h-8 text-purple-600" />
        </div>
        
        <div>
          <p className="text-gray-900 font-semibold mb-1 text-sm sm:text-base">
            사진을 업로드하세요
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            전신 사진을 권장합니다
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 gradient-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all hover:shadow-lg active:scale-95"
          >
            <Upload className="w-4 h-4" />
            파일 선택
          </button>
          <button
            onClick={() => {/* TODO: Implement webcam */}}
            className="flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:border-purple-400 hover:bg-purple-50 transition-all active:scale-95"
          >
            <Camera className="w-4 h-4" />
            웹캠
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-1">
          PNG, JPG, WEBP (최대 10MB)
        </p>
      </div>
    </div>
  );
}
