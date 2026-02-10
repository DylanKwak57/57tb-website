import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const BASE_PATH = '/57tb-website';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `฿${price.toLocaleString()}`;
}

export function assetPath(path: string): string {
  return `${BASE_PATH}${path}`;
}
