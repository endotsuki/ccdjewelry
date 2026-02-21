import Link from 'next/link';
import Image from 'next/image';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
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
          <div className='mb-8'>
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
                        loading='eager'
                        style={{ objectFit: 'cover' }}
                        className='transition-transform duration-300 group-hover:scale-105'
                      />
                      <div className='absolute inset-0 flex items-end bg-linear-to-t from-black/60 to-transparent p-6'>
                        <div>
                          <h2 className='mb-2 text-2xl font-bold text-white'>{category.name}</h2>
                          <p className='text-sm text-white/90'>{category.description}</p>
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
