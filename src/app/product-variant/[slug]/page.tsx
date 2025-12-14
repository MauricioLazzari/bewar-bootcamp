import { eq } from 'drizzle-orm';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import Footer from '@/app/common/footer';
import Header from '@/app/common/header';
import { db } from '@/db';
import { productVariantTable } from '@/db/schema';
import { formatCents } from '@/helpers/money';

import ProductActions from '../components/product-actions';
import VariantSelector from '../components/variant-selector';

interface ProductVariantPageProps {
  params: Promise<{ slug: string }>;
}

const ProductVariantPage = async ({ params }: ProductVariantPageProps) => {
  // Desestrutura o slug passado na URL
  const { slug } = await params;
  // Busca a variante do produto no banco de dados
  const productVariant = await db.query.productVariantTable.findFirst({
    where: eq(productVariantTable.slug, slug),
    with: {
      product: {
        with: {
          variants: true,
        },
      },
    },
  });
  // Se a variante do produto não existir, retorna not found
  if (!productVariant) {
    return notFound();
  }

  return (
    <>
      <Header />
      <div className="flex flex-col space-y-6">
        {/* Imagem do produto */}
        <div className="relative h-[380px] w-full rounded-3xl">
          <Image src={productVariant.imageUrl} alt={productVariant.product?.name || ''} fill className="object-cover" />
        </div>
        {/* Variantes */}
        <div className="flex space-x-2 px-5">
          <VariantSelector
            variant={productVariant.product?.variants || []}
            productVariantSelected={productVariant.slug}
          />
        </div>
        {/* Informações do produto */}
        <div className="px-5">
          <h2 className="text-lg font-semibold">{productVariant.product?.name}</h2>
          <h3 className="text-muted-foreground text-sm">{productVariant.name}</h3>
          <h3 className="text-lg font-semibold">{formatCents(productVariant.priceInCents)}</h3>
        </div>
        <ProductActions productVariantId={productVariant.id} />
        {/* Descrição do produto */}
        <div className="px-5">
          <p className="text-sm">{productVariant.product?.description}</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductVariantPage;
