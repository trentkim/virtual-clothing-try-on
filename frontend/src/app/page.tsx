'use client';

import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { ImageUploader } from '@/components/ImageUploader';
import { ClothingGallery } from '@/components/ClothingGallery';
import { TryOnResult } from '@/components/TryOnResult';
import { SelectedItems } from '@/components/SelectedItems';
import { api } from '@/lib/api';
import type { ClothingItem, TryOnState } from '@/types';

export default function Home() {
  const [state, setState] = useState<TryOnState>({
    userImage: null,
    userImagePreview: null,
    selectedClothing: [],
    resultImage: null,
    isProcessing: false,
    error: null,
  });

  const handleImageUpload = useCallback((file: File, preview: string) => {
    setState(prev => ({
      ...prev,
      userImage: file,
      userImagePreview: preview,
      resultImage: null,
      error: null,
    }));
  }, []);

  const handleClearImage = useCallback(() => {
    setState(prev => ({
      ...prev,
      userImage: null,
      userImagePreview: null,
      resultImage: null,
    }));
  }, []);

  const handleSelectClothing = useCallback((item: ClothingItem) => {
    setState(prev => {
      const isSelected = prev.selectedClothing.some(c => c.id === item.id);
      
      if (isSelected) {
        return {
          ...prev,
          selectedClothing: prev.selectedClothing.filter(c => c.id !== item.id),
        };
      }
      
      // Limit to 3 items for better results
      if (prev.selectedClothing.length >= 3) {
        return {
          ...prev,
          error: '최대 3개의 의류 아이템만 선택할 수 있습니다.',
        };
      }
      
      return {
        ...prev,
        selectedClothing: [...prev.selectedClothing, item],
        error: null,
      };
    });
  }, []);

  const handleRemoveClothing = useCallback((itemId: string) => {
    setState(prev => ({
      ...prev,
      selectedClothing: prev.selectedClothing.filter(c => c.id !== itemId),
    }));
  }, []);

  const handleTryOn = useCallback(async () => {
    if (!state.userImage || state.selectedClothing.length === 0) {
      setState(prev => ({
        ...prev,
        error: '사진과 의류를 모두 선택해주세요.',
      }));
      return;
    }

    setState(prev => ({ ...prev, isProcessing: true, error: null }));

    try {
      const clothingIds = state.selectedClothing.map(c => c.id);
      const response = await api.tryOn(state.userImage, clothingIds, 'high');

      if (response.success && response.result_image_base64) {
        setState(prev => ({
          ...prev,
          resultImage: `data:image/png;base64,${response.result_image_base64}`,
          isProcessing: false,
        }));
      } else {
        throw new Error(response.message || 'Try-on 처리에 실패했습니다.');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: error instanceof Error ? error.message : 'Try-on 처리 중 오류가 발생했습니다.',
      }));
    }
  }, [state.userImage, state.selectedClothing]);

  const handleReset = useCallback(() => {
    setState({
      userImage: null,
      userImagePreview: null,
      selectedClothing: [],
      resultImage: null,
      isProcessing: false,
      error: null,
    });
  }, []);

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Error Message */}
        {state.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {state.error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image Upload */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-lg font-semibold mb-4">1. 사진 업로드</h2>
              <ImageUploader
                preview={state.userImagePreview}
                onUpload={handleImageUpload}
                onClear={handleClearImage}
              />
              
              {/* Selected Items */}
              {state.selectedClothing.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-4">선택한 의류</h2>
                  <SelectedItems
                    items={state.selectedClothing}
                    onRemove={handleRemoveClothing}
                  />
                </div>
              )}

              {/* Try-On Button */}
              <button
                onClick={handleTryOn}
                disabled={!state.userImage || state.selectedClothing.length === 0 || state.isProcessing}
                className="mt-6 w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:opacity-90 transition-opacity"
              >
                {state.isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    처리 중...
                  </span>
                ) : (
                  '🎨 가상 피팅 시작'
                )}
              </button>

              {state.resultImage && (
                <button
                  onClick={handleReset}
                  className="mt-3 w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium
                           hover:bg-gray-50 transition-colors"
                >
                  처음부터 다시하기
                </button>
              )}
            </div>
          </div>

          {/* Middle Column - Clothing Gallery or Result */}
          <div className="lg:col-span-2">
            {state.resultImage ? (
              <TryOnResult
                originalImage={state.userImagePreview!}
                resultImage={state.resultImage}
                selectedItems={state.selectedClothing}
                onReset={handleReset}
              />
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-4">2. 의류 선택</h2>
                <ClothingGallery
                  selectedIds={state.selectedClothing.map(c => c.id)}
                  onSelect={handleSelectClothing}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
