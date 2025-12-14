'use client';

import { MinusIcon, PlusIcon } from 'lucide-react';
import { parseAsInteger, useQueryState } from 'nuqs';

import { Button } from '@/components/ui/button';

import AddToCartButton from './add-to-cart-button';

interface ProductActionsProps {
  productVariantId: string;
}

const ProductActions = ({ productVariantId }: ProductActionsProps) => {
  // Estado para controlar a quantidade
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
    <>
      <div className="space-y-4 px-3">
        {/* Botão de quantidade */}
        <div className="space-y-4 px-2">
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
        {/* Botões de compra */}
        <div className="flex flex-col space-y-4 px-2">
          <Button className="cursor-pointer rounded-full" size="lg">
            Comprar agora
          </Button>
        </div>
        {/* Botão de adicionar ao carrinho */}
        <AddToCartButton productVariantId={productVariantId} quantity={quantity} />
      </div>
    </>
  );
};

export default ProductActions;
