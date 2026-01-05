'use client';

import { useState, useEffect } from 'react';
import { cn, formatPrice, getCategoryNameKo } from '@/lib/utils';
import type { ClothingItem, ClothingCategory } from '@/types';

// Sample data - in production, this would come from the API
const SAMPLE_CLOTHING: ClothingItem[] = [
  {
    id: 'top-001',
    name: 'Classic White T-Shirt',
    name_ko: '클래식 화이트 티셔츠',
    category: 'top',
    image_url: '/images/clothing/top-001.png',
    price: 29000,
    brand: 'Essential',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White'],
    description: '편안한 착용감의 기본 화이트 티셔츠',
  },
  {
    id: 'top-002',
    name: 'Navy Blue Polo Shirt',
    name_ko: '네이비 블루 폴로셔츠',
    category: 'top',
    image_url: '/images/clothing/top-002.png',
    price: 49000,
    brand: 'Essential',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy'],
    description: '세미 캐주얼 스타일의 네이비 폴로셔츠',
  },
  {
    id: 'top-003',
    name: 'Striped Casual Shirt',
    name_ko: '스트라이프 캐주얼 셔츠',
    category: 'top',
    image_url: '/images/clothing/top-003.png',
    price: 59000,
    brand: 'Urban Style',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blue/White'],
    description: '시원한 느낌의 스트라이프 캐주얼 셔츠',
  },
  {
    id: 'bottom-001',
    name: 'Classic Blue Jeans',
    name_ko: '클래식 블루 진',
    category: 'bottom',
    image_url: '/images/clothing/bottom-001.png',
    price: 79000,
    brand: 'Denim Co',
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Blue'],
    description: '편안한 스트레이트 핏 블루 데님',
  },
  {
    id: 'bottom-002',
    name: 'Black Chino Pants',
    name_ko: '블랙 치노 팬츠',
    category: 'bottom',
    image_url: '/images/clothing/bottom-002.png',
    price: 69000,
    brand: 'Urban Style',
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Black'],
    description: '다용도로 활용 가능한 블랙 치노 팬츠',
  },
  {
    id: 'dress-001',
    name: 'Floral Summer Dress',
    name_ko: '플로럴 서머 드레스',
    category: 'dress',
    image_url: '/images/clothing/dress-001.png',
    price: 89000,
    brand: 'Bloom',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Floral Print'],
    description: '화사한 플로럴 패턴의 여름 원피스',
  },
  {
    id: 'dress-002',
    name: 'Elegant Black Dress',
    name_ko: '엘레강스 블랙 드레스',
    category: 'dress',
    image_url: '/images/clothing/dress-002.png',
    price: 129000,
    brand: 'Elegance',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Black'],
    description: '포멀한 자리에 어울리는 블랙 드레스',
  },
  {
    id: 'outerwear-001',
    name: 'Denim Jacket',
    name_ko: '데님 재킷',
    category: 'outerwear',
    image_url: '/images/clothing/outerwear-001.png',
    price: 99000,
    brand: 'Denim Co',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blue'],
    description: '캐주얼한 데님 재킷',
  },
  {
    id: 'outerwear-002',
    name: 'Beige Trench Coat',
    name_ko: '베이지 트렌치코트',
    category: 'outerwear',
    image_url: '/images/clothing/outerwear-002.png',
    price: 189000,
    brand: 'Classic',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Beige'],
    description: '클래식한 베이지 트렌치코트',
  },
  {
    id: 'top-004',
    name: 'Black Tank Top',
    name_ko: '블랙 탱크탑',
    category: 'top',
    image_url: '/images/clothing/top-004.png',
    price: 19000,
    brand: 'Essential',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Black'],
    description: '기본 블랙 탱크탑',
  },
];

const CATEGORIES: { value: ClothingCategory | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'top', label: '상의' },
  { value: 'bottom', label: '하의' },
  { value: 'dress', label: '원피스' },
  { value: 'outerwear', label: '아우터' },
];

interface ClothingGalleryProps {
  selectedIds: string[];
  onSelect: (item: ClothingItem) => void;
}

export function ClothingGallery({ selectedIds, onSelect }: ClothingGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<ClothingCategory | 'all'>('all');
  const [items, setItems] = useState<ClothingItem[]>(SAMPLE_CLOTHING);

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter(item => item.category === activeCategory);

  return (
    <div>
      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all shadow-sm",
              activeCategory === cat.value
                ? "gradient-primary text-white shadow-md scale-105"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {filteredItems.map(item => {
          const isSelected = selectedIds.includes(item.id);
          
          return (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className={cn(
                "group cursor-pointer rounded-xl overflow-hidden border-2 transition-all shadow-card hover:shadow-soft active:scale-95",
                isSelected
                  ? "border-purple-500 ring-2 ring-purple-200 shadow-soft"
                  : "border-gray-200 hover:border-purple-300"
              )}
            >
              {/* Image */}
              <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100">
                <img
                  src={item.image_url}
                  alt={item.name_ko}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
                {/* Placeholder for missing images */}
                <div className="absolute inset-0 flex items-center justify-center hidden">
                  <div className="text-5xl sm:text-6xl">
                    {item.category === 'top' && '👕'}
                    {item.category === 'bottom' && '👖'}
                    {item.category === 'dress' && '👗'}
                    {item.category === 'outerwear' && '🧥'}
                  </div>
                </div>
                
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-7 h-7 gradient-primary rounded-full flex items-center justify-center shadow-lg animate-[pulse_2s_ease-in-out_infinite]">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}

                {/* Category badge */}
                <div className="absolute bottom-2 left-2">
                  <span className="px-2.5 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                    {getCategoryNameKo(item.category)}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-3 bg-white">
                <p className="text-xs text-gray-500 mb-1 font-medium">{item.brand}</p>
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5 line-clamp-1">
                  {item.name_ko}
                </h3>
                {item.price && (
                  <p className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                    {formatPrice(item.price)}
                  </p>
                )}
                <div className="flex gap-1 mt-2">
                  {item.sizes.slice(0, 4).map(size => (
                    <span key={size} className="text-xs text-gray-400 font-medium">
                      {size}
                    </span>
                  ))}
                  {item.sizes.length > 4 && (
                    <span className="text-xs text-gray-400 font-medium">+{item.sizes.length - 4}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-sm">해당 카테고리에 상품이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
