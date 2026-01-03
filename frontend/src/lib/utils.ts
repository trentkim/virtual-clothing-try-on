import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(price);
}

export function getCategoryNameKo(category: string): string {
  const names: Record<string, string> = {
    top: '상의',
    bottom: '하의',
    dress: '원피스',
    outerwear: '아우터',
    accessory: '액세서리',
  };
  return names[category] || category;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function downloadImage(base64: string, filename: string = 'try-on-result.png') {
  const link = document.createElement('a');
  link.href = base64.startsWith('data:') ? base64 : `data:image/png;base64,${base64}`;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
