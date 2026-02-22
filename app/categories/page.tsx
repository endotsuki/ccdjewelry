import Link from 'next/link';
import Image from 'next/image';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { Card, CardContent } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import type { Category } from '@/lib/types';
import { Metadata } from 'next';
import { sizedImage } from '@/lib/utils';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Categories | CCD Jewelry',
  description: 'Browse our product categories',
};

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from('categories').select('*');

  return (
    <div className='flex min-h-screen flex-col'>
      <SiteHeader />
      <main className='flex-1 pt-16'>
        <div className='container mx-auto px-4 py-8'>
          <div className='my-8'>
            <h1 className='mb-2 text-3xl font-bold md:text-4xl'>Shop by Category</h1>
            <p className='text-muted-foreground'>Explore our curated collections</p>
          </div>

          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {categories?.map((category: Category) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <Card className='group h-full overflow-hidden transition-all duration-300 hover:shadow-lg'>
                  <CardContent className='p-0'>
                    <div className='relative aspect-4/3 overflow-hidden'>
                      <Image
                        src={category.image_url ? sizedImage(category.image_url, 400) : '/placeholder.svg'}
                        alt={category.name}
                        fill
                        priority
                        style={{ objectFit: 'cover' }}
                        className='transition-transform duration-500 group-hover:scale-110'
                      />
                      <div className='absolute inset-0 flex items-end'>
                        <div className='absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/70 via-black/40 to-transparent transition-all duration-300 group-hover:from-black/80 group-hover:via-black/60' />
                        <div className='relative p-6'>
                          <h2 className='text-2xl font-bold text-white'>{category.name}</h2>
                          <p className='mt-2 translate-y-2 text-white/90 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100'>
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
