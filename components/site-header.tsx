'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { SearchBar } from './SearchBar';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useRouter } from 'next/navigation';
import { AnimatedThemeToggler } from './animated-theme-toggler';
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

  // If parent doesn't provide cartCount, read from client cart hook
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
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? `border border-black/5 shadow-lg shadow-black/40 backdrop-blur-md dark:border-white/10` : `bg-white dark:bg-transparent`
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
                className='text-foreground/70 hover:text-foreground group relative text-sm font-medium transition-colors dark:text-gray-300 dark:hover:text-white'
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
                <Badge className='fixed -top-1 -right-1 h-3 w-3 items-center justify-center rounded-full bg-blue-500 p-0' />
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
              <SheetContent side='right' className='w-72 p-6 sm:w-[320px]'>
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
                        pathname === item.href ? 'text-primary' : 'text-foreground/70 hover:text-primary dark:text-gray-200'
                      }`}
                    >
                      <HugeiconsIcon size={20} icon={item.icon} />
                      {item.name}
                    </Link>
                  ))}

                  {/* Mobile Recent Order Link */}
                  {recentOrderId && (
                    <Link
                      href={`/orders/${recentOrderId}`}
                      className='text-foreground/70 hover:text-primary flex items-center gap-3 py-2 text-base font-medium transition-colors sm:hidden dark:text-gray-200'
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
