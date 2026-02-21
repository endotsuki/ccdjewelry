'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { CategoryDialog } from './category-dialog';
import { useRouter } from 'next/navigation';
import { sizedImage } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { Edit04Icon, Delete01Icon, GeometricShapes01Icon, ArrowUpRight01Icon } from '@hugeicons/core-free-icons';
import Link from 'next/link';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  created_at: string;
}

interface CategoryTableProps {
  categories: Category[];
}

export function CategoryTable({ categories }: CategoryTableProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<Category | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Category | null>(null);
  const [page, setPage] = useState(1);

  const perPage = 10;
  const sorted = [...categories].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const total = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  const openDialog = (cat: Category | null) => {
    setSelected(cat);
    setDialogOpen(true);
  };

  const openDelete = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (cat) {
      setToDelete(cat);
      setDeleteOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(toDelete.id);
    setDeleteOpen(false);
    try {
      const res = await fetch(`/api/categories/${toDelete.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to delete category');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to delete category');
    } finally {
      setDeleting(null);
      setToDelete(null);
    }
  };

  const closeDialog = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelected(null);
      router.refresh();
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-end'>
        <Button variant={'on-hold'} onClick={() => openDialog(null)}>
          <HugeiconsIcon size={20} icon={GeometricShapes01Icon} />
          Add Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className='text-muted-foreground py-8 text-center'>No categories yet. Click "Add Category" to create your first category.</div>
      ) : (
        <div className='rounded-md border p-5'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <h6>Category</h6>
                </TableHead>
                <TableHead>
                  <h6>Slug</h6>
                </TableHead>
                <TableHead>
                  <h6>Description</h6>
                </TableHead>
                <TableHead className='text-right'>
                  <h6>Actions</h6>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div
                      className='flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-75'
                      onClick={() => openDialog(c)}
                    >
                      <div className='bg-muted relative h-12 w-12 overflow-hidden rounded-md'>
                        <Image
                          src={c.image_url ? sizedImage(c.image_url, 48) : '/placeholder.svg'}
                          alt={c.name}
                          fill
                          sizes='32'
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className='flex-1'>
                        <h6 className='font-medium'>{c.name}</h6>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className='text-muted-foreground text-sm'>{c.slug}</span>
                  </TableCell>
                  <TableCell>
                    <span className='text-muted-foreground max-w-xs truncate text-sm'>
                      {c.description || <span className='italic opacity-50'>No description</span>}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center justify-end gap-2'>
                      <Button variant='outline' size='icon' className='h-9 w-9'>
                        <Link href={`/categories/${c.slug}`} target='_blank'>
                          <HugeiconsIcon size={20} icon={ArrowUpRight01Icon} />
                        </Link>
                      </Button>
                      <Button variant='outline' size='icon' onClick={() => openDialog(c)} className='h-9 w-9'>
                        <HugeiconsIcon size={20} icon={Edit04Icon} />
                      </Button>
                      <Button
                        variant='destructive'
                        size='icon'
                        onClick={() => openDelete(c.id)}
                        disabled={deleting === c.id}
                        className='h-9 w-9'
                      >
                        <HugeiconsIcon size={20} icon={Delete01Icon} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className='mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <p className='text-muted-foreground text-sm'>
              Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, sorted.length)} of {sorted.length} categories
            </p>
            {total > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href='#'
                      onClick={(e) => (e.preventDefault(), page > 1 && setPage(page - 1))}
                      className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {Array.from({ length: total }, (_, i) => i + 1).map((pg) => (
                    <PaginationItem key={pg}>
                      <PaginationLink
                        href='#'
                        size='default'
                        isActive={pg === page}
                        onClick={(e) => (e.preventDefault(), setPage(pg))}
                        className='cursor-pointer border'
                      >
                        {pg}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href='#'
                      onClick={(e) => (e.preventDefault(), page < total && setPage(page + 1))}
                      className={page === total ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      )}

      <CategoryDialog category={selected} open={dialogOpen} onOpenChange={closeDialog} />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{toDelete?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button type='button' variant='destructive' onClick={confirmDelete} disabled={deleting === toDelete?.id}>
              {deleting === toDelete?.id ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
