'use client';

import { useState } from 'react';
import { Download, Share2, ShoppingCart, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { downloadImage, formatPrice, getCategoryNameKo } from '@/lib/utils';
import type { ClothingItem } from '@/types';

interface TryOnResultProps {
  originalImage: string;
  resultImage: string;
  selectedItems: ClothingItem[];
  onReset: () => void;
}

export function TryOnResult({ originalImage, resultImage, selectedItems, onReset }: TryOnResultProps) {
  const [showComparison, setShowComparison] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleDownload = () => {
    downloadImage(resultImage, `virtual-tryon-${Date.now()}.png`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Virtual Try-On 결과',
          text: '가상 피팅 결과를 확인해보세요!',
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다.');
    }
  };

  const handleAddToCart = () => {
    alert(`${selectedItems.length}개의 상품이 장바구니에 추가되었습니다. (데모)`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">✨ 피팅 결과</h2>
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
        >
          <RefreshCw className="w-4 h-4" />
          {showComparison ? '결과만 보기' : '비교 보기'}
        </button>
      </div>

      {/* Result Image */}
      <div className="relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
        {showComparison ? (
          // Comparison slider view
          <div className="relative aspect-[3/4]">
            <img
              src={originalImage}
              alt="Original"
              className="absolute inset-0 w-full h-full object-contain"
            />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={resultImage}
                alt="Result"
                className="absolute inset-0 w-full h-full object-contain"
                style={{ width: `${100 / (sliderPosition / 100)}%`, maxWidth: 'none' }}
              />
            </div>
            {/* Slider handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                <ChevronLeft className="w-3 h-3 text-gray-600" />
                <ChevronRight className="w-3 h-3 text-gray-600" />
              </div>
            </div>
            {/* Slider input */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
            />
            {/* Labels */}
            <div className="absolute bottom-4 left-4 px-2 py-1 bg-black/60 text-white text-xs rounded">
              결과
            </div>
            <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/60 text-white text-xs rounded">
              원본
            </div>
          </div>
        ) : (
          // Single result view
          <img
            src={resultImage}
            alt="Try-on result"
            className="w-full h-auto max-h-[600px] object-contain"
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <Download className="w-4 h-4" />
          다운로드
        </button>
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Selected Items Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="font-medium mb-3">착용한 의류</h3>
        <div className="space-y-3">
          {selectedItems.map(item => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.image_url}
                  alt={item.name_ko}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="w-full h-full flex items-center justify-center hidden">
                  <span className="text-3xl">
                    {item.category === 'top' && '👕'}
                    {item.category === 'bottom' && '👖'}
                    {item.category === 'dress' && '👗'}
                    {item.category === 'outerwear' && '🧥'}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">{item.brand}</p>
                <p className="font-medium">{item.name_ko}</p>
                <p className="text-sm text-gray-600">
                  {getCategoryNameKo(item.category)}
                  {item.price && ` · ${formatPrice(item.price)}`}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <ShoppingCart className="w-4 h-4" />
          모두 장바구니에 담기
          {selectedItems.some(i => i.price) && (
            <span className="ml-1">
              ({formatPrice(selectedItems.reduce((sum, i) => sum + (i.price || 0), 0))})
            </span>
          )}
        </button>
      </div>

      {/* Try Again */}
      <p className="text-center text-sm text-gray-500">
        마음에 들지 않나요?{' '}
        <button onClick={onReset} className="text-primary hover:underline">
          다른 의류로 다시 시도하기
        </button>
      </p>
    </div>
  );
}
