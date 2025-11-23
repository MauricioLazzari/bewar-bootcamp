import Image from 'next/image';
import Link from 'next/link';

import { productTable, productVariantTable } from '@/db/schema';
import { formatCents } from '@/helpers/money';

interface ProductItemProps {
  // Produto e suas variantes
  product: typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  };
}

const ProductItem = ({ product }: ProductItemProps) => {
  // Pega a primeira variante do produto
  const firstVariant = product.variants[0];

  return (
    <Link href="/">
      {/* Imagem do produto */}
      <Image src={firstVariant.imageUrl} alt={firstVariant.name} width={150} height={150} className="rounded-3xl" />
      {/* Informações do produto */}
      <div className="flex max-w-[150px] flex-col gap-1">
        <p className="truncate text-sm font-medium">{product.name}</p>
        <p className="text-muted-foreground truncate text-xs">{product.description}</p>
        <p className="truncate text-sm font-semibold">{formatCents(firstVariant.priceInCents)}</p>
      </div>
    </Link>
  );
};

export default ProductItem;
