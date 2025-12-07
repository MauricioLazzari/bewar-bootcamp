import Image from 'next/image';
import Link from 'next/link';

import { productVariantTable } from '@/db/schema';
import { cn } from '@/lib/utils';

interface VariantSelectorProps {
  productVariantSelected: string;
  variant: (typeof productVariantTable.$inferSelect)[];
}

const VariantSelector = ({ variant, productVariantSelected }: VariantSelectorProps) => {
  return (
    <div className="flex space-x-2">
      {variant.map((variant) => (
        <Link
          href={`/product-variant/${variant.slug}`}
          key={variant.id}
          className={cn(
            'cursor-pointer rounded-3xl',
            variant.slug === productVariantSelected ? 'border-primary border-2' : ''
          )}
        >
          <Image src={variant.imageUrl} className="rounded-3xl" alt={variant.name} width={100} height={100} />
        </Link>
      ))}
    </div>
  );
};

export default VariantSelector;
