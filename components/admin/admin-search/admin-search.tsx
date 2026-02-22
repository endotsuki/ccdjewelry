'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, DashedLineCircleIcon, Search01Icon } from '@hugeicons/core-free-icons';

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
            <HugeiconsIcon size={23} icon={DashedLineCircleIcon} className='text-primary animate-spin' />
          ) : (
            <HugeiconsIcon size={23} icon={Search01Icon} />
          )}
        </div>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className='h-11 rounded-full pr-11 pl-11'
        />
        {query && (
          <div className='absolute top-1/2 right-1 -translate-y-1/2'>
            <Button variant='ghost' size='icon' onClick={clear} className='group h-9 w-9 hover:bg-transparent'>
              <HugeiconsIcon
                icon={Cancel01Icon}
                size={20}
                className='transition-all duration-300 group-hover:rotate-90 group-hover:text-red-400'
              />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
