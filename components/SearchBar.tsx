'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { sizedImage } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, Loading03Icon, Search01Icon, ShoppingCartRemove02Icon } from '@hugeicons/core-free-icons';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  href: string;
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!query) return (setResults([]), setOpen(false));
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/search?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
        setOpen(true);
      } catch (err) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && (setOpen(false), setFocused(false));
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const clear = () => (setQuery(''), setResults([]), setOpen(false), inputRef.current?.focus());

  return (
    <div className='relative w-full max-w-md' ref={ref}>
      <div className={`relative flex items-center transition-all ${focused ? 'ring-primary/20 rounded-2xl ring-2' : ''}`}>
        <div className='absolute left-4'>
          {loading ? (
            <HugeiconsIcon size={20} icon={Loading03Icon} className='text-muted-foreground h-5 w-5 animate-spin' />
          ) : (
            <HugeiconsIcon size={20} icon={Search01Icon} className='text-muted-foreground h-5 w-5' />
          )}
        </div>
        <Input
          ref={inputRef}
          placeholder='Search products...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          className='placeholder:text-muted-foreground/60 h-11 flex-1 rounded-2xl border-0 bg-transparent pr-12 pl-12 focus-visible:ring-0 focus-visible:ring-offset-0'
        />
        <AnimatePresence>
          {query && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className='absolute right-3'
            >
              <Button variant='ghost' size='icon' onClick={clear} className='hover:bg-muted h-7 w-7 rounded-full'>
                <HugeiconsIcon size={16} icon={Cancel01Icon} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className='bg-background/95 border-border absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl'
          >
            {!loading && results.length > 0 && (
              <div className='border-border/50 border-b px-4 py-2'>
                <p className='text-muted-foreground text-xs font-medium'>
                  {results.length} {results.length === 1 ? 'result' : 'results'}
                </p>
              </div>
            )}

            <div className='[&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 max-h-100 overflow-y-auto p-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-track]:bg-transparent'>
              {!loading && results.length > 0
                ? results.map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                      <Link
                        href={p.href}
                        className='hover:bg-muted/50 group flex items-center gap-3 rounded-lg p-3 transition-all'
                        onClick={() => (setOpen(false), setFocused(false))}
                      >
                        <div className='bg-muted hrink-0 ring-border/50 relative h-14 w-14 overflow-hidden rounded-lg ring-1'>
                          <Image
                            src={p.image ? sizedImage(p.image, 400) : '/placeholder.svg'}
                            alt={p.name}
                            width={56}
                            height={56}
                            className='object-cover transition-transform duration-300 group-hover:scale-110'
                            loading='eager'
                          />
                        </div>
                        <div className='min-w-0 flex-1'>
                          <h6 className='group-hover:text-primary truncate text-sm font-medium transition-colors'>{p.name}</h6>
                          <p className='text-primary mt-0.5 text-sm font-semibold'>${p.price.toFixed(2)}</p>
                        </div>
                        <div className='opacity-0 transition-opacity group-hover:opacity-100'>
                          <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full'>
                            <svg className='text-primary h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                : !loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className='flex flex-col items-center justify-center p-8 text-center'
                    >
                      <div className='bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
                        <HugeiconsIcon size={32} icon={ShoppingCartRemove02Icon} className='text-muted-foreground' />
                      </div>
                      <h3 className='mb-1 text-base font-semibold'>No products found</h3>
                      <p className='text-muted-foreground text-sm'>Try different keywords</p>
                    </motion.div>
                  )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
