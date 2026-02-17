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
  return (
    <Link href={`/products/${product.slug}`}>
      <Card className='group h-full overflow-hidden transition-all duration-300 hover:shadow-lg'>
        <CardContent className='p-0'>
          <div className='relative aspect-square overflow-hidden'>
            <Image
              src={product.image_url ? sizedImage(product.image_url, 400) : '/placeholder.svg'}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              className='transition-transform duration-300 group-hover:scale-105'
            />

            {product.compare_at_price && (
              <Badge className='absolute top-3 left-3 border-0 bg-black px-2 py-1 text-xs text-white'>
                {Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}% OFF
              </Badge>
            )}
            {product.stock < 10 && product.stock > 0 && (
              <Badge className='absolute top-3 right-3 border-0 bg-amber-500 px-2 py-1 text-xs text-white'>
                Only {product.stock} left!
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge className='bg-destructive absolute top-3 right-3 border-0 px-2 py-1 text-xs text-white'>Out of stock</Badge>
            )}
          </div>
          <div className='p-6'>
            <h3 className='group-hover:text-primary mb-2 text-lg font-semibold transition-colors'>{product.name}</h3>
            <div className='mb-3 flex items-center gap-2 text-sm'>
              <div className='flex'>
                {[...Array(5)].map((_, i) => (
                  <HugeiconsIcon size={16} icon={StarIcon} key={i} className='fill-yellow-400 text-yellow-400' />
                ))}
              </div>
              <span className='text-muted-foreground'>4.8 (127)</span>
            </div>
            <div className='flex items-center gap-2'>
              <h6 className='text-2xl font-bold'>${Number(product.price).toFixed(2)}</h6>
              {product.compare_at_price && Number(product.compare_at_price) > Number(product.price) && (
                <span className='text-muted-foreground text-sm line-through'>${Number(product.compare_at_price).toFixed(2)}</span>
              )}
            </div>

            {product.stock === 0 && <p className='text-muted-foreground mt-2 text-sm'>Out of stock</p>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
