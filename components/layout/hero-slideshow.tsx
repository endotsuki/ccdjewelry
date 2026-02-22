'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { sizedImage } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, ArrowRight01Icon, ArrowRight02Icon } from '@hugeicons/core-free-icons';

interface HeroSlideshowProps {
  products: Product[];
}

function Slide({ product, isActive }: { product: any; isActive: boolean }) {
  return (
    <div className={`absolute inset-0 transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
      <div className='absolute inset-0 m-2 overflow-hidden rounded-xl sm:m-5 sm:rounded-2xl'>
        <Image
          src={product.image_url ? sizedImage(product.image_url, 1080) : '/placeholder.svg'}
          alt={product.name}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className='absolute inset-0 bg-linear-to-r from-black/75 via-black/50 to-transparent' />
      </div>

      <div className='relative container mx-auto flex h-full items-center px-6 sm:px-8'>
        <div className='max-w-xs text-white sm:max-w-md md:max-w-2xl'>
          <Badge variant='in-active' className='mb-2 text-xs sm:mb-4 sm:text-sm'>
            {product.compare_at_price ? 'Special Offer' : 'New Arrival'}
          </Badge>
          <h2 className='mb-2 text-2xl leading-tight font-bold sm:mb-4 sm:text-4xl md:text-6xl'>{product.name}</h2>
          <p className='mb-4 line-clamp-3 max-w-xl text-sm text-white/90 sm:mb-6 sm:line-clamp-none sm:text-lg md:text-xl'>
            {product.description}
          </p>
          <div className='mb-4 flex items-baseline gap-2 sm:mb-8 sm:gap-3'>
            <h6 className='text-2xl font-bold sm:text-4xl md:text-5xl'>${product.price}</h6>
            {product.compare_at_price && <h6 className='text-base text-white/60 line-through sm:text-xl'>${product.compare_at_price}</h6>}
          </div>
          <div className='flex flex-col gap-2 sm:flex-row sm:gap-4'>
            <Button variant='on-hold' asChild size='sm' className='sm:h-11 sm:px-6 sm:text-base'>
              <Link href={`/products/${product.slug}`}>
                View Details <HugeiconsIcon size={18} icon={ArrowRight02Icon} className='ml-2' />
              </Link>
            </Button>
            <Button size='sm' className='sm:h-11 sm:px-6 sm:text-base' variant='secondary' asChild>
              <Link href='/shop'>Browse Collection</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSlideshow({ products }: HeroSlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (products.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [products.length]);

  if (products.length === 0) {
    return (
      <section className='from-primary/10 via-background to-secondary/10 relative h-[60vh] min-h-72 bg-linear-to-br'>
        <div className='container mx-auto flex h-full items-center justify-center px-4'>
          <div className='px-4 text-center'>
            <h1 className='mb-4 text-3xl font-bold sm:mb-6 sm:text-4xl md:text-6xl'>Welcome to CCD Jewelry</h1>
            <p className='text-muted-foreground mb-6 text-base sm:mb-8 sm:text-lg md:text-xl'>
              Discover our premium collection of accessories
            </p>
            <Button size='lg' asChild>
              <Link href='/shop'>
                Shop Now <HugeiconsIcon size={23} icon={ArrowRight02Icon} className='ml-2' />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='bg-background relative h-[60vh] min-h-80 overflow-hidden sm:h-[70vh] md:h-175'>
      {/* Slides */}
      <div className='relative h-full'>
        {products.map((product: any, index: number) => (
          <Slide key={product.id} product={product} isActive={index === currentSlide} />
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        size='icon'
        variant='on-hold'
        onClick={() => setCurrentSlide((prev) => (prev - 1 + products.length) % products.length)}
        className='absolute top-1/2 z-10 h-8 w-8 translate-x-1/2 -translate-y-1/2 rounded-full sm:left-4 sm:h-12 sm:w-12'
      >
        <HugeiconsIcon size={23} icon={ArrowLeft01Icon} />
      </Button>
      <Button
        size='icon'
        variant='on-hold'
        onClick={() => setCurrentSlide((prev) => (prev + 1) % products.length)}
        className='absolute top-1/2 z-10 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full sm:right-4 sm:h-12 sm:w-12'
      >
        <HugeiconsIcon size={23} icon={ArrowRight01Icon} />
      </Button>

      {/* Slide Indicators */}
      <div className='absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 sm:bottom-8 sm:gap-2'>
        {products.map((_: any, index: number) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 rounded-full transition-all sm:h-2 ${
              index === currentSlide ? 'w-6 bg-white sm:w-8' : 'w-1.5 bg-white/50 hover:bg-white/75 sm:w-2'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
