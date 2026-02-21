'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrdersTable } from '@/components/admin/orders-table';
import { ProductsTable } from '@/components/admin/products-table';
import { CategoryTable } from '@/components/admin/category-table';
import { AdminSearch } from '@/components/admin/admin-search';
import type { Order, Product } from '@/lib/types';
import type { Category } from '@/components/admin/category-table';
import { AnimatedThemeToggler } from '@/components/animated-theme-toggler';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ChartUpIcon,
  LogoutSquare01Icon,
  Package03Icon,
  ShoppingBag02Icon,
  ShoppingCart02Icon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons';

interface AdminDashboardProps {
  orders: Order[];
  products: Product[];
  categories: Category[];
  totalOrders: number;
  totalProducts: number;
}

type ActiveTab = 'orders' | 'products' | 'categories';

export function AdminDashboard({ orders, products, categories, totalOrders, totalProducts }: AdminDashboardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const [activeTab, setActiveTab] = useState<ActiveTab>('orders');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const savedTab = localStorage.getItem('admin-active-tab');
    if (savedTab === 'orders' || savedTab === 'products' || savedTab === 'categories') {
      setActiveTab(savedTab);
    }
  }, []);

  const handleTabChange = (value: string) => {
    if (value === 'orders' || value === 'products' || value === 'categories') {
      setActiveTab(value);
      localStorage.setItem('admin-active-tab', value);
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const pendingOrders = orders.filter((order) => order.status === 'pending').length;

  const q = query.trim().toLowerCase();

  const filteredOrders = q
    ? orders.filter((o) =>
        [o.order_number, o.customer_name, o.customer_email, o.customer_phone].some((f) =>
          String(f || '')
            .toLowerCase()
            .includes(q)
        )
      )
    : orders;

  const filteredProducts = q
    ? products.filter((p) =>
        [p.name, p.slug].some((f) =>
          String(f || '')
            .toLowerCase()
            .includes(q)
        )
      )
    : products;

  const filteredCategories = q
    ? categories.filter((c) =>
        [c.name, c.slug, c.description].some((f) =>
          String(f || '')
            .toLowerCase()
            .includes(q)
        )
      )
    : categories;

  return (
    <div className='flex min-h-screen flex-col'>
      {/* Header */}
      <header className='border-border bg-background/70 sticky top-0 z-50 w-full border-b py-2 backdrop-blur-sm'>
        <div className='container mx-auto flex items-center justify-between px-4 py-4'>
          <div className='flex items-center gap-2'>
            <img src='/icon.png' className='h-12 w-12' alt='CCD Jewelry' />
            <h1 className='text-lg font-bold'>Admin Dashboard</h1>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <Button variant='outline' onClick={() => router.push('/')} disabled={loading}>
              <HugeiconsIcon size={20} icon={ShoppingCart02Icon} />
              <span className='hidden sm:inline'>Store</span>
            </Button>
            <Button variant='on-hold' onClick={handleLogout} disabled={loading}>
              <HugeiconsIcon size={20} icon={LogoutSquare01Icon} />
              <span className='hidden sm:inline'>Logout</span>
            </Button>
            {mounted && <AnimatedThemeToggler />}
          </div>
        </div>
      </header>

      <main className='container mx-auto flex-1 px-4 py-8'>
        {/* Stats */}
        <div className='mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          <Card className='py-4'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
              <HugeiconsIcon size={30} icon={ChartUpIcon} className='text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <h6 className='text-2xl font-bold'>${totalRevenue.toFixed(2)}</h6>
              <p className='text-muted-foreground text-xs'>From {totalOrders} orders</p>
            </CardContent>
          </Card>

          <Card className='py-4'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>Total Orders</CardTitle>
              <HugeiconsIcon size={30} icon={ShoppingBag02Icon} className='text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <h6 className='text-2xl font-bold'>{totalOrders}</h6>
              <p className='text-muted-foreground text-xs'>{pendingOrders} pending</p>
            </CardContent>
          </Card>

          <Card className='py-4'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>Products</CardTitle>
              <HugeiconsIcon size={30} icon={Package03Icon} className='text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <h6 className='text-2xl font-bold'>{totalProducts}</h6>
              <p className='text-muted-foreground text-xs'>Active listings</p>
            </CardContent>
          </Card>

          <Card className='py-4'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium'>Customers</CardTitle>
              <HugeiconsIcon size={30} icon={UserGroupIcon} className='text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                <h6>{new Set(orders.map((o) => o.customer_email)).size}</h6>
              </div>
              <p className='text-muted-foreground text-xs'>Unique customers</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className='w-full'>
          <TabsList className='bg-muted/50 mb-6 gap-2'>
            <TabsTrigger
              value='orders'
              id='tab-orders'
              aria-controls='tab-orders-content'
              className='data-[state=active]:bg-background data-[state=active]:shadow-sm'
            >
              Orders
            </TabsTrigger>
            <TabsTrigger
              value='products'
              id='tab-products'
              aria-controls='tab-products-content'
              className='data-[state=active]:bg-background data-[state=active]:shadow-sm'
            >
              Products
            </TabsTrigger>
            <TabsTrigger
              value='categories'
              id='tab-categories'
              aria-controls='tab-categories-content'
              className='data-[state=active]:bg-background data-[state=active]:shadow-sm'
            >
              Categories
            </TabsTrigger>
          </TabsList>

          {/* Search */}
          <AdminSearch onSearch={(val) => setQuery(val)} placeholder='Search by order number, customer, product...' />

          <TabsContent value='orders' className='mt-6'>
            <Card className='py-5'>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <OrdersTable orders={filteredOrders} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='products' className='mt-6'>
            <Card className='py-5'>
              <CardHeader>
                <CardTitle>Products</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductsTable products={filteredProducts} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='categories' className='mt-6'>
            <Card className='py-5'>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryTable categories={filteredCategories} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
