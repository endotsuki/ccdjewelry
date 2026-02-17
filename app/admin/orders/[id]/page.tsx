import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteHeader } from '@/components/site-header';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons';

export const runtime = 'edge';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch order with related data
  const { data: order, error } = await supabase.from('orders').select('*').eq('id', id).single();

  if (error || !order) {
    notFound();
  }

  // Fetch order items
  const { data: items = [] } = await supabase
    .from('order_items')
    .select(
      `
      *,
      product:products(id, name, price, image_url, slug)
    `
    )
    .eq('order_id', id);

  const itemsList = items ?? [];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      requested: 'secondary',
      approved: 'default',
      preparing: 'default',
      delivery: 'outline',
      completed: 'outline',
      cancelled: 'destructive',
    };
    return <Badge variant={variants[status] || 'default'}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };

  return (
    <div className='flex min-h-screen flex-col py-16'>
      <SiteHeader />
      <main className='container mx-auto flex-1 px-4 py-8'>
        <div className='mb-6'>
          <Button variant='outline' asChild className='mb-4'>
            <Link href='/admin'>
              <HugeiconsIcon size={23} icon={ArrowLeft02Icon} className='mr-2 h-4 w-4' />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className='grid gap-6'>
          {/* Order Header */}
          <Card className='py-4'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Order #{order.order_number}</CardTitle>
                  <p className='text-muted-foreground mt-4 text-sm'>{format(new Date(order.created_at), "MMMM dd, yyyy 'at' hh:mm a")}</p>
                </div>
                <div className='text-right'>
                  <h6 className='text-2xl font-bold'>${order.total.toFixed(2)}</h6>
                  <div className='mt-2'>{getStatusBadge(order.status)}</div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Customer Information */}
          <Card className='py-4'>
            <CardHeader>
              <CardTitle className='text-lg'>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-muted-foreground text-sm'>Full Name</p>
                  <p className='font-medium'>{order.customer_name}</p>
                </div>
                <div>
                  <p className='text-muted-foreground text-sm'>Email</p>
                  <p className='font-medium'>{order.customer_email}</p>
                </div>
                <div>
                  <p className='text-muted-foreground text-sm'>Phone</p>
                  <p className='font-medium'>{order.customer_phone}</p>
                </div>
                <div>
                  <p className='text-muted-foreground text-sm'>Address</p>
                  <p className='font-medium'>{order.customer_address}</p>
                </div>
              </div>
              {order.customer_notes && (
                <div>
                  <p className='text-muted-foreground text-sm'>Notes</p>
                  <p className='bg-muted rounded-md p-3 font-medium'>{order.customer_notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className='py-4'>
            <CardHeader>
              <CardTitle className='text-lg'>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              {itemsList.length === 0 ? (
                <p className='text-muted-foreground'>No items in this order</p>
              ) : (
                <div className='rounded-md border'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead className='text-right'>Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {itemsList.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Link href={`/products/${item.product?.slug}`} className='text-primary text-base hover:underline'>
                              {item.product?.name || 'Unknown Product'}
                            </Link>
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            <h6>${item.price.toFixed(2)}</h6>
                          </TableCell>
                          <TableCell className='text-right font-medium'>
                            <h6>${(item.price * item.quantity).toFixed(2)}</h6>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              <div className='ml-auto max-w-xs space-y-2 py-4'>
                <div className='flex justify-between text-sm'>
                  <h6 className='text-muted-foreground'>Subtotal</h6>
                  <h6 className='font-medium'>${order.total.toFixed(2)}</h6>
                </div>
                <div className='flex justify-between border-t pt-2 text-lg font-bold'>
                  <h6>Total</h6>
                  <h6 className='text-primary'>${order.total.toFixed(2)}</h6>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
