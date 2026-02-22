'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { sizedImage } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { Button } from '../ui/button';

interface ProductRowProps {
  title: string;
  products: Product[] | null;
}

export function ProductRow({ title, products }: ProductRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!products?.length) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.offsetWidth / 2;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className='relative py-12'>
      <div className='relative container mx-auto px-4'>
        <h2 className='mb-6 text-2xl font-bold md:text-3xl'>{title}</h2>

        {/* Scroll Buttons */}
        <Button
          variant={'archived'}
          size={'icon'}
          onClick={() => scroll('left')}
          className='absolute top-1/2 left-0 z-10 -translate-x-1 -translate-y-1/2 rounded-full'
        >
          <HugeiconsIcon size={20} icon={ArrowLeft01Icon} />
        </Button>

        <Button
          variant={'archived'}
          size={'icon'}
          onClick={() => scroll('right')}
          className='absolute top-1/2 right-0 z-10 translate-x-1 -translate-y-1/2 rounded-full'
        >
          <HugeiconsIcon size={20} icon={ArrowRight01Icon} />
        </Button>

        <div ref={scrollRef} className='scrollbar-hide flex gap-4 overflow-x-auto rounded-2xl pb-4'>
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`} className='min-w-56'>
              <Card className='group overflow-hidden transition-all hover:shadow-lg'>
                <CardContent className='p-0'>
                  <div className='relative aspect-4/5 overflow-hidden rounded-2xl'>
                    <Image
                      src={product.image_url ? sizedImage(product.image_url, 400) : '/placeholder.svg'}
                      alt={product.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      className='transition-transform duration-700 ease-out group-hover:scale-110'
                    />

                    {/* Discount Badge */}
                    {product.compare_at_price && Number(product.compare_at_price) > Number(product.price) && (
                      <Badge variant='discount' className='absolute top-4 left-4 z-10'>
                        {Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}% OFF
                      </Badge>
                    )}

                    {/* Premium Bottom Gradient Overlay */}
                    <div className='absolute inset-x-0 bottom-0 p-5'>
                      <div className='absolute inset-0 rounded-2xl bg-linear-to-t from-black/95 via-black/60 to-transparent' />

                      <div className='relative z-10 translate-y-4 pb-5 transition-all duration-500 ease-out group-hover:translate-y-0'>
                        <h3 className='truncate text-base font-semibold tracking-tight text-white'>{product.name}</h3>

                        {product.compare_at_price && Number(product.compare_at_price) > Number(product.price) ? (
                          <div className='mt-1 flex items-center gap-3'>
                            <span className='text-sm font-semibold text-white'>${Number(product.price).toFixed(2)}</span>
                            <span className='text-sm text-white/60 line-through'>${Number(product.compare_at_price).toFixed(2)}</span>
                          </div>
                        ) : (
                          <span className='mt-1 block text-sm text-white/80'>${Number(product.price).toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
