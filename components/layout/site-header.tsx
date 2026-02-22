'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { SearchBar } from '../search-bar';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useRouter } from 'next/navigation';
import { AnimatedThemeToggler } from '../shared/animated-theme-toggler';
import { useCartData } from '@/hooks/useCartData';
import {
  CustomerSupportIcon,
  GeometricShapes01Icon,
  Home02Icon,
  Menu01Icon,
  PackageProcessIcon,
  ShoppingCart02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface SiteHeaderProps {
  cartCount?: number;
}

export function SiteHeader({ cartCount = 0 }: SiteHeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [recentOrderId, setRecentOrderId] = useState<string | null>(null);

  const { cartItems } = useCartData();
  const displayCartCount = typeof cartCount === 'number' && cartCount > 0 ? cartCount : cartItems?.length || 0;

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    try {
      const rid = localStorage.getItem('recent_order_id');
      if (rid) setRecentOrderId(rid);
    } catch {}
  }, []);

  const navigation = [
    { name: 'Home', href: '/', icon: Home02Icon },
    { name: 'Shop', href: '/shop', icon: ShoppingCart02Icon },
    { name: 'Categories', href: '/categories', icon: GeometricShapes01Icon },
    { name: 'Contact', href: '/contact', icon: CustomerSupportIcon },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-white transition-all duration-300 dark:bg-zinc-900 ${
        scrolled
          ? 'border-b border-black/5 shadow-md shadow-black/10 dark:border-white/10 dark:shadow-black/40'
          : 'border-b border-transparent'
      } md:inset-x-4 md:top-4 md:rounded-2xl lg:inset-x-20 xl:inset-x-40`}
    >
      <div className='container mx-auto px-4 sm:px-6'>
        <div className='flex h-16 items-center justify-between gap-4 md:h-20'>
          {/* Logo */}
          <Link href='/' className='flex items-center gap-2'>
            <img src='/icon.png' alt='CCD Logo' className='h-14 w-14' />
          </Link>

          {/* Desktop Nav */}
          <nav className='hidden items-center gap-8 lg:flex xl:gap-12'>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className='relative text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white'
              >
                <p className='flex items-center gap-1.5 text-base'>
                  <HugeiconsIcon size={20} icon={item.icon} />
                  {item.name}
                </p>
                {pathname === item.href && (
                  <motion.div
                    layoutId='active-nav'
                    className='bg-primary absolute inset-x-0 -bottom-1 h-0.5 rounded-full'
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className='flex items-center gap-1 sm:gap-2'>
            <div className='hidden lg:block'>
              <SearchBar />
            </div>

            {mounted && <AnimatedThemeToggler />}

            {mounted && recentOrderId && (
              <Button
                variant='archived'
                size='icon'
                onClick={() => router.push(`/orders/${recentOrderId}`)}
                className='relative hidden h-9 w-9 sm:flex'
              >
                <HugeiconsIcon size={20} icon={PackageProcessIcon} />
                <Badge className='absolute -top-1 -right-1 h-3 w-3 items-center justify-center rounded-full bg-blue-500 p-0' />
              </Button>
            )}

            {/* Cart */}
            <Link href='/cart'>
              <Button variant='archived' size='icon' className='relative h-9 w-9'>
                <HugeiconsIcon size={20} icon={ShoppingCart02Icon} />
                {displayCartCount > 0 && (
                  <Badge className='absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 p-0 text-xs'>
                    {displayCartCount > 9 ? '9+' : displayCartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className='lg:hidden'>
                <Button variant='ghost' size='icon' className='h-9 w-9 rounded-full'>
                  <HugeiconsIcon size={20} icon={Menu01Icon} />
                </Button>
              </SheetTrigger>
              <SheetContent
                side='right'
                className='w-72 border-l border-black/5 bg-white p-6 sm:w-[320px] dark:border-white/10 dark:bg-zinc-900'
              >
                <VisuallyHidden>
                  <SheetTitle>Menu</SheetTitle>
                </VisuallyHidden>

                {/* Mobile Search */}
                <div className='mt-6 mb-8 lg:hidden'>
                  <SearchBar />
                </div>

                <nav className='flex flex-col gap-4'>
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 py-2 text-base font-medium transition-colors ${
                        pathname === item.href
                          ? 'text-primary'
                          : 'hover:text-primary text-zinc-600 dark:text-zinc-300 dark:hover:text-white'
                      }`}
                    >
                      <HugeiconsIcon size={20} icon={item.icon} />
                      {item.name}
                    </Link>
                  ))}

                  {recentOrderId && (
                    <Link
                      href={`/orders/${recentOrderId}`}
                      className='hover:text-primary flex items-center gap-3 py-2 text-base font-medium text-zinc-600 transition-colors sm:hidden dark:text-zinc-300 dark:hover:text-white'
                    >
                      <HugeiconsIcon size={20} icon={PackageProcessIcon} />
                      Recent Order
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
