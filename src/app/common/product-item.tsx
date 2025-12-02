import Image from 'next/image';
import Link from 'next/link';

import { productTable, productVariantTable } from '@/db/schema';
import { formatCents } from '@/helpers/money';
import { cn } from '@/lib/utils';

interface ProductItemProps {
  // Produto e suas variantes
  product: typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  };
  textContainerClassName?: string;
}

const ProductItem = ({ product, textContainerClassName }: ProductItemProps) => {
  // Pega a primeira variante do produto
  const firstVariant = product.variants[0];

  return (
    <Link href="/">
      {/* Imagem do produto */}
      <Image
        src={firstVariant.imageUrl}
        alt={firstVariant.name}
        sizes="100vw"
        width={0}
        height={0}
        className="h-auto w-full rounded-3xl"
      />
      {/* Informações do produto */}
      <div className={cn('flex max-w-[200px] flex-col gap-1', textContainerClassName)}>
        <p className="truncate text-sm font-medium">{product.name}</p>
        <p className="text-muted-foreground truncate text-xs">{product.description}</p>
        <p className="truncate text-sm font-semibold">{formatCents(firstVariant.priceInCents)}</p>
      </div>
    </Link>
  );
};

export default ProductItem;
