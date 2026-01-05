'use client';

import { X } from 'lucide-react';
import { formatPrice, getCategoryNameKo } from '@/lib/utils';
import type { ClothingItem } from '@/types';

interface SelectedItemsProps {
  items: ClothingItem[];
  onRemove: (itemId: string) => void;
}

export function SelectedItems({ items, onRemove }: SelectedItemsProps) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-2">
      {items.map(item => (
        <div
          key={item.id}
          className="flex items-center gap-3 p-3 bg-white border-2 border-purple-200 rounded-xl shadow-card hover:shadow-soft transition-all"
        >
          {/* Thumbnail */}
          <div className="w-14 h-14 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
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
              <span className="text-2xl">
                {item.category === 'top' && '👕'}
                {item.category === 'bottom' && '👖'}
                {item.category === 'dress' && '👗'}
                {item.category === 'outerwear' && '🧥'}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {item.name_ko}
            </p>
            <p className="text-xs text-gray-500">
              {getCategoryNameKo(item.category)}
              {item.price && ` · ${formatPrice(item.price)}`}
            </p>
          </div>

          {/* Remove button */}
          <button
            onClick={() => onRemove(item.id)}
            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group"
          >
            <X className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
          </button>
        </div>
      ))}

      {/* Total */}
      {items.length > 0 && (
        <div className="pt-3 border-t-2 border-gray-200">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 font-medium">선택한 의류</span>
            <span className="font-bold text-purple-600">{items.length}개</span>
          </div>
          {items.some(i => i.price) && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 font-medium">합계</span>
              <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                {formatPrice(items.reduce((sum, i) => sum + (i.price || 0), 0))}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
