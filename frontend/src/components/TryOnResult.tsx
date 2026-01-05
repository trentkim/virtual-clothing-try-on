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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✨</span>
          <h2 className="text-lg font-bold text-gray-900">피팅 결과</h2>
        </div>
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-2 rounded-lg transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          {showComparison ? '결과만' : '비교'}
        </button>
      </div>

      {/* Result Image */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-purple-200 shadow-soft">
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
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 gradient-primary rounded-full shadow-lg flex items-center justify-center">
                <ChevronLeft className="w-4 h-4 text-white -ml-1" />
                <ChevronRight className="w-4 h-4 text-white -mr-1" />
              </div>
            </div>
            {/* Slider input */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />
            {/* Labels */}
            <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
              결과
            </div>
            <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
              원본
            </div>
          </div>
        ) : (
          // Single result view
          <img
            src={resultImage}
            alt="Try-on result"
            className="w-full h-auto max-h-[500px] sm:max-h-[600px] object-contain"
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 gradient-primary text-white rounded-xl font-bold hover:shadow-lg transition-all active:scale-95"
        >
          <Download className="w-5 h-5" />
          다운로드
        </button>
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 py-3.5 px-4 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all active:scale-95"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Selected Items Summary */}
      <div className="bg-white border-2 border-purple-200 rounded-2xl p-5 shadow-card">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-lg">👔</span>
          착용한 의류
        </h3>
        <div className="space-y-3">
          {selectedItems.map(item => (
            <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 transition-colors">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
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
                <p className="text-xs text-gray-500 font-medium">{item.brand}</p>
                <p className="font-semibold text-gray-900">{item.name_ko}</p>
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
          className="w-full mt-5 flex items-center justify-center gap-2 py-3.5 px-4 gradient-secondary text-white rounded-xl font-bold hover:shadow-lg transition-all active:scale-95"
        >
          <ShoppingCart className="w-5 h-5" />
          모두 장바구니에 담기
          {selectedItems.some(i => i.price) && (
            <span className="ml-1">
              ({formatPrice(selectedItems.reduce((sum, i) => sum + (i.price || 0), 0))})
            </span>
          )}
        </button>
      </div>

      {/* Try Again */}
      <p className="text-center text-sm text-gray-600">
        마음에 들지 않나요?{' '}
        <button onClick={onReset} className="text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors">
          다른 의류로 다시 시도하기
        </button>
      </p>
    </div>
  );
}
