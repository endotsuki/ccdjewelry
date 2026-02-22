import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { AdminDashboard } from '@/components/admin/dashboard/admin-dashboard';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Admin Dashboard | CCD Jewelry',
  description: 'Manage your e-commerce store',
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const adminAuth = cookieStore.get('admin_auth')?.value;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !adminAuth) {
    redirect('/admin/login');
  }

  const [{ data: orders }, { data: products }, { data: categories }, { count: totalOrders }, { count: totalProducts }] = await Promise.all([
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.from('products').select('*').limit(100),
    supabase.from('categories').select('*').order('name'),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
  ]);

  return (
    <AdminDashboard
      orders={orders || []}
      products={products || []}
      categories={categories || []}
      totalOrders={totalOrders || 0}
      totalProducts={totalProducts || 0}
    />
  );
}
