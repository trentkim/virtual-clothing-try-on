/**
 * API Client for Virtual Clothing Try-On Backend
 * Supports Azure Functions + Azure API Management
 */
import type { 
  ClothingItem, 
  ClothingListResponse, 
  TryOnResponse, 
  CategoryInfo,
  ClothingCategory 
} from '@/types';

// Azure Functions URL (직접 호출 시) 또는 Azure API Management URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7071';

// Azure API Management subscription key (선택사항)
const APIM_SUBSCRIPTION_KEY = process.env.NEXT_PUBLIC_APIM_SUBSCRIPTION_KEY;

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}/api/v1${endpoint}`;
  
  // Azure API Management 헤더 추가
  const headers: HeadersInit = {
    ...options?.headers,
  };
  
  // APIM subscription key가 있으면 헤더에 추가
  if (APIM_SUBSCRIPTION_KEY) {
    (headers as Record<string, string>)['Ocp-Apim-Subscription-Key'] = APIM_SUBSCRIPTION_KEY;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new ApiError(response.status, error.detail || error.error || 'Request failed');
  }

  return response.json();
}

export const api = {
  // Health check
  async health() {
    return fetchApi<{ status: string; version: string }>('/health');
  },

  // Clothing catalog
  async getClothingItems(category?: ClothingCategory): Promise<ClothingListResponse> {
    const params = category ? `?category=${category}` : '';
    return fetchApi<ClothingListResponse>(`/clothing${params}`);
  },

  async getClothingItem(id: string): Promise<ClothingItem> {
    return fetchApi<ClothingItem>(`/clothing/${id}`);
  },

  async getCategories(): Promise<CategoryInfo[]> {
    return fetchApi<CategoryInfo[]>('/clothing/categories');
  },

  async searchClothing(query: string): Promise<ClothingListResponse> {
    return fetchApi<ClothingListResponse>(`/clothing/search/${encodeURIComponent(query)}`);
  },

  // Virtual Try-On
  async tryOn(
    userImage: File,
    clothingIds: string[],
    quality: 'low' | 'medium' | 'high' = 'high'
  ): Promise<TryOnResponse> {
    const formData = new FormData();
    formData.append('user_image', userImage);
    formData.append('clothing_ids', clothingIds.join(','));
    formData.append('quality', quality);

    return fetchApi<TryOnResponse>('/try-on', {
      method: 'POST',
      body: formData,
    });
  },
};

export { ApiError };
