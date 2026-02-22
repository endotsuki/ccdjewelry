import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { Metadata } from 'next';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Checkout | CCD Jewelry',
  description: 'Complete your order',
};

export default function CheckoutPage() {
  return (
    <>
      <SiteHeader />
      <main className='flex-1'>
        <div className='container mx-auto px-4 py-8'>
          <h1 className='mb-8 text-3xl font-bold md:text-4xl'>Checkout</h1>
          <CheckoutForm />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
