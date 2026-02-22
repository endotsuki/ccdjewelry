'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'name', label: 'Name' },
];

const MIN_PRICE = 0;
const MAX_PRICE = 1000;

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort') || 'newest';
  const minQuery = Number(searchParams.get('min')) || MIN_PRICE;
  const maxQuery = Number(searchParams.get('max')) || MAX_PRICE;

  const [price, setPrice] = useState<[string, string]>([String(minQuery), String(maxQuery)]);

  useEffect(() => {
    setPrice([String(minQuery), String(maxQuery)]);
  }, [minQuery, maxQuery]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('sort', currentSort);
    params.set('min', String(Number(price[0]) || MIN_PRICE));
    params.set('max', String(Number(price[1]) || MAX_PRICE));

    router.push(`/shop?${params.toString()}`);
  };

  const resetFilters = () => {
    router.push('/shop');
  };

  return (
    <Card className='border-border/60 bg-background/80 sticky top-24 border py-9 shadow-sm backdrop-blur-md'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base font-semibold tracking-tight'>Filters</CardTitle>
      </CardHeader>

      <CardContent className='space-y-6'>
        {/* Sort */}
        <div className='space-y-2'>
          <Label className='text-muted-foreground text-sm font-medium'>Sort by</Label>

          <RadioGroup defaultValue={currentSort} className='space-y-2'>
            {SORT_OPTIONS.map((option) => {
              const checked = currentSort === option.value;

              return (
                <Label
                  key={option.value}
                  htmlFor={option.value}
                  onClick={() => router.push(`/shop?sort=${option.value}`)}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all',
                    'hover:bg-muted/60',
                    checked ? 'border-primary bg-primary/5 shadow-sm' : 'border-border'
                  )}
                >
                  <RadioGroupItem id={option.value} value={option.value} />
                  <span className='text-sm font-medium'>{option.label}</span>
                </Label>
              );
            })}
          </RadioGroup>
        </div>

        <div className='space-y-4'>
          <Label className='text-muted-foreground text-sm font-medium'>Price range</Label>

          <div className='flex items-center justify-between text-sm font-medium'>
            <span>${price[0]}</span>
            <span>${price[1]}</span>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <input
              type='number'
              value={price[0]}
              min={MIN_PRICE}
              max={Number(price[1]) || MAX_PRICE}
              onChange={(e) => setPrice([e.target.value, price[1]])}
              className='bg-background rounded-md border px-3 py-2 text-sm'
            />

            <input
              type='number'
              value={price[1]}
              min={Number(price[0]) || MIN_PRICE}
              max={MAX_PRICE}
              onChange={(e) => setPrice([price[0], e.target.value])}
              className='bg-background rounded-md border px-3 py-2 text-sm'
            />
          </div>
        </div>

        <div className='flex gap-2 pt-2'>
          <Button className='flex-1' onClick={applyFilters}>
            Apply Filters
          </Button>

          <Button variant='blocked' className='flex-1' onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
