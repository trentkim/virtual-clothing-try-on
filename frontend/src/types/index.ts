/**
 * Type definitions for Virtual Clothing Try-On
 */

export type ClothingCategory = 'top' | 'bottom' | 'dress' | 'outerwear' | 'accessory';

export interface ClothingItem {
  id: string;
  name: string;
  name_ko: string;
  category: ClothingCategory;
  image_url: string;
  thumbnail_url?: string;
  price?: number;
  brand?: string;
  sizes: string[];
  colors: string[];
  description?: string;
}

export interface ClothingListResponse {
  items: ClothingItem[];
  total: number;
  category?: ClothingCategory;
}

export interface TryOnRequest {
  clothing_ids: string[];
  quality?: 'low' | 'medium' | 'high';
}

export interface TryOnResponse {
  success: boolean;
  result_image_url?: string;
  result_image_base64?: string;
  processing_time_ms: number;
  message?: string;
}

export interface CategoryInfo {
  category: string;
  count: number;
  name_ko: string;
}

export interface HealthResponse {
  status: string;
  version: string;
  timestamp: string;
}

export interface ErrorResponse {
  success: boolean;
  error: string;
  detail?: string;
}

// UI State Types
export interface TryOnState {
  userImage: File | null;
  userImagePreview: string | null;
  selectedClothing: ClothingItem[];
  resultImage: string | null;
  isProcessing: boolean;
  error: string | null;
}
