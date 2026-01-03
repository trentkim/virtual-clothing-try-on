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
          className="flex items-center gap-3 p-2 bg-white border border-gray-200 rounded-lg"
        >
          {/* Thumbnail */}
          <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
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
            <p className="text-sm font-medium text-gray-900 truncate">
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
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      ))}

      {/* Total */}
      {items.length > 0 && (
        <div className="pt-2 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">선택한 의류</span>
            <span className="font-medium">{items.length}개</span>
          </div>
          {items.some(i => i.price) && (
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">합계</span>
              <span className="font-semibold text-primary">
                {formatPrice(items.reduce((sum, i) => sum + (i.price || 0), 0))}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
