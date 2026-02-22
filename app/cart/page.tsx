import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { CartContent } from '@/components/cart/cart-content';
import { Metadata } from 'next';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Shopping Cart | CCD Jewelry',
  description: 'View your shopping cart',
};

export default function CartPage() {
  return (
    <>
      <div className='flex min-h-screen flex-col'>
        <SiteHeader />
        <main className='flex-1 pt-16'>
          <div className='container mx-auto px-4 py-10'>
            <h1 className='mb-8 text-3xl font-bold'>Shopping Cart</h1>
            <CartContent />
          </div>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
