'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { HugeiconsIcon } from '@hugeicons/react';
import { ImageUpload01Icon, Delete01Icon, Loading03Icon } from '@hugeicons/core-free-icons';
import type { Category } from './category-table';

interface CategoryDialogProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function toSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

const compressToWebP = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1080;
        const ctx = canvas.getContext('2d')!;
        const imgRatio = img.naturalWidth / img.naturalHeight;
        let drawWidth = 1080,
          drawHeight = 1080,
          drawX = 0,
          drawY = 0;
        if (imgRatio > 1) {
          drawWidth = 1080 * imgRatio;
          drawX = -(drawWidth - 1080) / 2;
        } else {
          drawHeight = 1080 / imgRatio;
          drawY = -(drawHeight - 1080) / 2;
        }
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Failed to convert image to WebP'))), 'image/webp', 0.8);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!uploadPreset || !cloudName) throw new Error('Cloudinary upload preset not configured');

  const compressedBlob = await compressToWebP(file);
  const compressedFile = new File([compressedBlob], `${file.name.split('.')[0]}.webp`, { type: 'image/webp' });

  const data = new FormData();
  data.append('file', compressedFile);
  data.append('upload_preset', uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: data,
  });

  if (!response.ok) throw new Error(`Cloudinary upload failed: ${response.statusText}`);

  const result = await response.json();
  return result.secure_url;
};

export function CategoryDialog({ category, open, onOpenChange }: CategoryDialogProps) {
  const isEdit = !!category;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName(category?.name ?? '');
      setSlug(category?.slug ?? '');
      setDescription(category?.description ?? '');
      setImageUrl(category?.image_url ?? '');
      setSlugManuallyEdited(false);
      setError(null);
    }
  }, [open, category]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slugManuallyEdited) setSlug(toSlug(val));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const url = await uploadImageToCloudinary(file);
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !slug.trim()) {
      setError('Name and slug are required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || null,
        image_url: imageUrl || null,
      };

      const res = await fetch(isEdit ? `/api/categories/${category.id}` : `/api/categories`, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onOpenChange(false);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to save category.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Category' : 'Add Category'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Name */}
          <div className='space-y-2'>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder='e.g. Summer Collection' required />
          </div>

          {/* Slug */}
          <div className='space-y-2'>
            <Label>Slug</Label>
            <Input
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugManuallyEdited(true);
              }}
              placeholder='e.g. summer-collection'
              required
            />
          </div>

          {/* Description */}
          <div className='space-y-2'>
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Optional description' rows={3} />
          </div>

          {/* Image */}
          <div className='space-y-2'>
            <Label>Image</Label>

            {imageUrl ? (
              /* Preview with replace / remove */
              <div className='relative'>
                <div className='bg-muted relative h-48 w-full overflow-hidden rounded-md border'>
                  <Image src={imageUrl} alt='Category image' fill style={{ objectFit: 'cover' }} />
                </div>
                <div className='absolute top-2 right-2 flex gap-1'>
                  <Button
                    type='button'
                    size='icon'
                    variant='secondary'
                    className='h-10 w-10 opacity-90'
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <HugeiconsIcon size={20} icon={Loading03Icon} className='animate-spin' />
                    ) : (
                      <HugeiconsIcon size={20} icon={ImageUpload01Icon} />
                    )}
                  </Button>
                  <Button
                    type='button'
                    size='icon'
                    variant='destructive'
                    className='h-10 w-10 opacity-90'
                    onClick={() => setImageUrl('')}
                    disabled={uploading}
                  >
                    <HugeiconsIcon size={20} icon={Delete01Icon} />
                  </Button>
                </div>
              </div>
            ) : (
              /* Upload button */
              <Button type='button' variant='outline' className='w-full' onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                {uploading ? (
                  <>
                    <HugeiconsIcon size={23} icon={Loading03Icon} className='mr-2 animate-spin' /> Uploading...
                  </>
                ) : (
                  <>
                    <HugeiconsIcon size={23} icon={ImageUpload01Icon} /> Choose Image
                  </>
                )}
              </Button>
            )}

            <input ref={fileInputRef} type='file' accept='image/*' className='hidden' onChange={handleFileChange} />
            <p className='text-muted-foreground text-xs'>Image will be compressed and converted to WebP (1080×1080).</p>
          </div>

          {error && <p className='text-destructive text-sm'>{error}</p>}

          <DialogFooter>
            <Button type='button' variant='destructive' onClick={() => onOpenChange(false)} disabled={saving || uploading}>
              Cancel
            </Button>
            <Button type='submit' disabled={saving || uploading}>
              {saving ? 'Saving...' : isEdit ? 'Update Category' : 'Create Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
