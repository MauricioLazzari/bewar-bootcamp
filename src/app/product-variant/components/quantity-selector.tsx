'use client';

import { MinusIcon, PlusIcon } from 'lucide-react';
import { parseAsInteger, useQueryState } from 'nuqs';

import { Button } from '@/components/ui/button';

const QuantitySelector = () => {
  const [quantity, setQuantity] = useQueryState('quantity', parseAsInteger.withDefault(1));

  // Diminui a quantidade
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Aumenta a quantidade
  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Quantidade</h3>
      <div className="flex w-[100px] items-center justify-between rounded-lg border">
        <Button size="icon" variant="ghost" onClick={handleDecrement} disabled={quantity === 1}>
          <MinusIcon />
        </Button>
        <span>{quantity}</span>
        <Button size="icon" variant="ghost" onClick={handleIncrement}>
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
};

export default QuantitySelector;
