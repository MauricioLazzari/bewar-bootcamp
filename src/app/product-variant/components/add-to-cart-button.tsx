'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { addProductToCart } from '@/actions/add-cart-product';
import { Button } from '@/components/ui/button';

interface AddToCartButtonProps {
  productVariantId: string;
  quantity: number;
}

const AddToCartButton = ({ productVariantId, quantity }: AddToCartButtonProps) => {
  // UseQueryClient para invalidar a query do carrinho
  const queryClient = useQueryClient();
  // UseMutation para adicionar o produto ao carrinho
  const { mutate, isPending } = useMutation({
    mutationKey: ['addProductToCart', productVariantId, quantity],
    mutationFn: () =>
      addProductToCart({
        productVariantId,
        quantity,
      }),
    // Invalidar a query do carrinho
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cart'],
      });
    },
    onError: (ctx) => {
      toast.error(ctx.message);
    },
  });

  return (
    <div className="flex flex-col space-y-4 px-2">
      <Button
        className="cursor-pointer rounded-full"
        size="lg"
        variant="outline"
        disabled={isPending}
        onClick={() => mutate()}
      >
        {isPending && <Loader2 className="animate-spin" />}
        Adicionar ao carrinho
      </Button>
    </div>
  );
};

export default AddToCartButton;
