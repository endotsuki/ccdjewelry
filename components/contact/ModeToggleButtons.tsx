import { Button } from '@/components/ui/button';
import { Navigation03Icon, ShoppingBag02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface ModeToggleButtonsProps {
  cartItemsLength: number;
  orderMode: boolean;
  loading: boolean;
  onSetOrderMode: (mode: boolean) => void;
  onLoadCartItems: () => void;
}

export function ModeToggleButtons({ cartItemsLength, orderMode, loading, onSetOrderMode, onLoadCartItems }: ModeToggleButtonsProps) {
  return (
    <div className='mb-8 flex flex-wrap justify-center gap-4'>
      {cartItemsLength > 0 ? (
        <>
          <Button variant={orderMode ? 'on-hold' : 'archived'} onClick={() => onSetOrderMode(true)}>
            <HugeiconsIcon size={23} icon={ShoppingBag02Icon} />
            Place Order ({cartItemsLength} items)
          </Button>
          <Button variant={!orderMode ? 'on-hold' : 'archived'} onClick={() => onSetOrderMode(false)}>
            <HugeiconsIcon size={23} icon={Navigation03Icon} />
            Send Message
          </Button>
        </>
      ) : (
        <>
          <Button variant='outline' onClick={onLoadCartItems} disabled={loading}>
            <HugeiconsIcon size={16} icon={ShoppingBag02Icon} />
            {loading ? 'Loading Cart...' : 'Load Cart to Order'}
          </Button>
          <Button variant='default' onClick={() => onSetOrderMode(false)}>
            <HugeiconsIcon size={16} icon={Navigation03Icon} />
            Send Message
          </Button>
        </>
      )}
    </div>
  );
}
