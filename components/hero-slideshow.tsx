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

// Separate component for each slide to prevent closure issues
function Slide({ product, isActive }: { product: any; isActive: boolean }) {
  return (
    <div className={`absolute inset-0 transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
      <div className='absolute inset-0 m-5 overflow-hidden rounded-2xl'>
        <Image
          src={product.image_url ? sizedImage(product.image_url, 1080) : '/placeholder.svg'}
          alt={product.name}
          fill
          style={{ objectFit: 'cover' }}
        />
        <div className='absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-transparent' />
      </div>

      <div className='relative container mx-auto flex h-full items-center px-4'>
        <div className='max-w-2xl text-white'>
          <Badge variant='in-active' className='mb-4'>
            {product.compare_at_price ? 'Special Offer' : 'New Arrival'}
          </Badge>
          <h2 className='mb-4 text-4xl font-bold md:text-6xl'>{product.name}</h2>
          <p className='mb-6 max-w-xl text-lg text-white/90 md:text-xl'>{product.description}</p>
          <div className='mb-8 flex items-baseline gap-3'>
            <h6 className='text-4xl font-bold md:text-5xl'>${product.price}</h6>
            {product.compare_at_price && <h6 className='text-xl text-white/60 line-through'>${product.compare_at_price}</h6>}
          </div>
          <div className='flex flex-col gap-4 sm:flex-row'>
            <Button variant='on-hold' asChild size='lg'>
              <Link href={`/products/${product.slug}`}>
                View Details <HugeiconsIcon size={23} icon={ArrowRight02Icon} className='ml-2' />
              </Link>
            </Button>
            <Button size='lg' variant='secondary' asChild>
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

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (products.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [products.length]);

  if (products.length === 0) {
    return (
      <section className='from-primary/10 via-background to-secondary/10 relative h-150 bg-linear-to-br'>
        <div className='container mx-auto flex h-full items-center justify-center px-4'>
          <div className='text-center'>
            <h1 className='mb-6 text-4xl font-bold md:text-6xl'>Welcome to CCD Jewelry</h1>
            <p className='text-muted-foreground mb-8 text-lg md:text-xl'>Discover our premium collection of accessories</p>
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
    <section className='bg-background relative h-150 overflow-hidden md:h-175'>
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
        className='absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full'
      >
        <HugeiconsIcon size={23} icon={ArrowLeft01Icon} />
      </Button>
      <Button
        size='icon'
        variant='on-hold'
        onClick={() => setCurrentSlide((prev) => (prev + 1) % products.length)}
        className='absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full'
      >
        <HugeiconsIcon size={23} icon={ArrowRight01Icon} />
      </Button>

      {/* Slide Indicators */}
      <div className='absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2'>
        {products.map((_: any, index: number) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
