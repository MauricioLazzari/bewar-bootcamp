'use client';

import { useQuery } from '@tanstack/react-query';
import { ShoppingCartIcon } from 'lucide-react';
import Image from 'next/image';

import getCartItems from '@/actions/get-cart-items';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const Cart = () => {
  // UseQuery para buscar os itens do carrinho
  const {
    data: cart,
    isPending: cartIsLoading,
    error: cartError,
  } = useQuery({ queryKey: ['cart'], queryFn: () => getCartItems() });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <ShoppingCartIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle> Carrinho</SheetTitle>
          <SheetDescription>Seus itens</SheetDescription>
        </SheetHeader>
        {cartIsLoading && <div>Carregando...</div>}
        <div className="flex flex-col space-y-4">
          {cart?.cartItems?.map((item) => {
            return (
              <div className="flex items-center space-x-4" key={item.id}>
                <Image
                  className="rounded-2xl"
                  src={item.variant.imageUrl}
                  alt={item.variant.product.name}
                  width={100}
                  height={100}
                />
                <div>
                  <p className="font-semibold">{item.variant.product.name}</p>
                  <p className="text-muted-foreground text-sm">Cor: {item.variant.name}</p>
                  <p className="text-muted-foreground text-sm">Quantidade: {item.quantity}</p>
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
