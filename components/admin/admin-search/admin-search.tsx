'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, Loading03Icon, Search01Icon } from '@hugeicons/core-free-icons';

interface AdminSearchProps {
  onSearch: (q: string) => void;
  placeholder?: string;
}

export function AdminSearch({ onSearch, placeholder = 'Search orders or products...' }: AdminSearchProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const tRef = useRef<number | null>(null);

  useEffect(() => {
    setLoading(true);
    if (tRef.current) window.clearTimeout(tRef.current);
    tRef.current = window.setTimeout(() => {
      onSearch(query.trim());
      setLoading(false);
    }, 250);
    return () => {
      if (tRef.current) window.clearTimeout(tRef.current);
    };
  }, [query, onSearch]);

  const clear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className='w-full max-w-lg'>
      <div className='relative flex items-center'>
        <div className='text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2'>
          {loading ? (
            <HugeiconsIcon size={23} icon={Loading03Icon} className='animate-spin' />
          ) : (
            <HugeiconsIcon size={23} icon={Search01Icon} />
          )}
        </div>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className='h-11 rounded-full pr-10 pl-10'
        />
        {query && (
          <div className='absolute top-1/2 right-2 -translate-y-1/2'>
            <Button variant='ghost' size='icon' onClick={clear} className='h-9 w-9'>
              <HugeiconsIcon icon={Cancel01Icon} size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
