import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { sizedImage } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { StarIcon } from '@hugeicons/core-free-icons';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.compare_at_price && Number(product.compare_at_price) > Number(product.price);

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className='group bg-background h-full overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl'>
        <CardContent className='relative p-0'>
          {/* Image Section */}
          <div className='relative aspect-4/5 overflow-hidden'>
            <Image
              src={product.image_url ? sizedImage(product.image_url, 400) : '/placeholder.svg'}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              className='transition-transform duration-700 ease-out group-hover:scale-110'
            />

            {/* Discount Badge */}
            {hasDiscount && (
              <Badge className='absolute top-4 left-4 z-10 border-0 bg-black/80 text-white backdrop-blur-md'>
                {Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)}% OFF
              </Badge>
            )}

            {/* Stock Badge */}
            {product.stock < 10 && product.stock > 0 && (
              <Badge className='absolute top-4 right-4 z-10 border-0 bg-amber-500/90 text-white backdrop-blur-md'>
                Only {product.stock} left
              </Badge>
            )}

            {product.stock === 0 && (
              <Badge className='bg-destructive/90 absolute top-4 right-4 z-10 border-0 text-white backdrop-blur-md'>Out of stock</Badge>
            )}

            {/* Bottom Blur Gradient */}
            <div className='absolute inset-x-0 bottom-0 h-32'>
              <div className='absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent' />

              <div className='relative z-10 translate-y-4 p-5 text-white transition-all duration-500 ease-out group-hover:translate-y-0'>
                <h3 className='truncate text-base font-semibold tracking-tight'>{product.name}</h3>
                {/* Rating */}
                <div className='mt-1 flex items-center gap-2 text-xs'>
                  <div className='flex'>
                    {[...Array(5)].map((_, i) => (
                      <HugeiconsIcon size={14} icon={StarIcon} key={i} className='fill-yellow-400 text-yellow-400' />
                    ))}
                  </div>
                  <span className='text-white/70'>4.8 (127)</span>
                </div>

                {/* Price */}
                <div className='mt-2 flex items-center gap-3'>
                  <span className='text-sm font-semibold'>${Number(product.price).toFixed(2)}</span>

                  {hasDiscount && (
                    <span className='text-sm text-white/60 line-through'>${Number(product.compare_at_price).toFixed(2)}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
