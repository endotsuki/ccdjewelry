import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sizedImage(path: string | null | undefined) {
  if (!path) return '/placeholder.svg';

  // If already full URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'product-images';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    return `/images/${path}`;
  }

  const cleanBase = path.replace(/^\/?images\//, '').replace(/_(1080|400|48)(?=\.webp$)/, '');

  return `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/${bucket}/${cleanBase}`;
}
