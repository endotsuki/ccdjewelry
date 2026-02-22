import { Metadata } from 'next';
import { Suspense } from 'react';
import { SiteFooter } from '@/components/layout/site-footer';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductFilters } from '@/components/products/product-filters';
import { Skeleton } from '@/components/ui/skeleton';
import { SiteHeader } from '@/components/layout/site-header';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Shop All Products | CCD Jewelry',
  description: 'Browse our complete collection of premium accessories',
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; min?: string; max?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <SiteHeader />
      <main className='flex-1 pt-16'>
        <div className='container mx-auto px-4 py-8'>
          <div className='mb-8'>
            <h1 className='mb-2 text-3xl font-bold md:text-4xl'>Shop All Products</h1>
            <p className='text-muted-foreground'>Discover our complete collection</p>
          </div>

          <div className='flex flex-col gap-8 md:flex-row'>
            <aside className='w-full self-start md:sticky md:top-28 md:w-64'>
              <ProductFilters />
            </aside>

            <div className='flex-1'>
              <Suspense fallback={<ProductGridSkeleton />}>
                <Suspense fallback={<ProductGridSkeleton />}>
                  <ProductGrid
                    category={params.category}
                    sort={params.sort}
                    min={params.min ? Number(params.min) : undefined}
                    max={params.max ? Number(params.max) : undefined}
                  />
                </Suspense>
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function ProductGridSkeleton() {
  return (
    <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
      {[...Array(6)].map((_, i) => (
        <div key={i} className='space-y-4'>
          <Skeleton className='aspect-square w-full' />
          <Skeleton className='h-4 w-3/4' />
          <Skeleton className='h-4 w-1/2' />
        </div>
      ))}
    </div>
  );
}
